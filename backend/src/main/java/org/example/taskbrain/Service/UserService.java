package org.example.taskbrain.Service;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.Model.User;
import org.example.taskbrain.Repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public User createUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        String randomCode = java.util.UUID.randomUUID().toString();
        user.setVerificationCode(randomCode);
        user.setActive(false);

        User savedUser = userRepository.save(user);

        try {
            // NOTE: Change "http://localhost:8080" to your actual domain if deployed
            emailService.sendVerificationEmail(user.getEmail(), "http://localhost:8080", randomCode);
        } catch (Exception e) {
            System.out.println("⚠️ WARNING: Email could not be sent. Expected if SMTP is not configured.");
            System.out.println("Error: " + e.getMessage());
            // We swallow the exception so the Signup process finishes successfully.
        }

        return savedUser;
    }

    public boolean verifyUser(String verificationCode) {
        User user = userRepository.findByVerificationCode(verificationCode)
                .orElse(null);

        if (user == null || user.getActive()) {
            return false;
        } else {
            user.setVerificationCode(null);
            user.setActive(true);
            userRepository.save(user);
            return true;
        }
    }

    public User validateUser(String email, String rawPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }
}
