package org.example.taskbrain.service;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.model.*;
import org.example.taskbrain.repository.EmployeeProfileRepository;
import org.example.taskbrain.repository.ProjectRepository;
import org.example.taskbrain.repository.TaskRepository;
import org.example.taskbrain.repository.UserRepository;
import org.springframework.stereotype.Service;

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

        // 3. Tech Validation: Fixed tech must be inside possible techs
        if (task.getFixedTechnology() != null &&
                !task.getPossibleTechnologies().toLowerCase().contains(task.getFixedTechnology().toLowerCase())) {
            throw new RuntimeException("Fixed technology must be one of the possible technologies");
        }

        // 4. Allocation Logic
        AllocationType type = task.getAllocationType();
        switch (type) {
            case MANUAL -> {
                if (task.getAssignedEmployee() == null) {
                    throw new RuntimeException("MANUAL allocation requires an employee selection");
                }
                User employee = userRepository.findById(task.getAssignedEmployee().getUserId())
                        .orElseThrow(() -> new RuntimeException("Employee not found"));
                task.setAssignedEmployee(employee);
            }
            case HYBRID -> {
                if (task.getAssignedEmployee() != null) {
                    User preferred = userRepository.findById(task.getAssignedEmployee().getUserId())
                            .orElseThrow(() -> new RuntimeException("Preferred employee not found"));
                    task.setAssignedEmployee(preferred);
                } else {
                    task.setAssignedEmployee(aiSelectEmployee(task));
                }
            }
            case AUTOMATIC -> {
                task.setAssignedEmployee(aiSelectEmployee(task));
            }
        }

        return taskRepository.save(task);
    }

    /**
     * AI Logic: Selects the best employee based on skills,
     * FREE availability, and the highest performance rating.
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
}
