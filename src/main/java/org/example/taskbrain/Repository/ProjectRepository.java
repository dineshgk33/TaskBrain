package org.example.taskbrain.Repository;

import org.example.taskbrain.Model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

}
