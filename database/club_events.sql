CREATE TABLE IF NOT EXISTS club_event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date VARCHAR(100),
    location VARCHAR(255),
    capacity VARCHAR(50),
    event_type VARCHAR(50),
    coins INT DEFAULT 0
);

INSERT INTO club_event (title, description, event_date, location, capacity, event_type, coins) VALUES
('IU Spring Hackathon 2026', 'A 12-hour team hackathon open to all IU students. Build a working prototype around the theme "Secure By Design". Prizes include internship opportunities and Cyber Coins.', '12 APR 2026 - 08:00 - 20:00', 'Hall A, IU Campus', '50', 'HACKATHON', 0),
('Web Exploitation Basics', 'Hands-on session covering SQL injection, XSS, CSRF, and SSRF. Bring your laptop. Attendance earns 50 Cyber Coins and is recorded in your verified portfolio.', '02 APR 2026 - 14:00 - 17:00', 'Room B305, IU Campus', '30', 'WORKSHOP', 50),
('VN-CTF 2026 - National Competition', 'National Capture The Flag competition. Categories: Web, Pwn, Crypto, Forensics, Reversing. Top 3 teams earn double Cyber Coins and verified achievement badges.', '20 APR 2026 - 09:00 - 11:00', 'Online', 'Unlimited', 'CTF', 0),
('Spring Boot Masterclass', 'Deep dive into Spring Boot 3.x: building REST APIs, Spring Security, and JPA. Prerequisites: basic Java knowledge. Limited seats - register early.', '05 APR 2026 - 09:00 - 12:00', 'Room C101, IU Campus', '20', 'WORKSHOP', 0),
('Cybersecurity Career Paths in 2026', 'Industry professionals share insights on penetration testing, security engineering, threat intelligence, and GRC. Open Q&A session included.', '15 APR 2026 - 15:00 - 17:00', 'Auditorium, IU Campus', '100', 'SEMINAR', 0);
