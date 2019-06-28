-- MySQL dump 10.13  Distrib 5.7.26, for Linux (x86_64)
--
-- Host: localhost    Database: dashboard
-- ------------------------------------------------------
-- Server version	5.7.26-0ubuntu0.18.04.1-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `energy`
--

DROP TABLE IF EXISTS `energy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `energy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) DEFAULT NULL,
  `group_name` text,
  `energy` double DEFAULT NULL,
  `location` int(11) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `location` (`location`),
  CONSTRAINT `energy_ibfk_1` FOREIGN KEY (`location`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `energy`
--

LOCK TABLES `energy` WRITE;
/*!40000 ALTER TABLE `energy` DISABLE KEYS */;
INSERT INTO `energy` VALUES (1,1,'Pantry',21,1,'2019-06-28 10:37:17',1),(2,2,'washroom',0,1,'2019-06-28 10:48:15',1),(3,3,'Reception',0,1,'2019-06-28 10:48:15',0),(4,4,'Administration',0,1,'2019-06-28 10:48:15',1),(5,5,'Accounts',41,1,'2019-06-28 10:48:15',1),(6,6,'Play Area',37,1,'2019-06-28 10:48:15',1),(7,7,'Pool Area',0,1,'2019-06-28 10:50:18',0),(8,8,'Roms',0,1,'2019-06-28 10:50:18',1),(9,9,'Dinning',0,1,'2019-06-28 10:50:18',1),(10,10,'PGH',0,1,'2019-06-28 10:50:18',1),(11,11,'Acquired Area',12,1,'2019-06-28 10:50:18',1),(12,12,'NonPlay Area',0,1,'2019-06-28 10:50:18',0),(13,7,'Pool Area',0,1,'2019-06-28 09:51:22',0),(14,8,'Roms',0,1,'2019-06-28 09:51:22',1),(15,9,'Dinning',0,1,'2019-06-28 09:51:22',1),(16,10,'PGH',0,1,'2019-06-28 09:51:22',1),(17,11,'Acquired Area',12,1,'2019-06-28 09:51:22',1),(18,12,'NonPlay Area',0,1,'2019-06-28 09:51:22',0),(19,2,'washroom',0,1,'2019-06-28 09:51:22',1),(20,3,'Reception',0,1,'2019-06-28 09:51:22',0),(21,4,'Administration',0,1,'2019-06-28 09:51:22',1),(22,5,'Accounts',41,1,'2019-06-28 09:51:22',1),(23,6,'Play Area',37,1,'2019-06-28 09:51:22',1),(24,1,'Pantry',21,1,'2019-06-28 09:51:22',1),(25,1,'Pantry',21,1,'2019-06-28 08:31:22',1),(26,2,'washroom',0,1,'2019-06-28 08:31:22',1),(27,3,'Reception',0,1,'2019-06-28 08:31:22',0),(28,4,'Administration',0,1,'2019-06-28 08:31:22',1),(29,5,'Accounts',41,1,'2019-06-28 08:31:22',1),(30,6,'Play Area',37,1,'2019-06-28 08:31:22',1),(31,7,'Pool Area',0,1,'2019-06-28 08:31:22',0),(32,8,'Roms',0,1,'2019-06-28 08:31:22',1),(33,9,'Dinning',0,1,'2019-06-28 08:31:22',1),(34,10,'PGH',0,1,'2019-06-28 08:31:22',1),(35,11,'Acquired Area',12,1,'2019-06-28 08:31:22',1),(36,12,'NonPlay Area',0,1,'2019-06-28 08:31:22',0),(37,2,'washroom',0,1,'2019-06-28 08:07:02',1),(38,3,'Reception',0,1,'2019-06-28 08:07:02',0),(39,4,'Administration',0,1,'2019-06-28 08:07:02',1),(40,5,'Accounts',41,1,'2019-06-28 08:07:02',1),(41,6,'Play Area',37,1,'2019-06-28 08:07:02',1),(42,1,'Pantry',21,1,'2019-06-28 08:07:02',1),(43,7,'Pool Area',0,1,'2019-06-28 08:07:02',0),(44,8,'Roms',0,1,'2019-06-28 08:07:02',1),(45,9,'Dinning',0,1,'2019-06-28 08:07:02',1),(46,10,'PGH',0,1,'2019-06-28 08:07:02',1),(47,11,'Acquired Area',12,1,'2019-06-28 08:07:02',1),(48,12,'NonPlay Area',0,1,'2019-06-28 08:07:02',0),(49,1,'Pantry',1,1,'2019-06-28 07:00:00',1),(50,7,'Pool Area',0,1,'2019-06-28 07:00:00',0),(51,8,'Roms',0,1,'2019-06-28 07:00:00',1),(52,9,'Dinning',10,1,'2019-06-28 07:00:00',1),(53,10,'PGH',2,1,'2019-06-28 07:00:00',1),(54,11,'Acquired Area',0,1,'2019-06-28 07:00:00',1),(55,12,'NonPlay Area',0,1,'2019-06-28 07:00:00',0),(56,2,'washroom',11,1,'2019-06-28 07:00:00',1),(57,3,'Reception',0,1,'2019-06-28 07:00:00',0),(58,4,'Administration',20,1,'2019-06-28 07:00:00',1),(59,5,'Accounts',4,1,'2019-06-28 07:00:00',1),(60,6,'Play Area',17,1,'2019-06-28 07:00:00',1),(61,1,'Pantry',50,1,'2019-06-28 05:37:02',1),(62,2,'washroom',31,1,'2019-06-28 05:37:02',1),(63,3,'Reception',0,1,'2019-06-28 05:37:02',0),(64,4,'Administration',0,1,'2019-06-28 05:37:02',1),(65,5,'Accounts',15,1,'2019-06-28 05:37:02',1),(66,6,'Play Area',11,1,'2019-06-28 05:37:02',1),(67,7,'Pool Area',0,1,'2019-06-28 05:37:02',0),(68,8,'Roms',0,1,'2019-06-28 05:37:02',1),(69,9,'Dinning',19,1,'2019-06-28 05:37:02',1),(70,10,'PGH',0,1,'2019-06-28 05:37:02',1),(71,11,'Acquired Area',22,1,'2019-06-28 05:37:02',1),(72,12,'NonPlay Area',0,1,'2019-06-28 05:37:02',0),(73,1,'Pantry',0,1,'2019-06-28 04:30:02',1),(74,2,'washroom',1,1,'2019-06-28 04:30:02',1),(75,3,'Reception',0,1,'2019-06-28 04:30:02',0),(76,4,'Administration',10,1,'2019-06-28 04:30:02',1),(77,5,'Accounts',41,1,'2019-06-28 04:30:02',1),(78,6,'Play Area',31,1,'2019-06-28 04:30:02',1),(79,7,'Pool Area',0,1,'2019-06-28 04:30:02',0),(80,8,'Roms',26,1,'2019-06-28 04:30:02',1),(81,9,'Dinning',12,1,'2019-06-28 04:30:02',1),(82,10,'PGH',33,1,'2019-06-28 04:30:02',1),(83,11,'Acquired Area',7,1,'2019-06-28 04:30:02',1),(84,12,'NonPlay Area',0,1,'2019-06-28 04:30:02',0),(85,1,'Pantry',0,1,'2019-06-28 03:40:02',1),(86,7,'Pool Area',0,1,'2019-06-28 03:40:02',0),(87,8,'Roms',26,1,'2019-06-28 03:40:02',1),(88,9,'Dinning',12,1,'2019-06-28 03:40:02',1),(89,10,'PGH',33,1,'2019-06-28 03:40:02',1),(90,11,'Acquired Area',7,1,'2019-06-28 03:40:02',1),(91,12,'NonPlay Area',0,1,'2019-06-28 03:40:02',0),(92,2,'washroom',1,1,'2019-06-28 03:40:02',1),(93,3,'Reception',0,1,'2019-06-28 03:40:02',0),(94,4,'Administration',10,1,'2019-06-28 03:40:02',1),(95,5,'Accounts',41,1,'2019-06-28 03:40:02',1),(96,6,'Play Area',31,1,'2019-06-28 03:40:02',1),(97,1,'Pantry',0,1,'2019-06-28 02:31:51',1),(98,2,'washroom',0,1,'2019-06-28 02:31:51',1),(99,3,'Reception',37,1,'2019-06-28 02:31:51',0),(100,4,'Administration',10,1,'2019-06-28 02:31:51',1),(101,5,'Accounts',21,1,'2019-06-28 02:31:51',1),(102,6,'Play Area',31,1,'2019-06-28 02:31:51',1),(103,7,'Pool Area',0,1,'2019-06-28 02:31:51',0),(104,8,'Roms',22,1,'2019-06-28 02:31:51',1),(105,9,'Dinning',14,1,'2019-06-28 02:31:51',1),(106,10,'PGH',30,1,'2019-06-28 02:31:51',1),(107,11,'Acquired Area',17,1,'2019-06-28 02:31:51',1),(108,12,'NonPlay Area',0,1,'2019-06-28 02:31:51',0),(109,1,'Pantry',20,1,'2019-06-28 02:01:52',1),(110,7,'Pool Area',0,1,'2019-06-28 02:01:52',0),(111,8,'Roms',21,1,'2019-06-28 02:01:52',1),(112,9,'Dinning',15,1,'2019-06-28 02:01:52',1),(113,10,'PGH',28,1,'2019-06-28 02:01:52',1),(114,11,'Acquired Area',18,1,'2019-06-28 02:01:52',1),(115,12,'NonPlay Area',0,1,'2019-06-28 02:01:52',0),(116,2,'washroom',0,1,'2019-06-28 02:01:52',1),(117,3,'Reception',31,1,'2019-06-28 02:01:52',0),(118,4,'Administration',14,1,'2019-06-28 02:01:52',1),(119,5,'Accounts',25,1,'2019-06-28 02:01:52',1),(120,6,'Play Area',26,1,'2019-06-28 02:01:52',1),(121,1,'Pantry',13,1,'2019-06-28 00:41:52',1),(122,2,'washroom',20,1,'2019-06-28 00:41:52',1),(123,3,'Reception',0,1,'2019-06-28 00:41:52',0),(124,4,'Administration',11,1,'2019-06-28 00:41:52',1),(125,5,'Accounts',21,1,'2019-06-28 00:41:52',1),(126,6,'Play Area',29,1,'2019-06-28 00:41:52',1),(127,7,'Pool Area',0,1,'2019-06-28 00:41:52',0),(128,8,'Roms',18,1,'2019-06-28 00:41:52',1),(129,9,'Dinning',13,1,'2019-06-28 00:41:52',1),(130,10,'PGH',29,1,'2019-06-28 00:41:52',1),(131,11,'Acquired Area',19,1,'2019-06-28 00:41:52',1),(132,12,'NonPlay Area',0,1,'2019-06-28 00:41:52',0);
/*!40000 ALTER TABLE `energy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'DELHI'),(2,'GURUGRAM'),(3,'BANGLORE');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text,
  `password` text,
  `type` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'sashakt','$2a$10$X/NxYBznzWOce/uUvNfm7ewg3nkjrRr7/ZaCVpg/YTCy6ZN4mIZ7O',1,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-28 23:22:34
