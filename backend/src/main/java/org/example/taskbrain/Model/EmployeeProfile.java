package org.example.taskbrain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employee_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @com.fasterxml.jackson.annotation.JsonBackReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    private String skills;
    private int experienceYears;
    private int totalProjectsWorked;
    private double performanceRating;

    @Column(name = "currently_working", nullable = false)
    private String currentlyWorking;

    @Column(name = "on_time_delivery_percent", nullable = false)
    private double onTimeDeliveryPercent;

    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availability;

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

    public AvailabilityStatus getAvailability() {
        return availability;
    }

    public void setAvailability(AvailabilityStatus availability) {
        this.availability = availability;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }
}
