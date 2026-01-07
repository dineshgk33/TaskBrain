package org.example.taskbrain.repository;

import org.example.taskbrain.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject_ProjectId(Long projectId);
}
