package org.example.taskbrain.Repository;

import org.example.taskbrain.Model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject_ProjectId(Long projectId);
}