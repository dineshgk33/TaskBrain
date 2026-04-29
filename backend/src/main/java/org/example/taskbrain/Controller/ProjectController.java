package org.example.taskbrain.controller;

import org.example.taskbrain.model.Project;
import org.example.taskbrain.model.Task;
import org.example.taskbrain.service.ProjectService;
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

    @GetMapping
    public ResponseEntity<java.util.List<Project>> getAllProjects(java.security.Principal principal) {
        System.out.println("DEBUG: Request to get all projects for: " + principal.getName());
        java.util.List<Project> projects = projectService.getAllProjects(principal.getName());
        System.out.println("DEBUG: Returning " + projects.size() + " projects");
        return ResponseEntity.ok(projects);
    }

    @PutMapping("/{projectId}/tech-stack")
    public ResponseEntity<Project> updateProjectTechStack(
            @PathVariable Long projectId,
            @RequestBody Project techStackUpdate) {
        Project updatedProject = projectService.updateProjectTechStack(projectId, techStackUpdate);
        return ResponseEntity.ok(updatedProject);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long projectId,
            @RequestBody Project projectDetails) {
        Project updatedProject = projectService.updateProject(projectId, projectDetails);
        return ResponseEntity.ok(updatedProject);
    }

    @PostMapping("/{projectId}/allocate")
    public ResponseEntity<?> autoAllocateTask(@PathVariable Long projectId,
            @RequestBody org.example.taskbrain.dto.AllocationRequest request) {
        try {
            java.util.List<Task> tasks = projectService.autoAllocateTask(projectId, request);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
