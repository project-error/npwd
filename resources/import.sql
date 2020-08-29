ALTER TABLE `users` ADD COLUMN `phone_number` VARCHAR(20) NULL DEFAULT NULL;

CREATE TABLE es_extended.phone_contacts (
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