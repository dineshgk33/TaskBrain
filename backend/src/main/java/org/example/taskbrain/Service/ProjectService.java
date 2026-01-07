package org.example.taskbrain.service;

import org.example.taskbrain.model.Project;
import org.example.taskbrain.model.User;
import org.example.taskbrain.repository.ProjectRepository;
import org.example.taskbrain.repository.UserRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public Project createProject(Project project, String email) {

        User projectManager = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Project Manager not found"));

        project.setCreatedBy(projectManager);

        if (project.getStatus() == null) {
            project.setStatus("PLANNED");
        }

        return projectRepository.save(project);
    }
}

