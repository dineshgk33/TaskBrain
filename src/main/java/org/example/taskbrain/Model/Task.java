package org.example.taskbrain.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    private String taskName;
    private String description;

    private String taskCategory;
    private String requiredSkill;

    private String fixedTechnology;
    private String possibleTechnologies;

    private LocalDate deadline;
    private String priority;

    private String status;

    @Enumerated(EnumType.STRING)
    private AllocationType allocationType;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedEmployee;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}
