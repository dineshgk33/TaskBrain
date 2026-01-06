package org.example.taskbrain.Controller;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.DTO.CreateEmployeeRequest;
import org.example.taskbrain.DTO.UpdateEmployeeRequest;
import org.example.taskbrain.Model.EmployeeProfile;
import org.example.taskbrain.Service.PMService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pm")
@RequiredArgsConstructor
public class PMController {

    private final PMService pmService;

    @PostMapping("/create-employee")
    public ResponseEntity<?> createEmployee(@RequestBody CreateEmployeeRequest request) {
        System.out.println(">>> API CALLED with email: " + request.getEmail());
        try {
            EmployeeProfile created = pmService.createEmployee(request);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            e.printStackTrace(); // This prints the error in your IDE console
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/update-employee/{userId}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long userId, @RequestBody UpdateEmployeeRequest request) {
        try {
            EmployeeProfile updated = pmService.updateEmployee(userId, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}