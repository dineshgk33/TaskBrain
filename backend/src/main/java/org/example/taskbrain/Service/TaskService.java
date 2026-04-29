package org.example.taskbrain.service;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.model.*;
import org.example.taskbrain.repository.EmployeeProfileRepository;
import org.example.taskbrain.repository.ProjectRepository;
import org.example.taskbrain.repository.TaskRepository;
import org.example.taskbrain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EmployeeProfileRepository profileRepository;

    /**
     * Creates a task and handles allocation logic based on the AllocationType.
     */
    public Task createTask(Task task, Long projectId) {
        // 1. Link to Project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        task.setProject(project);

        // 2. Set Default Status
        if (task.getStatus() == null) {
            task.setStatus("NOT_STARTED");
        }

        // 3. Tech Validation
        if (task.getFixedTechnology() != null &&
                !task.getPossibleTechnologies().toLowerCase().contains(task.getFixedTechnology().toLowerCase())) {
            throw new RuntimeException("Fixed technology must be one of the possible technologies");
        }

        // 4. Allocation Logic
        AllocationType type = task.getAllocationType();
        switch (type) {
            case MANUAL -> {
                if (task.getAssignedEmployees() == null || task.getAssignedEmployees().isEmpty()) {
                    throw new RuntimeException("MANUAL allocation requires at least one employee selection");
                }
                // Verify all employees exist
                java.util.List<User> validEmployees = new java.util.ArrayList<>();
                for (User u : task.getAssignedEmployees()) {
                    validEmployees.add(userRepository.findById(u.getUserId())
                            .orElseThrow(() -> new RuntimeException("Employee not found: " + u.getUserId())));
                }
                task.setAssignedEmployees(validEmployees);
            }
            case HYBRID -> {
                if (task.getAssignedEmployees() != null && !task.getAssignedEmployees().isEmpty()) {
                    java.util.List<User> validEmployees = new java.util.ArrayList<>();
                    for (User u : task.getAssignedEmployees()) {
                        validEmployees.add(userRepository.findById(u.getUserId())
                                .orElseThrow(
                                        () -> new RuntimeException("Preferred employee not found: " + u.getUserId())));
                    }
                    task.setAssignedEmployees(validEmployees);
                } else {
                    java.util.List<User> assigned = new java.util.ArrayList<>();
                    User aiSelected = aiSelectEmployee(task);
                    if (aiSelected != null)
                        assigned.add(aiSelected);
                    task.setAssignedEmployees(assigned);
                }
            }
            case AUTOMATIC -> {
                java.util.List<User> assigned = new java.util.ArrayList<>();
                User aiSelected = aiSelectEmployee(task);
                if (aiSelected != null)
                    assigned.add(aiSelected);
                task.setAssignedEmployees(assigned);
            }
        }

        return taskRepository.save(task);
    }

    /**
     * AI Logic: Selects the best employee based on skills,
     * FREE availability, and the highest performance rating.
     * Note: Currently selects only ONE best candidate for single-task creation
     * flow.
     */
    private User aiSelectEmployee(Task task) {
        return profileRepository.findAll().stream()
                .filter(p -> p.getSkills() != null &&
                        p.getSkills().toLowerCase().contains(task.getRequiredSkill().toLowerCase()))
                .filter(p -> p.getAvailability() == AvailabilityStatus.FREE)
                .max((a, b) -> Double.compare(a.getPerformanceRating(), b.getPerformanceRating()))
                .map(EmployeeProfile::getUser)
                // If no one matches, we return null so the PM can assign manually later
                .orElse(null);
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProject_ProjectId(projectId);
    }

    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByAssignedEmployees_UserId(userId);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task updateProgress(Long taskId, int progress) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (progress < 0 || progress > 100) {
            throw new RuntimeException("Progress must be between 0 and 100");
        }

        task.setProgress(progress);

        // Lifecycle Rule: If in DESIGN phase and progress reaches 10%, trigger PM
        // approval
        // DISABLED: User manually submits via "Send to Manager" button.
        // if (task.getPhase() == TaskPhase.DESIGN && progress >= 10 &&
        // "NONE".equals(task.getApprovalStatus())) {
        // task.setApprovalStatus("PENDING"); // Flags for PM review
        // }

        // Auto-complete if 100% and not blocked by approval
        if (progress == 100 && !"PENDING".equals(task.getApprovalStatus())) {
            task.setStatus("COMPLETED");
        } else if (progress > 0 && "NOT_STARTED".equals(task.getStatus())) {
            task.setStatus("IN_PROGRESS");
        }

        return taskRepository.save(task);
    }

    public Task approveTask(Long taskId, boolean approved, String feedback) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (approved) {
            task.setApprovalStatus("APPROVED");
            // Logic to move to next phase? For now, just unblock.
            // Requirement says: "If approved, update is shared... Impl starts"
            if (task.getPhase() == TaskPhase.DESIGN) {
                // Move to Implementation phase automatically? Or let user do it?
                // Let's auto-move to indicate flow.
                task.setPhase(TaskPhase.IMPLEMENTATION);
                task.setApprovalStatus("NONE"); // Reset for next phase if needed
                task.setDescription(task.getDescription() + "\n[System]: Design Approved. Proceed to Implementation.");
            }
        } else {
            task.setApprovalStatus("REJECTED");
            task.setDescription(task.getDescription() + "\n[PM Feedback]: " + feedback);
            // Cycle repeats: Designer must fix.
            task.setProgress(0); // Reset progress? Or keep it? Requirement: "Sent back for redesign".
            // Let's reset progress to 0 to force re-work through the 10% gate if they want.
            // Or maybe just leave it and they have to update again.
            // "Cycle repeats" implies going back.
        }

        return taskRepository.save(task);
    }

    public Task updateDesignRequirements(Long taskId, String requirements) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setDesignRequirements(requirements);
        Task savedTask = taskRepository.save(task);
        System.out.println("DEBUG: Saved Task " + taskId + " with requirements: " + savedTask.getDesignRequirements());
        return savedTask;
    }

    public Task submitForApproval(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        // Optional: specific check if designImageUrl is present before allowing
        // submission
        if (task.getPhase() == TaskPhase.DESIGN
                && (task.getDesignImageUrls() == null || task.getDesignImageUrls().isEmpty())) {
            throw new RuntimeException("Please upload at least one design image before submitting.");
        }
        task.setApprovalStatus("PENDING");
        return taskRepository.save(task);
    }

    public Task uploadDesignImage(Long taskId, MultipartFile file) throws IOException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }

        // Create uploads directory if not exists
        String uploadDir = "uploads/designs/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Update Task
        task.getDesignImageUrls().add(uploadDir + fileName);

        return taskRepository.save(task);
    }

    public Task deleteDesignImage(Long taskId, String imageUrl) throws IOException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getDesignImageUrls().contains(imageUrl)) {
            // Remove from list
            task.getDesignImageUrls().remove(imageUrl);

            // Delete file from system
            Path filePath = Paths.get(imageUrl);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("Image URL not found in task");
        }
    }
}
