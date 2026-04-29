package org.example.taskbrain.dto;

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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public String getCurrentlyWorking() {
        return currentlyWorking;
    }

    public void setCurrentlyWorking(String currentlyWorking) {
        this.currentlyWorking = currentlyWorking;
    }

    public double getOnTimeDeliveryPercent() {
        return onTimeDeliveryPercent;
    }

    public void setOnTimeDeliveryPercent(double onTimeDeliveryPercent) {
        this.onTimeDeliveryPercent = onTimeDeliveryPercent;
    }
}
