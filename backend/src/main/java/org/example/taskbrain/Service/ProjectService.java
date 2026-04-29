package org.example.taskbrain.service;

import org.example.taskbrain.model.Project;
import org.example.taskbrain.model.User;
import org.example.taskbrain.repository.ProjectRepository;
import org.example.taskbrain.repository.UserRepository;
import org.example.taskbrain.model.AllocationType;
import org.example.taskbrain.model.Task;
import org.example.taskbrain.model.Role;
import org.example.taskbrain.repository.TaskRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final AIService aiService;

    public Project createProject(Project project, String email) {

        User projectManager = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Project Manager not found"));

        project.setCreatedBy(projectManager);

        if (project.getStatus() == null) {
            project.setStatus("PLANNED");
        }

        return projectRepository.save(project);
    }

    public java.util.List<Project> getAllProjects(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("DEBUG: Found user ID: " + user.getUserId());
        return projectRepository.findByCreatedBy(user);
    }

    public Project updateProjectTechStack(Long projectId, Project techStackUpdate) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (techStackUpdate.getFrontendTech() != null)
            project.setFrontendTech(techStackUpdate.getFrontendTech());
        if (techStackUpdate.getBackendTech() != null)
            project.setBackendTech(techStackUpdate.getBackendTech());
        if (techStackUpdate.getDatabaseTech() != null)
            project.setDatabaseTech(techStackUpdate.getDatabaseTech());
        if (techStackUpdate.getAiMlTech() != null)
            project.setAiMlTech(techStackUpdate.getAiMlTech());
        if (techStackUpdate.getToolsTech() != null)
            project.setToolsTech(techStackUpdate.getToolsTech());

        return projectRepository.save(project);
    }

    public Project updateProject(Long projectId, Project projectDetails) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setProjectName(projectDetails.getProjectName());
        project.setDescription(projectDetails.getDescription());
        project.setStartDate(projectDetails.getStartDate());
        project.setDeadline(projectDetails.getDeadline());
        project.setPriority(projectDetails.getPriority());
        project.setStatus(projectDetails.getStatus());

        return projectRepository.save(project);
    }

    @org.springframework.transaction.annotation.Transactional
    public java.util.List<Task> autoAllocateTask(Long projectId, org.example.taskbrain.dto.AllocationRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Delete existing tasks for this project to ensure a clean re-allocation (Wipe
        // and Replace)
        taskRepository.deleteByProject_ProjectId(projectId);

        String type = request.getType() != null ? request.getType().toUpperCase() : "AUTO";
        java.util.List<Task> allCreatedTasks = new java.util.ArrayList<>();

        // Case 1: MANUAL - Only specified users
        if ("MANUAL".equals(type)) {
            if (request.getManualUserIds() != null && !request.getManualUserIds().isEmpty()) {
                java.util.List<User> manualCandidates = userRepository.findAllById(request.getManualUserIds());
                // Call AI to generate tasks for these SPECIFIC users
                String aiResponse = aiService.recommendEmployeeForProject(project, manualCandidates,
                        manualCandidates.size());
                allCreatedTasks.addAll(parseAiResponseAndSave(aiResponse, project, AllocationType.MANUAL));
            }
        }

        // Case 2: HYBRID - Manual users + Auto count
        else if ("HYBRID".equals(type)) {
            // First, do Manual part
            if (request.getManualUserIds() != null && !request.getManualUserIds().isEmpty()) {
                java.util.List<User> manualCandidates = userRepository.findAllById(request.getManualUserIds());
                String aiResponseManual = aiService.recommendEmployeeForProject(project, manualCandidates,
                        manualCandidates.size());
                allCreatedTasks.addAll(parseAiResponseAndSave(aiResponseManual, project, AllocationType.MANUAL));
            }

            // Second, do Auto part if count > 0
            if (request.getAutoCount() > 0) {
                java.util.List<User> allCandidates = new java.util.ArrayList<>();
                allCandidates.addAll(userRepository.findByRole(Role.EMPLOYEE));
                allCandidates.addAll(userRepository.findByRole(Role.PROJECT_MANAGER));
                allCandidates.addAll(userRepository.findByRole(Role.DESIGNER));

                // Exclude manually selected users
                if (request.getManualUserIds() != null) {
                    allCandidates.removeIf(u -> request.getManualUserIds().contains(u.getUserId()));
                }

                if (!allCandidates.isEmpty()) {
                    int finalCount = Math.min(request.getAutoCount(), allCandidates.size());
                    String aiResponseAuto = aiService.recommendEmployeeForProject(project, allCandidates, finalCount);
                    allCreatedTasks.addAll(parseAiResponseAndSave(aiResponseAuto, project, AllocationType.AUTOMATIC));
                }
            }
        }

        // Case 3: AUTO - Only AI selection from pool
        else if ("AUTO".equals(type)) {
            int count = request.getAutoCount();
            if (count > 0) {
                java.util.List<User> candidates = new java.util.ArrayList<>();
                candidates.addAll(userRepository.findByRole(Role.EMPLOYEE));
                candidates.addAll(userRepository.findByRole(Role.PROJECT_MANAGER));
                candidates.addAll(userRepository.findByRole(Role.DESIGNER));

                // Reuse manualUserIds if sent by accident? No, strict AUTO implies pure pool.
                // But let's NOT exclude anyone specific unless we implemented "exclude list".
                // Current requirement: Just pick best from all.

                if (candidates.isEmpty()) {
                    throw new RuntimeException("No available candidates for Auto allocation.");
                } else {
                    int finalCount = Math.min(count, candidates.size());
                    String aiResponse = aiService.recommendEmployeeForProject(project, candidates, finalCount);
                    allCreatedTasks.addAll(parseAiResponseAndSave(aiResponse, project, AllocationType.AUTOMATIC));
                }
            }
        }

        return allCreatedTasks;
    }

    private java.util.List<Task> parseAiResponseAndSave(String aiResponse, Project project,
            AllocationType allocationType) {
        java.util.List<Task> createdTasks = new java.util.ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(aiResponse);
            JsonNode assignments = root.get("assignments");

            if (assignments.isArray()) {
                for (JsonNode assignment : assignments) {
                    Long userId = assignment.get("userId").asLong();
                    String taskName = assignment.get("suggestedTaskName").asText();
                    String reason = assignment.get("reason").asText();

                    User assignedUser = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Recommended user not found"));

                    Task task = new Task();
                    task.setTaskName(taskName);
                    task.setDescription("Auto-allocated by AI. Reason: " + reason);
                    task.setProject(project);

                    // Updated to use list setter
                    java.util.List<User> assignedList = new java.util.ArrayList<>();
                    assignedList.add(assignedUser);
                    task.setAssignedEmployees(assignedList);

                    task.setStatus("ASSIGNED");
                    task.setPriority(project.getPriority());
                    task.setDeadline(project.getDeadline());
                    task.setAllocationType(allocationType);
                    task.setTaskCategory("Development"); // Default category

                    // Set required skill from project stack if possible, or just generic
                    task.setRequiredSkill(project.getBackendTech() + ", " + project.getFrontendTech());

                    createdTasks.add(taskRepository.save(task));
                }
            }
            return createdTasks;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to process AI allocation: " + e.getMessage());
        }
    }
}
