package org.example.taskbrain.controller;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.model.Task;
import org.example.taskbrain.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/{projectId}")
    public ResponseEntity<?> createTask(@RequestBody Task task, @PathVariable Long projectId) {
        try {
            Task createdTask = taskService.createTask(task, projectId);
            return ResponseEntity.ok(createdTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable Long userId) {
        List<Task> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PutMapping("/{taskId}/progress")
    public ResponseEntity<Task> updateProgress(@PathVariable Long taskId,
            @RequestBody java.util.Map<String, Integer> body) {
        int progress = body.get("progress");
        return ResponseEntity.ok(taskService.updateProgress(taskId, progress));
    }

    @PutMapping("/{taskId}/approval")
    public ResponseEntity<Task> approveTask(@PathVariable Long taskId,
            @RequestBody java.util.Map<String, Object> body) {
        boolean approved = (boolean) body.get("approved");
        String feedback = (String) body.getOrDefault("feedback", "");
        return ResponseEntity.ok(taskService.approveTask(taskId, approved, feedback));
    }

    @PatchMapping("/{taskId}/requirements")
    public ResponseEntity<Task> updateRequirements(@PathVariable Long taskId,
            @RequestBody java.util.Map<String, String> body) {
        String requirements = body.get("requirements");
        Task updatedTask = taskService.updateDesignRequirements(taskId, requirements);
        return ResponseEntity.ok(updatedTask);
    }

    @PutMapping("/{taskId}/submit")
    public ResponseEntity<Task> submitTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.submitForApproval(taskId));
    }

    @PostMapping("/{taskId}/design")
    public ResponseEntity<?> uploadDesign(@PathVariable Long taskId, @RequestParam("file") MultipartFile file) {
        try {
            Task updatedTask = taskService.uploadDesignImage(taskId, file);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{taskId}/design")
    public ResponseEntity<?> deleteDesign(@PathVariable Long taskId, @RequestParam("imageUrl") String imageUrl) {
        try {
            Task updatedTask = taskService.deleteDesignImage(taskId, imageUrl);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
