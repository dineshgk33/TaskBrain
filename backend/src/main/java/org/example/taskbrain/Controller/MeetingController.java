package org.example.taskbrain.controller;

import lombok.RequiredArgsConstructor;
import org.example.taskbrain.dto.MeetingResponse;
import org.example.taskbrain.service.MeetingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping("/{projectId}/create")
    public ResponseEntity<?> createMeeting(@PathVariable Long projectId) {
        try {
            String meetingLink = meetingService.createMeeting(projectId);
            return ResponseEntity.ok(new MeetingResponse(meetingLink));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{projectId}/delete")
    public ResponseEntity<?> stopMeeting(@PathVariable Long projectId) {
        try {
            meetingService.deleteMeeting(projectId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

