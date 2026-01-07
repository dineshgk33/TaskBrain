package org.example.taskbrain.repository;

import org.example.taskbrain.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

}

