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
-- Table structure for table `user_experience`
--

DROP TABLE IF EXISTS `user_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_experience` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `organization_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `organization_logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `organization_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `discipline` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `course_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `teaching_format` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `teaching_level` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `annual_teaching_hours` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `start_date` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `end_date` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `document_proof_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activities_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `achievements_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `materials_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reference_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'education',
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` smallint NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx-user_experience-user_id` (`user_id`),
  CONSTRAINT `fk-user_experience-user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_experience`
--

LOCK TABLES `user_experience` WRITE;
/*!40000 ALTER TABLE `user_experience` DISABLE KEYS */;
INSERT INTO `user_experience` VALUES (1,11,'Hanoi University (HANU)',NULL,NULL,NULL,'Information Technology','Lecturer',NULL,'SAD@#Software Architecture@#Advanced Design;SS1@#Special Subject 1@#Security',NULL,NULL,NULL,'09/2025','PRESENT','\n> system_status: Active Member of CyberTitans Club.\n> focus_area: Software Architecture & Web Infrastructure.\n> mission: Training the next generation of engineers to build impenetrable systems with a focus on SAD and advanced technologies.',NULL,NULL,NULL,NULL,'https://facebook.com/thaison|https://linkedin.com/in/thaison','teaching',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),
(2,11,'MindX Technology School',NULL,NULL,NULL,'Programming','Lecturer',NULL,'WD@#Web Dev@#Frontend;SCR@#Scratch@#Logic',NULL,NULL,NULL,'08/2023','04/2024','Dạy lập trình Web.',NULL,NULL,NULL,NULL,NULL,'teaching',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),
(3,1,'Hanoi University of Science and Technology (HUST)',NULL,NULL,NULL,'Software Engineering','Student',NULL,'SE@#Software Engineering@#Backend;DB@#Database@#MySQL',NULL,NULL,NULL,'09/2019','PRESENT','\n> system_status: Active Member of CyberTitans Club.\n> focus_area: Software Engineering & Web Infrastructure.\n> mission: Training the next generation of engineers to build impenetrable systems.',NULL,NULL,NULL,NULL,'https://facebook.com/thien|https://linkedin.com/in/thien','education',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),
(4,2,'Posts and Telecommunications Institute of Technology (PTIT)',NULL,NULL,NULL,'Information Technology','Student',NULL,'SYS@#System Admin@#Linux;NET@#Networking@#Cisco',NULL,NULL,NULL,'09/2020','PRESENT','\n> system_status: Active Member of CyberTitans Club.\n> focus_area: Information Technology & Networks.\n> mission: Training the next generation of engineers.',NULL,NULL,NULL,NULL,'https://facebook.com/minh|https://linkedin.com/in/minh','education',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),
(5,10,'National Economics University (NEU)',NULL,NULL,NULL,'Management Information Systems','Student',NULL,'BA@#Business Analyst@#Requirements;DA@#Data Analysis@#SQL',NULL,NULL,NULL,'09/2021','PRESENT','\n> system_status: Active Member of CyberTitans Club.\n> focus_area: Management Information Systems.\n> mission: Training the next generation of engineers.',NULL,NULL,NULL,NULL,'https://facebook.com/quyen|https://linkedin.com/in/quyen','education',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),
(6,12,'FPT University (FPTU)',NULL,NULL,NULL,'Software Engineering','Student',NULL,'UI@#UI/UX@#Design;FE@#Frontend@#React',NULL,NULL,NULL,'09/2019','PRESENT','\n> system_status: Active Member of CyberTitans Club.\n> focus_area: Software Engineering & Web Infrastructure.\n> mission: Training the next generation of engineers.',NULL,NULL,NULL,NULL,'https://facebook.com/thai|https://linkedin.com/in/thai','education',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),
(7,13,'Vietnam National University - University of Engineering and Technology (VNU-UET)',NULL,NULL,NULL,'Computer Science','Student',NULL,'DB@#Database@#Postgres;API@#API Design@#REST',NULL,NULL,NULL,'09/2020','PRESENT','\n> system_status: Active Member of CyberTitans Club.\n> focus_area: Computer Science.\n> mission: Training the next generation of engineers.',NULL,NULL,NULL,NULL,'https://facebook.com/nam|https://linkedin.com/in/nam','education',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),
(8,16,'Cyber Security Academy (CSA)',NULL,NULL,NULL,'Information Security','Student',NULL,'SEC@#Security@#Pentest;CEH@#CEH@#Ethical Hacking',NULL,NULL,NULL,'09/2021','PRESENT','\n> system_status: Active Member of CyberTitans Club.\n> focus_area: Information Security.\n> mission: Training the next generation of engineers.',NULL,NULL,NULL,NULL,'https://facebook.com/qqqq|https://linkedin.com/in/qqqq','education',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),
(9,1,'CyberTitans Club',NULL,NULL,NULL,'Backend Development','Software Engineer',NULL,'BE@#Spring Boot@#API Building',NULL,NULL,NULL,'01/2024','PRESENT','Working as a Backend Developer.',NULL,NULL,NULL,NULL,NULL,'job',NULL,1,'2026-04-11 10:00:00','2026-04-11 10:00:00'),
(10,2,'CyberTitans Club',NULL,NULL,NULL,'System Admin','DevOps Engineer',NULL,'DEV@#DevOps@#Docker',NULL,NULL,NULL,'01/2024','PRESENT','Working as DevOps Engineer.',NULL,NULL,NULL,NULL,NULL,'job',NULL,1,'2026-04-11 10:00:00','2026-04-11 10:00:00'),
(11,10,'CyberTitans Club',NULL,NULL,NULL,'Project Management','Business Analyst',NULL,'BA@#Analysis@#Agile',NULL,NULL,NULL,'01/2024','PRESENT','Working as a Business Analyst.',NULL,NULL,NULL,NULL,NULL,'job',NULL,1,'2026-04-11 10:00:00','2026-04-11 10:00:00'),
(12,12,'CyberTitans Club',NULL,NULL,NULL,'Frontend Development','Frontend Developer',NULL,'FE@#React@#UI/UX',NULL,NULL,NULL,'01/2024','PRESENT','Working as a Frontend Developer.',NULL,NULL,NULL,NULL,NULL,'job',NULL,1,'2026-04-11 10:00:00','2026-04-11 10:00:00'),
(13,13,'CyberTitans Club',NULL,NULL,NULL,'Fullstack Development','Fullstack Engineer',NULL,'FS@#Java/React@#Web App',NULL,NULL,NULL,'01/2024','PRESENT','Working as a Fullstack Engineer.',NULL,NULL,NULL,NULL,NULL,'job',NULL,1,'2026-04-11 10:00:00','2026-04-11 10:00:00'),
(14,16,'CyberTitans Club',NULL,NULL,NULL,'Information Security','Pentester',NULL,'PT@#Pentest@#Web Security',NULL,NULL,NULL,'01/2024','PRESENT','Working as a Pentester.',NULL,NULL,NULL,NULL,NULL,'job',NULL,1,'2026-04-11 10:00:00','2026-04-11 10:00:00');
/*!40000 ALTER TABLE `user_experience` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-01 12:14:43
