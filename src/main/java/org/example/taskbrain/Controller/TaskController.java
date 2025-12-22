package org.example.taskbrain.Controller;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.Model.Task;
import org.example.taskbrain.Service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/{projectId}")
    public ResponseEntity<Task> createTask(@RequestBody Task task, @PathVariable Long projectId) {
        try {
            Task createdTask = taskService.createTask(task, projectId);
            return ResponseEntity.ok(createdTask);
        } catch (Exception e) {
            // Returns a 400 Bad Request with the error message (e.g., "Project not found")
            return ResponseEntity.badRequest().body(null);
        }
    }


    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }
}