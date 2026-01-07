package org.example.taskbrain.controller;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.dto.LoginRequest;
import org.example.taskbrain.dto.RegisterRequest;
import org.example.taskbrain.model.Role;
import org.example.taskbrain.model.User;
import org.example.taskbrain.service.UserService;
import org.example.taskbrain.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterRequest request) {

        Role role;
        try {
            role = Role.valueOf(request.getRole());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid role");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(role);
        user.setWorkRole(request.getWorkRole());

        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/verify")
    public String verify(@RequestParam("code") String code) {
        String result = userService.verifyUser(code);
        switch (result) {
            case "SUCCESS":
                return "<h1>Verification Successful!</h1><p>You can now login.</p>";
            case "ALREADY_VERIFIED":
                return "<h1>Account Already Verified</h1><p>You can already login.</p>";
            case "INVALID":
            default:
                return "<h1>Invalid Verification Link</h1><p>Please check the link or signup again.</p>";
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        System.out.println("Login attempt for email: " + request.getEmail());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));
            System.out.println("Authentication successful for: " + request.getEmail());
        } catch (Exception e) {
            System.out.println("Authentication FAILED for: " + request.getEmail());
            System.out.println("Reason: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Authentication failed: " + e.getMessage());
        }

        User user = userService.validateUser(request.getEmail(), request.getPassword());

        String token = jwtUtil.generateToken(user);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole().name());
        response.put("email", user.getEmail());
        response.put("userId", String.valueOf(user.getUserId()));
        response.put("workRole", user.getWorkRole());

        System.out.println("Login Response - Role: " + user.getRole() + ", WorkRole: " + user.getWorkRole());

        return ResponseEntity.ok(response);
    }
}
