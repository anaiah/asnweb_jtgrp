CREATE TABLE besi_smnl_series (
  id INT PRIMARY KEY AUTO_INCREMENT,
  series_data JSON NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- u899193124_asianowjt.besi_users_smnl definition
DROP TABLE besi_users_smnl
CREATE TABLE `besi_users_smnl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `region` varchar(10) DEFAULT NULL,
  `besi_id` varchar(50) DEFAULT NULL,
  `ocw_id` varchar(50) DEFAULT NULL,
  `jms_id` varchar(50) DEFAULT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `middle_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `full_name` varchar(150) DEFAULT NULL,
  `date_hired` date DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `hub` varchar(50) DEFAULT NULL,
  `position_code` varchar(5) DEFAULT NULL,
  `date_added` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_besi_id` (`besi_id`),
  KEY `idx_ocw_id` (`ocw_id`),
  KEY `idx_jms_id` (`jms_id`),
  KEY `idx_full_name` (`full_name`),
  KEY `idx_email` (`email`),
  KEY `idx_hub` (`hub`)
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

