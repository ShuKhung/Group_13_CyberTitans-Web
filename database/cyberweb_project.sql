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
  `github_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'GitHub repository URL',
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
  `status` smallint NOT NULL DEFAULT '1' COMMENT '0 for inactive, 1 for active, 2 for pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx-project-category_id` (`category_id`),
  KEY `idx-project-team_id` (`team_id`),
  KEY `idx-project-user_id` (`user_id`),
  CONSTRAINT `fk-category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES
(1,'Visual Studio Code','visual-studio-code','Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop. It comes with built-in support for JavaScript, TypeScript and Node.js and has a rich ecosystem of extensions for other languages and runtimes.','https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/visual-studio-code-icon.png','TypeScript, Electron, Node.js','https://github.com/microsoft/vscode',0.00,0,'USD',1,172000,4.90,18000,NULL,NULL,NULL,NULL,NULL,0,0,'microsoft','11/2015',1,1,'2026-04-14 00:00:00','2026-04-14 00:00:00'),
(2,'TensorFlow','tensorflow','An end-to-end open source platform for machine learning. TensorFlow makes it easy for beginners and experts to create machine learning models for desktop, mobile, web, and cloud.','https://images.viblo.asia/b143e7ef-0445-4f08-9a51-8a0a3d507792.jpg','Python, C++, CUDA','https://github.com/tensorflow/tensorflow',0.00,0,'USD',4,185000,4.80,22000,NULL,NULL,NULL,NULL,NULL,0,0,'tensorflow','11/2015',1,1,'2026-04-14 00:00:00','2026-04-14 00:00:00'),
(3,'React Native','react-native','React Native brings React''s declarative UI framework to iOS and Android. With React Native, you use native UI controls and have full access to the native platform. Developed and maintained by Meta.','https://reactnative.dev/img/pwa/manifest-icon-512.png','JavaScript, Java, Objective-C, Kotlin','https://github.com/facebook/react-native',0.00,0,'USD',2,120000,4.70,15000,NULL,NULL,NULL,NULL,NULL,0,0,'facebook','03/2015',1,1,'2026-04-14 00:00:00','2026-04-14 00:00:00'),
(4,'Godot Engine','godot-engine','Godot Engine is a feature-packed, cross-platform game engine to create 2D and 3D games from a unified interface. It provides a comprehensive set of common tools, so you can focus on making games.','https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/godot-game-engine-icon.png','C++, GDScript, C#','https://github.com/godotengine/godot',0.00,0,'USD',6,92000,4.85,12000,NULL,NULL,NULL,NULL,NULL,0,0,'godotengine','01/2014',1,1,'2026-04-14 00:00:00','2026-04-14 00:00:00'),
(5,'Cyber Scanner Pro','cyber-scanner-pro','A pending project waiting for admin approval. This project should not appear on the project grid until approved.','https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=300','Python, Scapy, Security','https://github.com/example/cyber-scanner',0.00,0,'USD',4,0,0.00,0,NULL,NULL,NULL,NULL,NULL,0,0,'ghost-ops','04/2026',1,2,'2026-04-14 00:00:00','2026-04-14 00:00:00');
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

-- Dump completed on 2026-04-14 19:38:00
