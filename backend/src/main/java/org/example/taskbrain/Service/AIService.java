package org.example.taskbrain.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
import org.example.taskbrain.model.Project;
import org.example.taskbrain.model.User;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    @Value("${gemini.base-url:https://generativelanguage.googleapis.com/v1beta/models/}")
    private String baseUrl;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String modelName;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getTechStackRecommendation(String requirement) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_NEW_API_KEY_HERE_YOUR_OLD_ONE_WAS_LEAKED_AND_BLOCKED")) {
            return "{\n" +
                   "  \"frontend\": {\"name\": \"React.js\", \"reason\": \"(Mock AI) Excellent for building interactive UIs.\"},\n" +
                   "  \"backend\": {\"name\": \"Node.js / Express\", \"reason\": \"(Mock AI) Great for real-time web applications.\"},\n" +
                   "  \"database\": {\"name\": \"PostgreSQL\", \"reason\": \"(Mock AI) Reliable and robust relational database.\"},\n" +
                   "  \"ai_ml\": null,\n" +
                   "  \"tools\": [\"Docker\", \"GitHub Actions\", \"Jest\"]\n" +
                   "}";
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = String.format(
                "You are an expert software architect. Analyze the following project requirement and recommend the best technology stack.\\n"
                        +
                        "Requirement: \"%s\"\\n\\n" +
                        "IMPORTANT GUIDELINES:\\n" +
                        "1. Do NOT default to Spring Boot (Java) for the backend. Consider the project type:\\n" +
                        "   - For real-time, I/O heavy, or modern web apps: Prefer Node.js (Express/NestJS).\\n" +
                        "   - For data science, AI, or rapid prototyping: Prefer Python (FastAPI/Django).\\n" +
                        "   - For high performance systems: Prefer Go.\\n" +
                        "   - ONLY use Spring Boot if the requirement explicitly asks for Java/Spring or implies heavy enterprise constraints.\\n"
                        +
                        "2. If the user specifies a technology, YOU MUST USE IT.\\n\\n"
                        +
                        "Strictly return ONLY a JSON object with the following structure (do not use Markdown code blocks):\\n"
                        +
                        "{\\n" +
                        "  \"frontend\": {\"name\": \"...\", \"reason\": \"...\"},\\n" +
                        "  \"backend\": {\"name\": \"...\", \"reason\": \"...\"},\\n" +
                        "  \"database\": {\"name\": \"...\", \"reason\": \"...\"},\\n" +
                        "  \"ai_ml\": {\"name\": \"...\", \"reason\": \"...\"} (optional, null if not needed),\\n" +
                        "  \"tools\": [\"...\", \"...\"]\\n" +
                        "}",
                requirement);

        Map<String, Object> contentPart = new HashMap<>();
        contentPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", java.util.Collections.singletonList(contentPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", java.util.Collections.singletonList(parts));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String fullUrl = baseUrl + modelName + ":generateContent?key=" + apiKey;

            int maxRetries = 3;
            int retryDelay = 1000; // 1 second

            for (int i = 0; i <= maxRetries; i++) {
                try {
                    String response = restTemplate.postForObject(fullUrl, request, String.class);

                    // Parse response to extract the actual text
                    JsonNode root = objectMapper.readTree(response);
                    String rawText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text")
                            .asText();

                    // Clean up if the model decides to wrap in markdown blocks despite instructions
                    rawText = rawText.replace("```json", "").replace("```", "").trim();

                    return rawText;
                } catch (org.springframework.web.client.HttpServerErrorException.ServiceUnavailable e) {
                    if (i == maxRetries)
                        throw e;
                    System.out.println("Gemini API overloaded (503). Retrying in " + retryDelay + "ms...");
                    Thread.sleep(retryDelay);
                    retryDelay *= 2; // Exponential backoff
                } catch (org.springframework.web.client.ResourceAccessException e) {
                    if (i == maxRetries)
                        throw e;
                    System.out.println("Connection issue. Retrying in " + retryDelay + "ms...");
                    Thread.sleep(retryDelay);
                    retryDelay *= 2;
                } catch (org.springframework.web.client.HttpClientErrorException e) {
                    if (i == maxRetries) throw e;
                    System.out.println("Client error: " + e.getStatusCode() + ". Retrying in " + retryDelay + "ms...");
                    Thread.sleep(retryDelay);
                    retryDelay *= 2;
                }
            }
            throw new RuntimeException("Failed to get recommendation after retries.");
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            e.printStackTrace();
            throw new RuntimeException("AI API Error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get recommendation from AI: " + e.getMessage());
        }
    }

    public String recommendEmployeeForProject(Project project, List<User> candidates, int count) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_NEW_API_KEY_HERE_YOUR_OLD_ONE_WAS_LEAKED_AND_BLOCKED")) {
            return "{\n" +
                   "  \"assignments\": [\n" +
                   "    {\n" +
                   "      \"userId\": " + (candidates.isEmpty() ? 1 : candidates.get(0).getUserId()) + ",\n" +
                   "      \"suggestedTaskName\": \"(Mock AI) Initial Setup & Architecture\",\n" +
                   "      \"reason\": \"(Mock AI) Best fit based on experience.\"\n" +
                   "    }\n" +
                   "  ]\n" +
                   "}";
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Format candidates list
        String candidatesInfo = candidates.stream()
                .map(u -> String.format("- ID: %d, Name: %s, Role: %s, Skills: %s, Exp: %d years",
                        u.getUserId(),
                        u.getFullName(),
                        u.getWorkRole(),
                        u.getEmployeeProfile() != null ? u.getEmployeeProfile().getSkills() : "N/A",
                        u.getEmployeeProfile() != null ? u.getEmployeeProfile().getExperienceYears() : 0))
                .collect(Collectors.joining("\\n"));

        String prompt = String.format(
                "You are a Project Manager. Assign the best %d available employees to this project.\\n" +
                        "Project: %s\\n" +
                        "Description: %s\\n" +
                        "Tech Stack: %s (Front), %s (Back), %s (DB)\\n\\n" +
                        "Candidates:\\n%s\\n\\n" +
                        "Task: Select %d employees who are the best fit. Create a suitable initial task name for them based on their skills and the project tech stack.\n"
                        +
                        "CRITICAL: If the project requirements mention 'Design', 'UI/UX', 'Wireframes', or 'Mockups', you MUST assign a 'Design' task to a candidate with the DESIGNER role.\n"
                        +
                        "Strictly return JSON only:\\n" +
                        "{\\n" +
                        "  \"assignments\": [\\n" +
                        "    {\\n" +
                        "      \"userId\": <id>,\\n" +
                        "      \"suggestedTaskName\": \"<short task title>\",\\n" +
                        "      \"reason\": \"<short explanation>\"\\n" +
                        "    }\\n" +
                        "  ]\\n" +
                        "}",
                count,
                project.getProjectName(),
                project.getDescription(),
                project.getFrontendTech(),
                project.getBackendTech(),
                project.getDatabaseTech(),
                candidatesInfo,
                count);

        Map<String, Object> contentPart = new HashMap<>();
        contentPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", java.util.Collections.singletonList(contentPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", java.util.Collections.singletonList(parts));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String fullUrl = baseUrl + modelName + ":generateContent?key=" + apiKey;
            String response = restTemplate.postForObject(fullUrl, request, String.class);
            JsonNode root = objectMapper.readTree(response);
            String rawText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            return rawText.replace("```json", "").replace("```", "").trim();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to allocate task: " + e.getMessage());
        }
    }

    public String generateDesignSuggestion(String projectContext, String userPrompt,
            List<Map<String, String>> history) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_NEW_API_KEY_HERE_YOUR_OLD_ONE_WAS_LEAKED_AND_BLOCKED")) {
            return "<<<DESIGN_PREVIEW>>>\n" +
                   "<!DOCTYPE html>\n<html><head><script src=\"https://cdn.tailwindcss.com\"></script></head>\n" +
                   "<body class=\"bg-gray-50 flex items-center justify-center h-screen\">\n" +
                   "  <div class=\"bg-white p-8 rounded-xl shadow-lg\">\n" +
                   "    <h1 class=\"text-2xl font-bold text-gray-800\">(Mock AI) UI Design</h1>\n" +
                   "    <p class=\"text-gray-500 mt-2\">Please configure a valid Gemini API key to generate real designs.</p>\n" +
                   "  </div>\n</body></html>\n" +
                   "<<</DESIGN_PREVIEW>>>";
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 1. System Prompt (The Persona)
        String systemInstruction = String.format(
                "You are a Senior UI/UX Designer and Frontend Architect.\\n\\n" +
                        "Project Context: %s\\n\\n" +
                        "**CRITICAL INSTRUCTION:**\\n" +
                        "1. **VISUAL PRIORITY**: If the user asks for a UI design, your output must contain **ONLY** the `<<<DESIGN_PREVIEW>>>` block.\\n"
                        +
                        "2. **NO TEXT**: Do NOT write any introduction, explanation, or summary. Do NOT say 'Here is the design'. Just output the code block.\\n"
                        +
                        "3. **STRICT FORMAT**: Wrap the HTML/Tailwind code inside `<<<DESIGN_PREVIEW>>>` and `<<</DESIGN_PREVIEW>>>`.\\n"
                        +
                        "4. **QUALITY**: The design must be modern, responsive, and visually stunning (Glassmorphism, gradients, clean shadows).\\n\\n"
                        +
                        "Output structure:\\n" +
                        "<<<DESIGN_PREVIEW>>>\\n" +
                        "<!DOCTYPE html>...\\n" +
                        "<<</DESIGN_PREVIEW>>>",
                projectContext);

        // Construct the "contents" list for Gemini
        java.util.List<Map<String, Object>> contents = new java.util.ArrayList<>();

        // Add System Instruction as the first "user" message (Common pattern for Gemini
        // v1beta)
        // Or if using v1beta/models/gemini-pro, we just treat it as the first turn.
        Map<String, Object> systemPart = new HashMap<>();
        systemPart.put("parts", java.util.Collections.singletonList(Map.of("text", systemInstruction)));
        systemPart.put("role", "user");
        contents.add(systemPart);

        // Add System Acknowledgement (fake model response to establish context)
        Map<String, Object> systemAck = new HashMap<>();
        systemAck.put("parts", java.util.Collections
                .singletonList(Map.of("text", "Understood. I am ready to design for this project.")));
        systemAck.put("role", "model");
        contents.add(systemAck);

        // 2. Append Chat History
        if (history != null) {
            for (Map<String, String> msg : history) {
                String role = msg.get("role");
                String content = msg.get("content");

                // Map frontend roles to Gemini roles
                String geminiRole = "user";
                if ("ai".equalsIgnoreCase(role) || "model".equalsIgnoreCase(role)) {
                    geminiRole = "model";
                }

                Map<String, Object> historyPart = new HashMap<>();
                historyPart.put("parts", java.util.Collections.singletonList(Map.of("text", content)));
                historyPart.put("role", geminiRole);
                contents.add(historyPart);
            }
        }

        // 3. Append Current User Prompt
        Map<String, Object> userPart = new HashMap<>();
        userPart.put("parts", java.util.Collections.singletonList(Map.of("text", userPrompt)));
        userPart.put("role", "user");
        contents.add(userPart);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", contents);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String fullUrl = baseUrl + modelName + ":generateContent?key=" + apiKey;
            String response = restTemplate.postForObject(fullUrl, request, String.class);
            JsonNode root = objectMapper.readTree(response);
            String rawText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            return rawText;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate design: " + e.getMessage());
        }
    }

    public String generateProjectInsights(String projectData) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_NEW_API_KEY_HERE_YOUR_OLD_ONE_WAS_LEAKED_AND_BLOCKED")) {
            return "{\n" +
                   "  \"risks\": [{\"title\": \"API Key Missing\", \"severity\": \"High\", \"description\": \"(Mock AI) No real insights can be generated without a valid API key.\"}],\n" +
                   "  \"recommendations\": [{\"title\": \"Configure Gemini\", \"action\": \"Update your .env file with a valid API key.\"}],\n" +
                   "  \"team_health\": {\"score\": 100, \"status\": \"Good\", \"summary\": \"(Mock AI) Everything looks fine!\"}\n" +
                   "}";
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = String.format(
                "You are an expert Project Management Consultant. Analyze the following project data and risk factors.\\n"
                        +
                        "Project Data: %s\\n\\n" +
                        "Task: Identify key risks, opportunities for optimization, and assess team health.\\n" +
                        "Strictly return ONLY a JSON object with this structure:\\n" +
                        "{\\n" +
                        "  \"risks\": [{\"title\": \"...\", \"severity\": \"High/Medium/Low\", \"description\": \"...\"}],\\n"
                        +
                        "  \"recommendations\": [{\"title\": \"...\", \"action\": \"...\"}],\\n" +
                        "  \"team_health\": {\"score\": 85, \"status\": \"Good\", \"summary\": \"...\"}\\n" +
                        "}",
                projectData);

        Map<String, Object> contentPart = new HashMap<>();
        contentPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", java.util.Collections.singletonList(contentPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", java.util.Collections.singletonList(parts));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String fullUrl = baseUrl + modelName + ":generateContent?key=" + apiKey;
            String response = restTemplate.postForObject(fullUrl, request, String.class);
            JsonNode root = objectMapper.readTree(response);
            String rawText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            return rawText.replace("```json", "").replace("```", "").trim();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate insights: " + e.getMessage());
        }
    }

    public String chatWithManager(String message, List<Map<String, String>> history) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_NEW_API_KEY_HERE_YOUR_OLD_ONE_WAS_LEAKED_AND_BLOCKED")) {
            return "(Mock AI) I am a mock assistant. Please configure a valid Gemini API key in your `.env` file to chat with me!";
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 1. System Prompt (The Persona)
        String systemInstruction = "You are TaskBrain's Senior Project Management Consultant. Your goal is to help the manager with team allocation, risk mitigation, agile strategies, and conflict resolution.\\n"
                +
                "GUIDELINES:\\n" +
                "- Be professional, encouraging, and strategic.\\n" +
                "- Keep answers concise and actionable (bullet points are good).\\n" +
                "- If asked about code, explain the high-level architecture implications, not the syntax.";

        // Construct contents
        java.util.List<Map<String, Object>> contents = new java.util.ArrayList<>();

        // Add System Instruction
        Map<String, Object> systemPart = new HashMap<>();
        systemPart.put("parts", java.util.Collections.singletonList(Map.of("text", systemInstruction)));
        systemPart.put("role", "user");
        contents.add(systemPart);

        Map<String, Object> systemAck = new HashMap<>();
        systemAck.put("parts",
                java.util.Collections.singletonList(Map.of("text", "Understood. I am ready to assist the Manager.")));
        systemAck.put("role", "model");
        contents.add(systemAck);

        // Append Chat History
        if (history != null) {
            for (Map<String, String> msg : history) {
                String role = msg.get("role");
                String content = msg.get("content");
                String geminiRole = "user";
                if ("ai".equalsIgnoreCase(role) || "model".equalsIgnoreCase(role)) {
                    geminiRole = "model";
                }
                Map<String, Object> historyPart = new HashMap<>();
                historyPart.put("parts", java.util.Collections.singletonList(Map.of("text", content)));
                historyPart.put("role", geminiRole);
                contents.add(historyPart);
            }
        }

        // Append Current User Prompt
        Map<String, Object> userPart = new HashMap<>();
        userPart.put("parts", java.util.Collections.singletonList(Map.of("text", message)));
        userPart.put("role", "user");
        contents.add(userPart);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", contents);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String fullUrl = baseUrl + modelName + ":generateContent?key=" + apiKey;
            String response = restTemplate.postForObject(fullUrl, request, String.class);
            JsonNode root = objectMapper.readTree(response);
            String rawText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            return rawText.trim();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to chat with manager AI: " + e.getMessage());
        }
    }

    public String chatWithEmployee(String message, List<Map<String, String>> history) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_NEW_API_KEY_HERE_YOUR_OLD_ONE_WAS_LEAKED_AND_BLOCKED")) {
            return "(Mock AI) I am a mock mentor. Please configure a valid Gemini API key in your `.env` file to ask technical questions!";
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 1. System Prompt (The Persona)
        String systemInstruction = "You are TaskBrain's Senior Developer Mentor. Your goal is to help employees/developers with coding tasks, debugging, best practices, and understanding requirements.\\n"
                +
                "GUIDELINES:\\n" +
                "- Be technical, precise, and helpful.\\n" +
                "- Provide code snippets where relevant (use markdown).\\n" +
                "- Explain concepts clearly but assume the user has technical knowledge.\\n" +
                "- If the user asks about project management or design, guide them to the appropriate person but give a helpful technical answer if possible.";

        // Construct contents
        java.util.List<Map<String, Object>> contents = new java.util.ArrayList<>();

        // Add System Instruction
        Map<String, Object> systemPart = new HashMap<>();
        systemPart.put("parts", java.util.Collections.singletonList(Map.of("text", systemInstruction)));
        systemPart.put("role", "user");
        contents.add(systemPart);

        Map<String, Object> systemAck = new HashMap<>();
        systemAck.put("parts",
                java.util.Collections.singletonList(Map.of("text", "Understood. I am ready to assist the Developer.")));
        systemAck.put("role", "model");
        contents.add(systemAck);

        // Append Chat History
        if (history != null) {
            for (Map<String, String> msg : history) {
                String role = msg.get("role");
                String content = msg.get("content");
                String geminiRole = "user";
                if ("ai".equalsIgnoreCase(role) || "model".equalsIgnoreCase(role)) {
                    geminiRole = "model";
                }
                Map<String, Object> historyPart = new HashMap<>();
                historyPart.put("parts", java.util.Collections.singletonList(Map.of("text", content)));
                historyPart.put("role", geminiRole);
                contents.add(historyPart);
            }
        }

        // Append Current User Prompt
        Map<String, Object> userPart = new HashMap<>();
        userPart.put("parts", java.util.Collections.singletonList(Map.of("text", message)));
        userPart.put("role", "user");
        contents.add(userPart);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", contents);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String fullUrl = baseUrl + modelName + ":generateContent?key=" + apiKey;
            String response = restTemplate.postForObject(fullUrl, request, String.class);
            JsonNode root = objectMapper.readTree(response);
            String rawText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            return rawText.trim();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to chat with employee AI: " + e.getMessage());
        }
    }
}
