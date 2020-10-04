-- comment this out if your server has a different table/location for phone_number
-- or if it already exists in the users table
ALTER TABLE `users` ADD COLUMN `phone_number` VARCHAR(20) NULL DEFAULT NULL;

CREATE TABLE npwd_phone_contacts (
  id int(11) NOT NULL AUTO_INCREMENT,
  identifier varchar(60) DEFAULT NULL,
  number varchar(10) DEFAULT NULL,
  display varchar(60) NOT NULL DEFAULT '',
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 6,
AVG_ROW_LENGTH = 4096,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_general_ci;

INSERT INTO `items` (`name`, `label`, `weight`, `rare`, `can_remove`) VALUES ('phone', 'Phone', 1, 0, 1);
INSERT INTO `items` (`name`, `label`, `weight`, `rare`, `can_remove`) VALUES ('dphone', 'Destroyed Phone', 1, 0, 1);
