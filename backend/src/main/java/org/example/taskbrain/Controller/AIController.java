package org.example.taskbrain.controller;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/recommend-stack")
    public ResponseEntity<String> recommendStack(@RequestBody Map<String, String> payload) {
        String requirement = payload.get("requirement");
        if (requirement == null || requirement.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Requirement cannot be empty");
        }

        // Returns the raw JSON string from the AI service
        String recommendation = aiService.getTechStackRecommendation(requirement);
        return ResponseEntity.ok(recommendation);
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chatWithAI(@RequestBody Map<String, Object> payload) {
        String projectContext = (String) payload.get("projectContext");
        String userPrompt = (String) payload.get("userPrompt");
        List<Map<String, String>> history = (List<Map<String, String>>) payload.get("history");

        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Prompt cannot be empty");
        }

        try {
            String response = aiService.generateDesignSuggestion(projectContext, userPrompt, history);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("AI Error: " + e.getMessage());
        }
    }

    @PostMapping("/insights")
    public ResponseEntity<String> generateInsights(@RequestBody Map<String, String> payload) {
        String projectData = payload.get("data");
        if (projectData == null || projectData.isEmpty()) {
            return ResponseEntity.badRequest().body("Project data cannot be empty");
        }
        try {
            String insights = aiService.generateProjectInsights(projectData);
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/manager-chat")
    public ResponseEntity<String> chatWithManager(@RequestBody Map<String, Object> payload) {
        String message = (String) payload.get("message");
        List<Map<String, String>> history = (List<Map<String, String>>) payload.get("history");

        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty");
        }

        try {
            String response = aiService.chatWithManager(message, history);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/employee-chat")
    public ResponseEntity<String> chatWithEmployee(@RequestBody Map<String, Object> payload) {
        String message = (String) payload.get("message");
        List<Map<String, String>> history = (List<Map<String, String>>) payload.get("history");

        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty");
        }

        try {
            String response = aiService.chatWithEmployee(message, history);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
