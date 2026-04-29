package org.example.taskbrain.service;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.model.Project;
import org.example.taskbrain.model.Task;
import org.example.taskbrain.model.User;
import org.example.taskbrain.repository.ProjectRepository;
import org.example.taskbrain.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Diagnostic Service for Project Meeting Isolation & Management.
 */
@Service
@RequiredArgsConstructor
public class MeetingService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final EmailService emailService;

    public String createMeeting(Long projectId) {
        System.out.println("DEBUG: Creating meeting for project ID: " + projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        System.out.println("DEBUG: Found project: " + project.getProjectName());

        // Generate a real, instantly joinable Jitsi Meet link
        String projectSlug = project.getProjectName().replaceAll("[^a-zA-Z0-9-]", "-");
        String meetingLink = "https://meet.jit.si/TaskBrain-" + projectSlug + "-" + System.currentTimeMillis();

        project.setMeetingLink(meetingLink);
        projectRepository.save(project);

        System.out.println("DEBUG: Meeting saved for project: " + project.getProjectName());

        // Notify all members assigned to tasks in this project
        notifyProjectMembers(project, meetingLink);

        return meetingLink;
    }

    public void deleteMeeting(Long projectId) {
        System.out.println("DEBUG: Stopping meeting for project ID: " + projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        project.setMeetingLink(null);
        projectRepository.save(project);
        System.out.println("DEBUG: Meeting cleared for project: " + project.getProjectName());
    }


    private void notifyProjectMembers(Project project, String meetingLink) {
        List<Task> tasks = taskRepository.findByProject_ProjectId(project.getProjectId());
        System.out.println("DEBUG: Found " + tasks.size() + " tasks for project: " + project.getProjectName());
        
        Set<User> members = tasks.stream()
                .flatMap(task -> {
                    List<User> employees = task.getAssignedEmployees();
                    System.out.println("DEBUG: Task '" + task.getTaskName() + "' has " + (employees != null ? employees.size() : 0) + " assigned employees");
                    return employees != null ? employees.stream() : java.util.stream.Stream.empty();
                })
                .collect(Collectors.toSet());

        System.out.println("DEBUG: Total unique members found to notify: " + members.size());

        for (User member : members) {
            try {
                System.out.println("DEBUG: Sending invitation to: " + member.getEmail());
                // We'll reuse/adapt the EmailService to send this notification
                String subject = "Meeting Started: " + project.getProjectName();
                String content = "<p>Hi " + member.getFullName() + ",</p>" +
                                 "<p>A meeting has been started for project <b>" + project.getProjectName() + "</b>.</p>" +
                                 "<p>You can join using the link below:</p>" +
                                 "<h3><a href=\"" + meetingLink + "\">JOIN MEETING</a></h3>" +
                                 "<p>Thank you,<br>The TaskBrain Team</p>";
                
                emailService.sendMeetingInvitation(member.getEmail(), subject, content);
            } catch (Exception e) {
                System.err.println("Failed to send meeting invitation to " + member.getEmail() + ": " + e.getMessage());
            }
        }
    }
}

