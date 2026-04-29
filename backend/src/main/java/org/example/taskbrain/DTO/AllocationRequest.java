package org.example.taskbrain.dto;

import lombok.Data;

@Data
public class AllocationRequest {

    // "AUTO", "MANUAL", "HYBRID" coming from frontend
    private String type;

    // Instead of employeeCount, ProjectService uses autoCount
    private int autoCount;

    // Instead of List<User> manualEmployees, we get IDs
    private java.util.List<Long> manualUserIds;
}
