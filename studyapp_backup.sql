-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: studyapp
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `quiz_results`
--

DROP TABLE IF EXISTS `quiz_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_results` (
  `quiz_id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_submitter` varchar(100) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `quiz_question_count` int(11) DEFAULT NULL,
  `quiz_score` varchar(5) NOT NULL,
  `quiz_categ` varchar(60) NOT NULL,
  `quiz_duration` varchar(20) NOT NULL,
  `correct_answer_count` int(11) DEFAULT NULL,
  `incorrect_answer_count` int(11) DEFAULT NULL,
  `attempt_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `attempt_count` int(11) NOT NULL,
  PRIMARY KEY (`quiz_id`),
  KEY `study_fkuserid2` (`user_id`),
  KEY `study_fksubmitter1` (`quiz_submitter`),
  CONSTRAINT `study_fksubmitter1` FOREIGN KEY (`quiz_submitter`) REFERENCES `study_users` (`user_username`),
  CONSTRAINT `study_fkuserid2` FOREIGN KEY (`user_id`) REFERENCES `study_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_results`
--

LOCK TABLES `quiz_results` WRITE;
/*!40000 ALTER TABLE `quiz_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_booklets`
--

DROP TABLE IF EXISTS `study_booklets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_booklets` (
  `book_id` int(11) NOT NULL COMMENT 'This PRIMARY KEY is a unique identifier assigned each time a new book is created.',
  `book_categ` varchar(100) NOT NULL COMMENT 'This is an indicator for the category of material covered in the notes.',
  `author_id` int(11) DEFAULT NULL COMMENT 'This foreign key is referencing the user_id column in study_users',
  `note_count` int(11) DEFAULT NULL COMMENT 'This is the amount of notes within the booklet',
  `book_desc` text NOT NULL COMMENT 'This is an overall summary of the booklets material content.',
  `book_label` tinytext NOT NULL COMMENT 'This is the name of the booklet',
  PRIMARY KEY (`book_id`),
  UNIQUE KEY `book_label` (`book_label`) USING HASH,
  KEY `study_fkuserid3` (`author_id`),
  CONSTRAINT `study_fkuserid3` FOREIGN KEY (`author_id`) REFERENCES `study_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_booklets`
--

LOCK TABLES `study_booklets` WRITE;
/*!40000 ALTER TABLE `study_booklets` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_booklets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_notes`
--

DROP TABLE IF EXISTS `study_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_notes` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT,
  `note_author` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `note_cat` varchar(50) DEFAULT NULL,
  `note_difficulty` enum('easy','medium','hard') DEFAULT NULL,
  `note_text` text DEFAULT NULL,
  `note_explanation` text NOT NULL,
  `note_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `note_altered` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `note_tags` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`note_id`),
  KEY `study_fkuserid1` (`user_id`),
  CONSTRAINT `study_fkuserid1` FOREIGN KEY (`user_id`) REFERENCES `study_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_notes`
--

LOCK TABLES `study_notes` WRITE;
/*!40000 ALTER TABLE `study_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_users`
--

DROP TABLE IF EXISTS `study_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_users` (
  `user_id` int(11) NOT NULL,
  `user_full_name` varchar(100) NOT NULL,
  `user_account_number` int(11) DEFAULT NULL,
  `user_username` varchar(100) NOT NULL,
  `user_email` varchar(60) NOT NULL,
  `user_tele` int(11) DEFAULT NULL,
  `user_contact_method` varchar(100) NOT NULL,
  `session_id` varchar(100) NOT NULL,
  `user_cookie` varchar(100) DEFAULT NULL,
  `user_pas_rst_tkn` varchar(100) DEFAULT NULL,
  `user_creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `tkn_expires` timestamp NOT NULL DEFAULT (current_timestamp() + interval 5 minute),
  `user_access_level` tinyint(1) DEFAULT 2,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_username` (`user_username`),
  UNIQUE KEY `session_id` (`session_id`),
  UNIQUE KEY `user_username_2` (`user_username`),
  UNIQUE KEY `user_email` (`user_email`),
  UNIQUE KEY `user_account_number` (`user_account_number`),
  UNIQUE KEY `user_cookie` (`user_cookie`),
  UNIQUE KEY `user_pas_rst_tkn` (`user_pas_rst_tkn`),
  UNIQUE KEY `user_tele` (`user_tele`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_users`
--

LOCK TABLES `study_users` WRITE;
/*!40000 ALTER TABLE `study_users` DISABLE KEYS */;
INSERT INTO `study_users` VALUES (0,'David N Wright',1,'Wright.Dev','David.Wright.Developer@gmail.com',217,'Mobile','NULL','NULL','NULL','0000-00-00 00:00:00','0000-00-00 00:00:00',1);
/*!40000 ALTER TABLE `study_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-09 20:41:28
