package org.example.taskbrain.Model;

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
    private User user;
    private String skills;
    private int experienceYears;
    private int totalProjectsWorked;
    private double performanceRating;
    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availability;             // percentage (0–100)
}
