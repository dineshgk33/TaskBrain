package org.example.taskbrain.Controller;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.DTO.LoginRequest;
import org.example.taskbrain.DTO.RegisterRequest;
import org.example.taskbrain.Model.Role;
import org.example.taskbrain.Model.User;
import org.example.taskbrain.Service.UserService;
import org.example.taskbrain.Util.JwtUtil;
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

        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/verify")
    public String verify(@RequestParam("code") String code) {
        return userService.verifyUser(code) ? "verify_success" : "verify_fail";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userService.validateUser(request.getEmail(), request.getPassword());

        String token = jwtUtil.generateToken(user);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole().name());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }
}
