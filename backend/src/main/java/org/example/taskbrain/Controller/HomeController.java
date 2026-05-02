package org.example.taskbrain.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public ResponseEntity<String> home() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return ResponseEntity.ok("TaskBrain API is running successfully! Database is CONNECTED.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("TaskBrain API is running, but Database is DISCONNECTED: " + e.getMessage());
        }
    }
}
