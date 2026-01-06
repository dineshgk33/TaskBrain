package org.example.taskbrain.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.taskbrain.Model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByVerificationCode(String verificationCode);
}
