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
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` smallint NOT NULL DEFAULT '1' COMMENT '0 for inactive, 1 for active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx-category-parent_id` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Web Development','web-development',0,'Project about website, web app, SaaS',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(2,'Mobile App','mobile-app',0,'Applications for iOS, Android, or cross-platform',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(3,'Desktop Software','desktop-software',0,'Software for Windows, macOS, Linux',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(4,'AI','ai',0,'Projects related to AI, ML, or Data Science',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(5,'IoT','iot',0,'Hardware, IoT devices, firmware, and embedded systems',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(6,'Game Development','game-development',0,'PC, console, or mobile game projects',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(7,'Automation Tools','automation-tools',0,'Scripts, automation tools, plugins, utilities',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(8,'Blockchain','blockchain',0,'Blockchain, smart contracts, and crypto-related projects',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(9,'AR VR Mixed Reality','ar-vr-mixed-reality',0,'Augmented reality, virtual reality, and mixed reality projects',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(10,'Robotics','robotics',0,'Robotics, control systems, drones',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(11,'Machine Learning','machine-learning',4,'Projects related to Machine Learning',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(12,'Deep Learning','deep-learning',11,'Projects related to Deep Learning',1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(13,'Computer Vision','computer-vision',12,'Projects related to Computer Vision',1,'2026-03-12 03:03:31','2026-03-12 03:03:31');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

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
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'SUPER ADMIN'),(2,'ADMIN'),(12,'RESEARCHER'),(13,'MENTOR');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `point` double DEFAULT '0',
  `role` int DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `coin` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Triệu Quang Thiện',NULL,3636366,1,'superadmin1','123456','0941156936',NULL,'bangbong2232@gmail.com',12000),(2,'Mai Tuấn Minh',NULL,1231,2,'admin2','123456',NULL,NULL,NULL,0),(10,'Ngô Văn Quyền',NULL,15890,1,'nvquyen2404','123456',NULL,NULL,NULL,0),(11,'Nguyễn Thái Sơn',NULL,12450,2,'thaison','123456','11','22','33',0),(12,'Vũ Sơn Thái',NULL,11200,12,'sonthai','123456',NULL,NULL,NULL,0),(13,'Đặng Phương Nam',NULL,1200,13,'Cam','123456','ád',NULL,'ENCRYPTED',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_experience`
--

DROP TABLE IF EXISTS `user_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_experience` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `organization_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `organization_logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `organization_address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `discipline` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position_title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `course_info` text COLLATE utf8mb4_general_ci,
  `teaching_format` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `teaching_level` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `annual_teaching_hours` text COLLATE utf8mb4_general_ci,
  `start_date` varchar(12) COLLATE utf8mb4_general_ci NOT NULL,
  `end_date` varchar(12) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `document_proof_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activities_info` text COLLATE utf8mb4_general_ci,
  `achievements_info` text COLLATE utf8mb4_general_ci,
  `materials_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reference_info` text COLLATE utf8mb4_general_ci,
  `type` varchar(30) COLLATE utf8mb4_general_ci DEFAULT 'education',
  `tags` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
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
INSERT INTO `user_experience` VALUES (1,11,'Hanoi University (Hanu)',NULL,NULL,NULL,'Information Technology','Lecturer',NULL,'SAD@#Software Architecture@#Advanced Design;SS1@#Special Subject 1@#Security',NULL,NULL,NULL,'09/2025','PRESENT','Giảng viên khoa CNTT.',NULL,NULL,NULL,NULL,NULL,'teaching',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),(2,11,'MindX Technology School',NULL,NULL,NULL,'Programming','Lecturer',NULL,'WD@#Web Dev@#Frontend;SCR@#Scratch@#Logic',NULL,NULL,NULL,'08/2023','04/2024','Dạy lập trình Web.',NULL,NULL,NULL,NULL,NULL,'teaching',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47'),(3,1,'HUST',NULL,NULL,NULL,'Information Security','Student',NULL,NULL,NULL,NULL,NULL,'09/2018','06/2022','Tốt nghiệp xuất sắc.',NULL,NULL,NULL,NULL,NULL,'education',NULL,1,'2026-03-26 08:10:47','2026-03-26 08:10:47');
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

-- Dump completed on 2026-03-26 18:31:22
