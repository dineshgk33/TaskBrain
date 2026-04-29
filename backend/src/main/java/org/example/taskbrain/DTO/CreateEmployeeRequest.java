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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }

    public int getTotalProjectsWorked() {
        return totalProjectsWorked;
    }

    public void setTotalProjectsWorked(int totalProjectsWorked) {
        this.totalProjectsWorked = totalProjectsWorked;
    }

    public double getPerformanceRating() {
        return performanceRating;
    }

    public void setPerformanceRating(double performanceRating) {
        this.performanceRating = performanceRating;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }
}
