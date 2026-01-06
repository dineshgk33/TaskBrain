package org.example.taskbrain.Service;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.DTO.CreateEmployeeRequest;
import org.example.taskbrain.DTO.UpdateEmployeeRequest; // Ensure you create this DTO
import org.example.taskbrain.Model.*;
import org.example.taskbrain.Repository.EmployeeProfileRepository;
import org.example.taskbrain.Repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PMService {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository profileRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * 1. CREATE ACCOUNT (Used once for a new employee)
     */
    @Transactional
    public EmployeeProfile createEmployee(CreateEmployeeRequest request) {
        // Validation
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email already exists!");
        }

        // Create User
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.TEAM_MEMBER);
        user.setActive(true);
        User savedUser = userRepository.save(user);

        // Create Profile with default values to satisfy NOT NULL constraints
        EmployeeProfile profile = new EmployeeProfile();
        profile.setUser(savedUser);
        profile.setSkills(request.getSkills());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setTotalProjectsWorked(request.getTotalProjectsWorked());
        profile.setPerformanceRating(request.getPerformanceRating());

        // Mandatory fields to prevent Database Errors
        profile.setCurrentlyWorking("IDLE");
        profile.setOnTimeDeliveryPercent(100.0);

        try {
            profile.setAvailability(AvailabilityStatus.valueOf(request.getAvailability().toUpperCase()));
        } catch (Exception e) {
            profile.setAvailability(AvailabilityStatus.FREE);
        }

        return profileRepository.save(profile);
    }

    /**
     * 2. UPDATE ACCOUNT (Used later by PM to update skills/performance)
     */
    @Transactional
    public EmployeeProfile updateEmployee(Long userId, UpdateEmployeeRequest request) {
        // Find existing user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        userRepository.save(user);

        // Find existing profile
        EmployeeProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Update with new values from PM
        profile.setSkills(request.getSkills());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setTotalProjectsWorked(request.getTotalProjectsWorked());
        profile.setPerformanceRating(request.getPerformanceRating());
        profile.setCurrentlyWorking(request.getCurrentlyWorking());
        profile.setOnTimeDeliveryPercent(request.getOnTimeDeliveryPercent());

        try {
            profile.setAvailability(AvailabilityStatus.valueOf(request.getAvailability().toUpperCase()));
        } catch (Exception e) {
            // Keep existing status if invalid
        }

        return profileRepository.save(profile);
    }

    public List<EmployeeProfile> getAllEmployees() {
        return profileRepository.findAll();
    }
}