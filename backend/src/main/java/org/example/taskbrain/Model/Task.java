package org.example.taskbrain.model;

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

    @Column(name = "design_requirements", columnDefinition = "TEXT")
    private String designRequirements;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "task_design_urls", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "design_url")
    private java.util.List<String> designImageUrls = new java.util.ArrayList<>();

    private String taskCategory;
    private String requiredSkill;

    private String fixedTechnology;
    private String possibleTechnologies;

    private LocalDate deadline;
    private String priority;

    private String status;

    @Enumerated(EnumType.STRING)
    private AllocationType allocationType;

    private int progress = 0;

    @Enumerated(EnumType.STRING)
    private TaskPhase phase = TaskPhase.REQUIREMENT_GATHERING; // Default starting phase

    private String approvalStatus = "NONE"; // PENDING, APPROVED, REJECTED, NONE

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "task_assignments", joinColumns = @JoinColumn(name = "task_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private java.util.List<User> assignedEmployees;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Project project;

    public Long getTaskId() {
        return taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public String getDescription() {
        return description;
    }

    public String getTaskCategory() {
        return taskCategory;
    }

    public String getRequiredSkill() {
        return requiredSkill;
    }

    public String getFixedTechnology() {
        return fixedTechnology;
    }

    public String getPossibleTechnologies() {
        return possibleTechnologies;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public String getPriority() {
        return priority;
    }

    public String getStatus() {
        return status;
    }

    public AllocationType getAllocationType() {
        return allocationType;
    }

    public int getProgress() {
        return progress;
    }

    public TaskPhase getPhase() {
        return phase;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public java.util.List<User> getAssignedEmployees() {
        return assignedEmployees;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAssignedEmployees(java.util.List<User> assignedEmployees) {
        this.assignedEmployees = assignedEmployees;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public void setPhase(TaskPhase phase) {
        this.phase = phase;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
