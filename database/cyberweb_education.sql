-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cyberweb
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `education`
--

DROP TABLE IF EXISTS `education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `institution` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'School name',
  `institution_logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'School logo',
  `institution_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'School address',
  `institution_website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Official school website',
  `specialization` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Specialization within the degree',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Degree title (e.g. Bachelor, Master)',
  `study_mode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Full-time, Part-time, Online',
  `thesis_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thesis_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_year` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `end_year` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `graduation_date` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Exact graduation date',
  `description_html` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `document_proof_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gpa` decimal(4,2) DEFAULT '0.00',
  `courses` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'CourseID@#CourseName@#Content1, Content 2;CourseID@#CourseName@#Content1, Content 2',
  `activity` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'ActivityID@#ActivityName@#Content1, Content 2;ActivityID@#ActivityName@#Content1, Content 2',
  `achievement` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'AchieveID@#AchieveName@#Content1, Content 2;AchieveID@#AchieveName@#Content1, Content 2',
  `reference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Professor Nguyen Van A@#0987654321@#Dean of Fit, Hanh University;Professor Nguyen Van B@# 0987654321@#Vice Dean of Fit, Hanh University;',
  `alumni_network_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Link to alumni profile',
  `status` smallint NOT NULL DEFAULT '1' COMMENT '0 for inactive, 1 for active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk-education-user_id` (`user_id`),
  CONSTRAINT `fk-education-user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `education_chk_1` CHECK (((`gpa` >= 0) and (`gpa` <= 10)))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education`
--

LOCK TABLES `education` WRITE;
/*!40000 ALTER TABLE `education` DISABLE KEYS */;
INSERT INTO `education` VALUES (1,1,'Hanoi University of Science and Technology (HUST)','logo.png','1 Dai Co Viet','hust.edu.vn','Software Engineering','Bachelor of Engineering','Full-time','AI in Healthcare','http://hust.edu.vn/thesis/1','2019','2023','15/07/2023','<div>Graduated with excellence</div>','proof.jpg',8.50,'SE1@#Software Engineering@#Backend','ACT1@#Hackathon@#First Prize','ACH1@#Scholarship@#Odon Vallet','Prof. X@#0987654321@#Dean of IT','network.url',1,'2026-04-02 10:00:00','2026-04-02 10:00:00'),
(2,2,'Posts and Telecommunications Institute of Technology (PTIT)','logo.png','Km 10 Nguyen Trai','ptit.edu.vn','Information Technology','Bachelor','Full-time','Network Security','http://ptit.edu.vn/thesis/2','2020','2024','15/07/2024','<div>Graduated with excellence</div>','proof.jpg',8.20,'NET1@#Networking@#Cisco','ACT2@#CTF@#Second Prize','ACH2@#Scholarship@#PTIT','Prof. Y@#0987654321@#Dean of IT','network.url',1,'2026-04-02 10:00:00','2026-04-02 10:00:00'),
(3,10,'National Economics University (NEU)','logo.png','207 Giai Phong','neu.edu.vn','Management Information Systems','Bachelor','Full-time','E-Commerce System','http://neu.edu.vn/thesis/3','2021','2025','15/07/2025','<div>Graduated with excellence</div>','proof.jpg',8.00,'MIS1@#MIS@#Data','ACT3@#Biz Plan@#Top 10','ACH3@#Scholarship@#NEU','Prof. Z@#0987654321@#Dean of IT','network.url',1,'2026-04-02 10:00:00','2026-04-02 10:00:00'),
(4,11,'Hanoi University (HANU)','logo.png','Km 9 Nguyen Trai','hanu.edu.vn','Information Technology','Master','Part-time','Secure Web Arch','http://hanu.edu.vn/thesis/4','2015','2017','15/07/2017','<div>Graduated with excellence</div>','proof.jpg',9.00,'SAD1@#Architecture@#Cloud','ACT4@#Research@#IEEE','ACH4@#Award@#Best Paper','Prof. W@#0987654321@#Dean of IT','network.url',1,'2026-04-02 10:00:00','2026-04-02 10:00:00'),
(5,12,'FPT University (FPTU)','logo.png','Hoa Lac','fpt.edu.vn','Software Engineering','Bachelor','Full-time','React Frontend','http://fpt.edu.vn/thesis/5','2019','2023','15/07/2023','<div>Graduated with excellence</div>','proof.jpg',8.10,'FE1@#Frontend@#React','ACT5@#FPT Hackathon@#Winner','ACH5@#Scholarship@#FPT','Prof. V@#0987654321@#Dean of IT','network.url',1,'2026-04-02 10:00:00','2026-04-02 10:00:00'),
(6,13,'Vietnam National University - University of Engineering and Technology (VNU-UET)','logo.png','144 Xuan Thuy','uet.vnu.edu.vn','Computer Science','Bachelor','Full-time','Postgres Opt','http://uet.vnu.edu.vn/thesis/6','2020','2024','15/07/2024','<div>Graduated with excellence</div>','proof.jpg',8.40,'DB1@#Database@#SQL','ACT6@#Olympiad@#Medal','ACH6@#Scholarship@#VNU','Prof. U@#0987654321@#Dean of IT','network.url',1,'2026-04-02 10:00:00','2026-04-02 10:00:00'),
(7,16,'Cyber Security Academy (CSA)','logo.png','Unknown','academy.local','Information Security','Certificate','Online','Ethical Hacking','http://academy.local/thesis/7','2021','2022','15/07/2022','<div>Completed</div>','proof.jpg',9.50,'SEC1@#Security@#CEH','ACT7@#Defcon@#Quals','ACH7@#Cert@#CEH','Prof. T@#0987654321@#Director','network.url',1,'2026-04-02 10:00:00','2026-04-02 10:00:00');
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-01 12:14:42
