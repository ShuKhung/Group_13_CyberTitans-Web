package com.Se2.CyberWebApp.service;

import com.Se2.CyberWebApp.entity.ClubEvent;
import com.Se2.CyberWebApp.repository.ClubEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class EventService implements CommandLineRunner {

    @Autowired
    private ClubEventRepository clubEventRepository;

    @Override
    public void run(String... args) throws Exception {
        clubEventRepository.deleteAll();
        if (clubEventRepository.count() == 0) {
            System.out.println("No club events found. Initializing seed data...");
            
            ClubEvent ev1 = new ClubEvent();
            ev1.setTitle("IU Spring Hackathon 2026");
            ev1.setDescription("A 12-hour team hackathon open to all IU students. Build a working prototype around the theme \"Secure By Design\". Prizes include internship opportunities and Cyber Coins.");
            ev1.setEventDate("12.APR.2026 - 08:00 - 20:00");
            ev1.setLocation("Hall A, IU Campus");
            ev1.setCapacity("50");
            ev1.setEventType("HACKATHON");
            ev1.setCoins(0);

            ClubEvent ev2 = new ClubEvent();
            ev2.setTitle("Web Exploitation Basics");
            ev2.setDescription("Hands-on session covering SQL injection, XSS, CSRF, and SSRF. Bring your laptop. Attendance earns 50 Cyber Coins and is recorded in your verified portfolio.");
            ev2.setEventDate("02.APR.2026 - 14:00 - 17:00");
            ev2.setLocation("Room B208, IU Campus");
            ev2.setCapacity("30");
            ev2.setEventType("WORKSHOP");
            ev2.setCoins(50);

            ClubEvent ev3 = new ClubEvent();
            ev3.setTitle("VN-CTF 2026 - National Competition");
            ev3.setDescription("National Capture The Flag competition. Categories: Web, Pwn, Crypto, Forensics, Reversing. Top 3 teams earn double Cyber Coins and verified achievement badges.");
            ev3.setEventDate("20.APR.2026 - 09:00 - 21:00");
            ev3.setLocation("Online");
            ev3.setCapacity("Unlimited");
            ev3.setEventType("CTF");
            ev3.setCoins(0);

            ClubEvent ev4 = new ClubEvent();
            ev4.setTitle("Spring Boot Masterclass");
            ev4.setDescription("Deep dive into Spring Boot 3.x: building REST APIs, Spring Security, and JPA. Prerequisites: basic Java knowledge. Limited seats - register early.");
            ev4.setEventDate("08.APR.2026 - 09:00 - 12:00");
            ev4.setLocation("Room C101, IU Campus");
            ev4.setCapacity("25");
            ev4.setEventType("WORKSHOP");
            ev4.setCoins(0);

            ClubEvent ev5 = new ClubEvent();
            ev5.setTitle("Cybersecurity Career Paths in 2026");
            ev5.setDescription("Industry professionals share insights on penetration testing, security engineering, threat intelligence, and GRC. Open Q&A session included.");
            ev5.setEventDate("15.APR.2026 - 15:00 - 17:00");
            ev5.setLocation("Auditorium, IU Campus");
            ev5.setCapacity("100");
            ev5.setEventType("SEMINAR");
            ev5.setCoins(0);

            clubEventRepository.saveAll(Arrays.asList(ev1, ev2, ev3, ev4, ev5));
            System.out.println("Club events initialized successfully!");
        }
    }
}
