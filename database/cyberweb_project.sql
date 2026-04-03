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
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `technologies` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Technologies by CSV',
  `price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `coin_price` int NOT NULL DEFAULT '0',
  `currency_unit` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'USD',
  `category_id` int NOT NULL,
  `views` int NOT NULL DEFAULT '0',
  `rating_avg` decimal(3,2) NOT NULL DEFAULT '0.00',
  `rating_count` int NOT NULL DEFAULT '0',
  `code_file` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Path or URL to source code file',
  `report_file` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Path or URL to report file',
  `research_file` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Path or URL to research file',
  `file_package` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Path or URL to packaged ZIP',
  `demo_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Path or URL to demo video',
  `download_policy` smallint NOT NULL DEFAULT '0' COMMENT '0 = No download, 1 = Allow if coin >= coin_price, 2 = Admin approval required',
  `download_count` int NOT NULL DEFAULT '0',
  `team_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `published_at` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` int NOT NULL COMMENT 'admin create or update any fields',
  `status` smallint NOT NULL DEFAULT '1' COMMENT '0 for inactive, 1 for active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx-project-category_id` (`category_id`),
  KEY `idx-project-team_id` (`team_id`),
  KEY `idx-project-user_id` (`user_id`),
  CONSTRAINT `fk-category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'I am a Developer','i-am-a-developer','An application built by React Native that simulates the life of a developer from his/her born to his/her death','media/images/projects/mobile-application.png','React Native, Firebase',800.00,5000,'2',1,9527,4.50,86,NULL,NULL,NULL,NULL,NULL,1,108,'1,2','19/08/2024',1,1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(2,'I am a Developer 2','i-am-a-developer-2','An application built by React Native that simulates the life of a developer from his/her born to his/her death','media/images/projects/mobile-application.png','Android, iOS',700.00,4500,'2',9,9528,4.90,86,NULL,NULL,NULL,NULL,NULL,1,108,'1,2','19/09/2024',1,1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(3,'I am a Developer 3','i-am-a-developer-3','An application built by React Native that simulates the life of a developer from his/her born to his/her death','media/images/projects/mobile-application.png','Yii2 Advanced',900.00,5500,'2',1,9500,4.40,86,NULL,NULL,NULL,NULL,NULL,1,108,'1,2','19/08/2025',1,1,'2026-03-12 03:03:31','2026-03-12 03:03:31'),(4,'I am a Developer 4','i-am-a-developer-4','An application built by React Native that simulates the life of a developer from his/her born to his/her death','media/images/projects/mobile-application.png','Spring Boot, Hibernate, NoSQL',900.00,5000,'2',1,9530,3.20,86,NULL,NULL,NULL,NULL,NULL,1,108,'1,2','18/08/2024',1,1,'2026-03-12 03:03:31','2026-03-12 03:03:31');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-03 14:13:25
