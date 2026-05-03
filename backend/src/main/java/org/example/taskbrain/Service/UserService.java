package org.example.taskbrain.service;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.dto.UpdateUserRequest;
import org.example.taskbrain.model.User;
import org.example.taskbrain.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final org.example.taskbrain.repository.EmployeeProfileRepository employeeProfileRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    @org.springframework.beans.factory.annotation.Value("${app.url:http://localhost:8080}")
    private String appUrl;

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public java.util.List<User> getAllUsers(String managerEmail) {
        // If managerEmail is provided, filter by it.
        // Assuming the caller has already verified roles.
        // In a real app, you might check if the managerEmail corresponds to an ADMIN to
        // return all.
        // But for now, we follow the request: manager sees only their employees.
        return userRepository.findByManager_Email(managerEmail);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public User createEmployee(User user, String managerEmail) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Set Manager
        if (managerEmail != null) {
            User manager = userRepository.findByEmail(managerEmail)
                    .orElseThrow(() -> new RuntimeException("Manager not found"));
            user.setManager(manager);
        }

        // 1. Create User
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(org.example.taskbrain.model.Role.EMPLOYEE);
        user.setWorkRole(user.getWorkRole()); // Ensure workRole is persisted
        user.setActive(true); // Auto-activate for now, or use verification
        User savedUser = userRepository.save(user);

        // 2. Create Employee Profile
        org.example.taskbrain.model.EmployeeProfile profile = new org.example.taskbrain.model.EmployeeProfile();
        profile.setUser(savedUser);
        profile.setAvailability(org.example.taskbrain.model.AvailabilityStatus.FREE);
        profile.setCurrentlyWorking("N/A");
        profile.setPerformanceRating(0.0);
        profile.setOnTimeDeliveryPercent(0.0);
        profile.setExperienceYears(0);
        profile.setTotalProjectsWorked(0);

        employeeProfileRepository.save(profile);

        return savedUser;
    }

    public org.example.taskbrain.model.EmployeeProfile updateEmployeeProfile(Long userId,
            org.example.taskbrain.model.EmployeeProfile updatedProfile) {
        org.example.taskbrain.model.EmployeeProfile existingProfile = employeeProfileRepository
                .findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user id: " + userId));

        existingProfile.setSkills(updatedProfile.getSkills());
        existingProfile.setExperienceYears(updatedProfile.getExperienceYears());
        existingProfile.setTotalProjectsWorked(updatedProfile.getTotalProjectsWorked());
        existingProfile.setPerformanceRating(updatedProfile.getPerformanceRating());
        existingProfile.setCurrentlyWorking(updatedProfile.getCurrentlyWorking());
        existingProfile.setOnTimeDeliveryPercent(updatedProfile.getOnTimeDeliveryPercent());
        existingProfile.setAvailability(updatedProfile.getAvailability());

        return employeeProfileRepository.save(existingProfile);
    }

    public User createUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        String randomCode = java.util.UUID.randomUUID().toString();
        user.setVerificationCode(randomCode);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        try {
            // Use configurable APP_URL for emails
            emailService.sendVerificationEmail(user.getEmail(), appUrl, randomCode);
        } catch (Exception e) {
            System.out.println("⚠️ WARNING: Email could not be sent. Expected if SMTP is not configured.");
            System.out.println("Error: " + e.getMessage());
            // We swallow the exception so the Signup process finishes successfully.

            // FALLBACK FOR DEVELOPMENT: If email fails, auto-activate the user so they can
            // login.
            savedUser.setActive(true);
            userRepository.save(savedUser);
            System.out.println("⚠️ User auto-activated since email verification is skipped.");
        }

        return savedUser;
    }

    public String verifyUser(String verificationCode) {
        User user = userRepository.findByVerificationCode(verificationCode)
                .orElse(null);

        if (user == null) {
            return "INVALID";
        }

        if (user.getActive()) {
            return "ALREADY_VERIFIED";
        }

        user.setVerificationCode(null);
        user.setActive(true);
        userRepository.save(user);
        return "SUCCESS";
    }

    public User validateUser(String email, String rawPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long userId, UpdateUserRequest request) {
        User user = getUserById(userId);

        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullName(request.getFullName());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
                throw new RuntimeException("Current password is required to set a new password");
            }

            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid current password");
            }

            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(user);
    }
}
