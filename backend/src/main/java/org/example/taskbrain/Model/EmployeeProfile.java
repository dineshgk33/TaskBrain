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
}
