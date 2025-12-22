package org.example.taskbrain.Service;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.Model.EmployeeProfile;
import org.example.taskbrain.Model.User;
import org.example.taskbrain.Repository.EmployeeProfileRepository;
import org.example.taskbrain.Repository.UserRepository;
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
