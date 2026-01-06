package org.example.taskbrain.Controller;

import org.example.taskbrain.Model.Project;
import org.example.taskbrain.Service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(
            @RequestBody Project project,
            java.security.Principal principal) {

        Project savedProject = projectService.createProject(project, principal.getName());

        return ResponseEntity.ok(savedProject);
    }
}
