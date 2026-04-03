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
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `icon_class` varchar(100) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `content_detail` text,
  `link_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Competitive Programming','Master algorithms and data structures through intense coding challenges.','code','LEARN MORE','Our competitive programming track focuses on Big-O analysis, dynamic programming, and graph theory. Perfect for ACM-ICPC aspirants.','/services/cp'),(2,'Web Development Lab','Build modern, scalable web applications using the latest tech stacks.','terminal','EXPLORE LAB','From React to Spring Boot, we cover the full stack. Learn architecture patterns and cloud deployment.','/services/web'),(3,'Cybersecurity Training','Protect digital assets and learn ethical hacking in a safe environment.','shield','ENLIST NOW','Deep dive into penetration testing, network security, and cryptography. The digital vault needs its guardians.','/services/security'),(4,'Mentor Matching','Get 1-on-1 guidance from elite industry professionals and seniors.','groups','FIND A MENTOR','Connect with the best minds. Our mentors provide career advice, code reviews, and tactical industry insights.','/team'),(5,'Project Incubator','Turn your innovative ideas into real-world production-ready products.','rocket_launch','START PROJECT','We provide the infrastructure and guidance to take your project from MVP to launch. Collaboration is key.','/projects'),(6,'Technical Workshops','Regular hands-on sessions covering emerging technologies and tools.','event','VIEW SCHEDULE','Weekly sessions on AI, Blockchain, and DevOps. Keep your skills sharp and updated.','/faq');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-03 12:13:06
