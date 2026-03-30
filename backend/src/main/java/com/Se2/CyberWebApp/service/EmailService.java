package com.Se2.CyberWebApp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[CyberTitans] Security Protocol: Access Code");
        message.setText("Operative, your security verification code is: " + otp +
                "\n\nThis code will expire in 5 minutes. Do not share it.");
        mailSender.send(message);
    }
}