package org.example.taskbrain.Repository;

import org.example.taskbrain.Model.EmployeeProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeProfileRepository
        extends JpaRepository<EmployeeProfile, Long> {

    Optional<EmployeeProfile> findByUser_UserId(Long userId);
}
