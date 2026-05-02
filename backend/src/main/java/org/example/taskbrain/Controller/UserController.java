package org.example.taskbrain.controller;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.dto.UpdateUserRequest;
import org.example.taskbrain.model.User;
import org.example.taskbrain.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user, java.security.Principal principal) {
        System.out.println("Creating user (Employee/User): " + user.getEmail());
        String managerEmail = (principal != null) ? principal.getName() : null;
        System.out.println("Creator (Manager): " + managerEmail);

        User createdUser = userService.createEmployee(user, managerEmail);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/{id}/employee-profile")
    public ResponseEntity<org.example.taskbrain.model.EmployeeProfile> updateEmployeeProfile(
            @PathVariable Long id,
            @RequestBody org.example.taskbrain.model.EmployeeProfile profile) {
        org.example.taskbrain.model.EmployeeProfile updated = userService.updateEmployeeProfile(id, profile);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        User updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping
    public ResponseEntity<java.util.List<User>> getAllUsers(java.security.Principal principal) {
        // Filter users by manager if logged in
        if (principal != null) {
            return ResponseEntity.ok(userService.getAllUsers(principal.getName()));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
