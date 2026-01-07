package org.example.taskbrain.service;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserCleanupService {

    private final UserRepository userRepository;

    // Run every minute
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void deleteUnverifiedUsers() {
        // Delete users created more than 1 minute ago and still inactive
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(1);
        userRepository.deleteUnverifiedOlderThan(cutoffTime);
        System.out.println("Cleaned up unverified users created before " + cutoffTime);
    }
}
