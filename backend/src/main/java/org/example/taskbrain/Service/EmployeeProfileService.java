package org.example.taskbrain.service;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.model.EmployeeProfile;
import org.example.taskbrain.model.User;
import org.example.taskbrain.repository.EmployeeProfileRepository;
import org.example.taskbrain.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeProfileService {

    private final EmployeeProfileRepository profileRepo;
    private final UserRepository userRepo;

    public EmployeeProfile createOrUpdateProfile(Long userId, EmployeeProfile data) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EmployeeProfile profile = profileRepo
                .findByUser_UserId(userId)
                .orElse(new EmployeeProfile());

        profile.setUser(user);
        profile.setSkills(data.getSkills());
        profile.setExperienceYears(data.getExperienceYears());
        profile.setTotalProjectsWorked(data.getTotalProjectsWorked());
        profile.setPerformanceRating(data.getPerformanceRating());
        profile.setAvailability(data.getAvailability());

        return profileRepo.save(profile);
    }
}

