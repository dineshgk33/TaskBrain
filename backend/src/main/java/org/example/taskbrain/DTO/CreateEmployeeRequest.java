package org.example.taskbrain.dto;

import lombok.Data;

@Data
public class CreateEmployeeRequest {
    private String fullName;
    private String email;
    private String password;
    private String skills;
    private int experienceYears;
    private int totalProjectsWorked;
    private double performanceRating;
    private String availability; // Using String to prevent type mismatch
}
