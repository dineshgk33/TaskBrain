package org.example.taskbrain.Controller;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.Model.EmployeeProfile;
import org.example.taskbrain.Service.EmployeeProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeProfileController {

    private final EmployeeProfileService profileService;

    @PutMapping("/{userId}/profile")
    public EmployeeProfile updateProfile(
            @PathVariable Long userId,
            @RequestBody EmployeeProfile profile) {

        return profileService.createOrUpdateProfile(userId, profile);
    }
}
