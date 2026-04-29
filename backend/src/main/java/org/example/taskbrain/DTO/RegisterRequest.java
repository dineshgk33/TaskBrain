package org.example.taskbrain.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String role;
    private String workRole;

    public String getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getWorkRole() {
        return workRole;
    }
}
