package org.example.taskbrain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.taskbrain.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByVerificationCode(String verificationCode);

    java.util.List<User> findByManager_Email(String email);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM User u WHERE u.active = false AND u.createdAt < :cutoffTime")
    void deleteUnverifiedOlderThan(
            @org.springframework.data.repository.query.Param("cutoffTime") java.time.LocalDateTime cutoffTime);
}
