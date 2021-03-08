# comment this out if your server has a different table/location for phone_number
# or if it already exists in the users table
ALTER TABLE `users` ADD COLUMN `phone_number` VARCHAR(20) DEFAULT NULL;
INSERT INTO `items` (`name`, `label`, `weight`, `rare`, `can_remove`) VALUES ('phone', 'Phone', 1, 0, 1);
INSERT INTO `items` (`name`, `label`, `weight`, `rare`, `can_remove`) VALUES ('dphone', 'Destroyed Phone', 1, 0, 1);

CREATE TABLE IF NOT EXISTS npwd_phone_contacts (
  id int(11) NOT NULL AUTO_INCREMENT,
  identifier varchar(60) DEFAULT NULL,
  avatar varchar(512) DEFAULT NULL,
  number varchar(10) DEFAULT NULL,
  display varchar(60) NOT NULL DEFAULT '',
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `npwd_twitter_tweets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(1000) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `likes` int NOT NULL DEFAULT '0',
  `identifier` varchar(40) NOT NULL,
  `visible` tinyint NOT NULL DEFAULT '1',
  `images` varchar(1000) DEFAULT '',
  `retweet` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `npwd_twitter_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profile_name` varchar(90) NOT NULL,
  `identifier` varchar(40) NOT NULL,
#   Default Profile avatar can be set here
  `avatar_url` varchar(255) DEFAULT 'https://i.imgur.com/njcJ1rZ.png',
  `bio` varchar(512) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `job` varchar(45) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `profile_name_UNIQUE` (`profile_name`)
);

CREATE TABLE IF NOT EXISTS `npwd_twitter_likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profile_id` int NOT NULL,
  `tweet_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_combination` (`profile_id`,`tweet_id`),
  KEY `profile_idx` (`profile_id`),
  KEY `tweet_idx` (`tweet_id`),
  CONSTRAINT `profile` FOREIGN KEY (`profile_id`) REFERENCES `npwd_twitter_profiles` (`id`),
  CONSTRAINT `tweet` FOREIGN KEY (`tweet_id`) REFERENCES `npwd_twitter_tweets` (`id`) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS npwd_notes (
  id int(11) NOT NULL AUTO_INCREMENT,
  identifier varchar(255) NOT NULL,
  title varchar(255) NOT NULL,
  content varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS npwd_sellout_listings (
  id int(11) NOT NULL AUTO_INCREMENT,
  identifier varchar(255) DEFAULT NULL,
  username varchar(255) DEFAULT NULL,
  name varchar(50) DEFAULT NULL,
  number varchar(255) NOT NULL,
  title varchar(255) DEFAULT NULL,
  url varchar(255) DEFAULT NULL,
  description varchar(255) NOT NULL,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 31,
AVG_ROW_LENGTH = 2048,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_general_ci;
);

CREATE TABLE IF NOT EXISTS npwd_marketplace_reports (
  id int(11) NOT NULL AUTO_INCREMENT,
  listing_id int(11) DEFAULT NULL,
  profile varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `npwd_twitter_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profile_id` int NOT NULL,
  `tweet_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_combination` (`profile_id`,`tweet_id`),
  KEY `profile_idx` (`profile_id`),
  KEY `tweet_idx` (`tweet_id`),
  CONSTRAINT `report_profile` FOREIGN KEY (`profile_id`) REFERENCES `npwd_twitter_profiles` (`id`),
  CONSTRAINT `report_tweet` FOREIGN KEY (`tweet_id`) REFERENCES `npwd_twitter_tweets` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `npwd_messages_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_identifier` varchar(40) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `group_id` varchar(512) NOT NULL,
  `participant_identifier` varchar(40) NOT NULL,
  `label` varchar(60) DEFAULT '',
  `unreadCount` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `npwd_messages_labels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_identifier` varchar(40) NOT NULL,
  `label` varchar(60) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `group_id` varchar(512) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `npwd_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(512) NOT NULL,
  `user_identifier` varchar(40) NOT NULL,
  `group_id` varchar(512) NOT NULL,
  `isRead` tinyint NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `visible` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS npwd_calls (
  id int(11) NOT NULL AUTO_INCREMENT,
  identifier varchar(255) DEFAULT NULL,
  transmitter varchar(255) NOT NULL,
  receiver varchar(255) NOT NULL,
  is_accepted tinyint(4) DEFAULT 0,
  start varchar(255) DEFAULT NULL,
  end varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS npwd_phone_gallery (
  id int(11) NOT NULL AUTO_INCREMENT,
  identifier varchar(255) DEFAULT NULL,
  image varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);
