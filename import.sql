# comment this out if your server has a different table/location for phone_number
# or if it already exists in the users table
# ALTER TABLE `users` ADD COLUMN `phone_number` VARCHAR(20) DEFAULT NULL;

CREATE TABLE IF NOT EXISTS `npwd_phone_contacts`
(
    `id`         int(11)      NOT NULL AUTO_INCREMENT,
    `identifier` varchar(48)           DEFAULT NULL,
    `avatar`     varchar(255)          DEFAULT NULL,
    `number`     varchar(20)           DEFAULT NULL,
    `display`    varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_twitter_tweets`
(
    `id`         int           NOT NULL AUTO_INCREMENT,
    `message`    varchar(1000) NOT NULL,
    `createdAt`  timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`  timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `likes`      int           NOT NULL DEFAULT '0',
    `identifier` varchar(48)   NOT NULL,
    `visible`    tinyint       NOT NULL DEFAULT '1',
    `images`     varchar(1000)          DEFAULT '',
    `retweet`    int                    DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `identifier` (`identifier`)
);


CREATE TABLE IF NOT EXISTS `npwd_twitter_profiles`
(
    `id`           int         NOT NULL AUTO_INCREMENT,
    `profile_name` varchar(90) NOT NULL,
    `identifier`   varchar(48) NOT NULL,
#   Default Profile avatar can be set here
    `avatar_url`   varchar(255)         DEFAULT 'https://i.file.glass/QrEvq.png',
    `bio`          varchar(512)         DEFAULT NULL,
    `location`     varchar(45)          DEFAULT NULL,
    `job`          varchar(45)          DEFAULT NULL,
    `createdAt`    timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`    timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `profile_name_UNIQUE` (`profile_name`),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_twitter_likes`
(
    `id`         int NOT NULL AUTO_INCREMENT,
    `profile_id` int NOT NULL,
    `tweet_id`   int NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_combination` (`profile_id`, `tweet_id`),
    KEY `profile_idx` (`profile_id`),
    KEY `tweet_idx` (`tweet_id`),
    CONSTRAINT `profile` FOREIGN KEY (`profile_id`) REFERENCES `npwd_twitter_profiles` (`id`),
    CONSTRAINT `tweet` FOREIGN KEY (`tweet_id`) REFERENCES `npwd_twitter_tweets` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `npwd_match_profiles`
(
    `id`         int          NOT NULL AUTO_INCREMENT,
    `identifier` varchar(48)  NOT NULL,
    `name`       varchar(90)  NOT NULL,
    `image`      varchar(255) NOT NULL,
    `bio`        varchar(512)          DEFAULT NULL,
    `location`   varchar(45)           DEFAULT NULL,
    `job`        varchar(45)           DEFAULT NULL,
    `tags`       varchar(255) NOT NULL DEFAULT '',
    `createdAt`  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name_UNIQUE` (`name`),
    UNIQUE KEY `identifier_UNIQUE` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_match_views`
(
    `id`         int         NOT NULL AUTO_INCREMENT,
    `identifier` varchar(48) NOT NULL,
    `profile`    int         NOT NULL,
    `liked`      tinyint              DEFAULT '0',
    `createdAt`  timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`  timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `match_profile_idx` (`profile`),
    CONSTRAINT `match_profile` FOREIGN KEY (`profile`) REFERENCES `npwd_match_profiles` (`id`),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_notes`
(
    `id`         int(11)      NOT NULL AUTO_INCREMENT,
    `identifier` varchar(48)  NOT NULL,
    `title`      varchar(255) NOT NULL,
    `content`    varchar(255) NOT NULL,
    PRIMARY KEY (id),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_marketplace_listings`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `identifier`  varchar(48)           DEFAULT NULL,
    `username`    varchar(255)          DEFAULT NULL,
    `name`        varchar(50)           DEFAULT NULL,
    `number`      varchar(255) NOT NULL,
    `title`       varchar(255)          DEFAULT NULL,
    `url`         varchar(255)          DEFAULT NULL,
    `description` varchar(255) NOT NULL,
    `createdAt`   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_marketplace_reports`
(
    `id`         int(11) NOT NULL AUTO_INCREMENT,
    `listing_id` int(11)      DEFAULT NULL,
    `profile`    varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `npwd_twitter_reports`
(
    `id`         int NOT NULL AUTO_INCREMENT,
    `profile_id` int NOT NULL,
    `tweet_id`   int NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_combination` (`profile_id`, `tweet_id`),
    KEY `profile_idx` (`profile_id`),
    KEY `tweet_idx` (`tweet_id`),
    CONSTRAINT `report_profile` FOREIGN KEY (`profile_id`) REFERENCES `npwd_twitter_profiles` (`id`),
    CONSTRAINT `report_tweet` FOREIGN KEY (`tweet_id`) REFERENCES `npwd_twitter_tweets` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `npwd_messages`
(
    `id`              int(11)      NOT NULL AUTO_INCREMENT,
    `message`         varchar(512) NOT NULL,
    `user_identifier` varchar(48)  NOT NULL,
    `conversation_id` varchar(512) NOT NULL,
    `isRead`          tinyint(4)   NOT NULL DEFAULT 0,
    `createdAt`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updatedAt`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP,
    `visible`         tinyint(4)   NOT NULL DEFAULT 1,
    `author`          varchar(255) NOT NULL,
    PRIMARY KEY (id),
    INDEX `user_identifier` (`user_identifier`)
);

CREATE TABLE `npwd_messages_conversations`
(
    `id`                     int(11)      NOT NULL AUTO_INCREMENT,
    `user_identifier`        varchar(48)  NOT NULL,
    `createdAt`              timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updatedAt`              timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP,
    `conversation_id`        varchar(512) NOT NULL,
    `participant_identifier` varchar(48)  NOT NULL,
    `label`                  varchar(60)           DEFAULT '',
    `unreadCount`            int(11)      NOT NULL DEFAULT 0,
    `unread`                 int(11)               DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX `user_identifier` (`user_identifier`)
);
CREATE TABLE IF NOT EXISTS `npwd_calls`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `identifier`  varchar(48)  DEFAULT NULL,
    `transmitter` varchar(255) NOT NULL,
    `receiver`    varchar(255) NOT NULL,
    `is_accepted` tinyint(4)   DEFAULT 0,
    `start`       varchar(255) DEFAULT NULL,
    end           varchar(255) DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS npwd_phone_gallery
(
    `id`         int(11) NOT NULL AUTO_INCREMENT,
    `identifier` varchar(48)  DEFAULT NULL,
    `image`      varchar(255) NOT NULL,
    PRIMARY KEY (id),
    INDEX `identifier` (`identifier`)
);
