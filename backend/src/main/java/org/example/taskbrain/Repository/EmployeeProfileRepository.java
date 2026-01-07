package org.example.taskbrain.repository;

import org.example.taskbrain.model.EmployeeProfile;
import org.example.taskbrain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeProfileRepository
        extends JpaRepository<EmployeeProfile, Long> {

    Optional<EmployeeProfile> findByUser_UserId(Long userId);
    Optional<EmployeeProfile> findByUser(User user);
}

