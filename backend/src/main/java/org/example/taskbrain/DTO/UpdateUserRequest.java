package org.example.taskbrain.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String fullName;
    private String password;
    private String currentPassword;
}
