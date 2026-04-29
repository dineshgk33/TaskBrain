package org.example.taskbrain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @Column(nullable = false)
    private String projectName;

    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate deadline;

    private String priority;

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User createdBy;

    // Tech Stack Fields
    @Column(name = "frontend_tech", columnDefinition = "TEXT")
    private String frontendTech;

    @Column(name = "backend_tech", columnDefinition = "TEXT")
    private String backendTech;

    @Column(name = "database_tech", columnDefinition = "TEXT")
    private String databaseTech;

    @Column(name = "ai_ml_tech", columnDefinition = "TEXT")
    private String aiMlTech;

    @Column(name = "tools_tech", columnDefinition = "TEXT")
    private String toolsTech;

    @Column(name = "meeting_link")
    private String meetingLink;

    public Long getProjectId() {
        return projectId;
    }

    public String getDescription() {
        return description;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getFrontendTech() {
        return frontendTech;
    }

    public String getBackendTech() {
        return backendTech;
    }

    public String getDatabaseTech() {
        return databaseTech;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }
}
