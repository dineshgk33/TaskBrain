package org.example.taskbrain.DTO;

import lombok.Data;

@Data
public class UpdateEmployeeRequest {
    private String fullName; // In case they changed their name
    private String skills;
    private int experienceYears;
    private int totalProjectsWorked;
    private double performanceRating;
    private String availability;
    private String currentlyWorking;
    private double onTimeDeliveryPercent;
}