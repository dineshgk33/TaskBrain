package org.example.taskbrain.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String recipientEmail, String siteURL, String verificationCode)
            throws MessagingException, UnsupportedEncodingException {

        String subject = "Please verify your registration";
        String senderName = "TaskBrain Team";

        String verifyURL = siteURL + "/api/auth/verify?code=" + verificationCode;

        String content = "<p>Dear User,</p>";
        content += "<p>Please click the link below to verify your registration:</p>";
        content += "<h3><a href=\"" + verifyURL + "\">VERIFY</a></h3>";
        content += "<p>Thank you,<br>The TaskBrain Team</p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("noreply@taskbrain.com", senderName);
        helper.setTo(recipientEmail);
        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }
}

