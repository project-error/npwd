CREATE TABLE IF NOT EXISTS `addon_account`
(
    `name`   varchar(60)  NOT NULL,
    `label`  varchar(100) NOT NULL,
    `shared` int(11)      NOT NULL,
    PRIMARY KEY (`name`)
);

INSERT INTO `addon_account` (`name`, `label`, `shared`)
VALUES ('caution', 'caution', 0),
       ('society_ambulance', 'EMS', 1),
       ('society_cardealer', 'Cardealer', 1),
       ('society_mechanic', 'Mechanic', 1),
       ('society_police', 'Police', 1),
       ('society_taxi', 'Taxi', 1);

CREATE TABLE IF NOT EXISTS `addon_account_data`
(
    `id`           int(11) NOT NULL AUTO_INCREMENT,
    `account_name` varchar(100) DEFAULT NULL,
    `money`        int(11) NOT NULL,
    `owner`        varchar(40)  DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `index_addon_account_data_account_name_owner` (`account_name`, `owner`),
    KEY `index_addon_account_data_account_name` (`account_name`)
);

INSERT INTO `addon_account_data` (`id`, `account_name`, `money`, `owner`)
VALUES (1, 'society_cardealer', 0, NULL),
       (2, 'society_police', 0, NULL),
       (3, 'society_ambulance', 0, NULL),
       (4, 'society_mechanic', 0, NULL),
       (5, 'society_taxi', 0, NULL),
       (6, 'caution', 0, 'dba4d971256a8bfb1a543cf0d46e342ad1cdd478');
CREATE TABLE IF NOT EXISTS `addon_inventory`
(
    `name`   varchar(60)  NOT NULL,
    `label`  varchar(100) NOT NULL,
    `shared` int(11)      NOT NULL,
    PRIMARY KEY (`name`)
);

INSERT INTO `addon_inventory` (`name`, `label`, `shared`)
VALUES ('society_ambulance', 'EMS', 1),
       ('society_cardealer', 'Cardealer', 1),
       ('society_mechanic', 'Mechanic', 1),
       ('society_police', 'Police', 1),
       ('society_taxi', 'Taxi', 1);
CREATE TABLE IF NOT EXISTS `addon_inventory_items`
(
    `id`             int(11)      NOT NULL AUTO_INCREMENT,
    `inventory_name` varchar(100) NOT NULL,
    `name`           varchar(100) NOT NULL,
    `count`          int(11)      NOT NULL,
    `owner`          varchar(40) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `index_addon_inventory_items_inventory_name_name` (`inventory_name`, `name`),
    KEY `index_addon_inventory_items_inventory_name_name_owner` (`inventory_name`, `name`, `owner`),
    KEY `index_addon_inventory_inventory_name` (`inventory_name`)
);

CREATE TABLE IF NOT EXISTS `billing`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `identifier`  varchar(40)  NOT NULL,
    `sender`      varchar(40)  NOT NULL,
    `target_type` varchar(50)  NOT NULL,
    `target`      varchar(40)  NOT NULL,
    `label`       varchar(255) NOT NULL,
    `amount`      int(11)      NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `cardealer_vehicles`
(
    `id`      int(11)      NOT NULL AUTO_INCREMENT,
    `vehicle` varchar(255) NOT NULL,
    `price`   int(11)      NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `datastore`
(
    `name`   varchar(60)  NOT NULL,
    `label`  varchar(100) NOT NULL,
    `shared` int(11)      NOT NULL,
    PRIMARY KEY (`name`)
);

INSERT INTO `datastore` (`name`, `label`, `shared`)
VALUES ('society_ambulance', 'EMS', 1),
       ('society_mechanic', 'Mechanic', 1),
       ('society_police', 'Police', 1),
       ('society_taxi', 'Taxi', 1);

CREATE TABLE IF NOT EXISTS `datastore_data`
(
    `id`    int(11)     NOT NULL AUTO_INCREMENT,
    `name`  varchar(60) NOT NULL,
    `owner` varchar(40) DEFAULT NULL,
    `data`  longtext    DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `index_datastore_data_name_owner` (`name`, `owner`),
    KEY `index_datastore_data_name` (`name`)
);

INSERT INTO `datastore_data` (`id`, `name`, `owner`, `data`)
VALUES (1, 'society_police', NULL, '{}'),
       (2, 'society_ambulance', NULL, '{}'),
       (3, 'society_mechanic', NULL, '{}'),
       (4, 'society_taxi', NULL, '{}');
CREATE TABLE IF NOT EXISTS `items`
(
    `name`       varchar(50) NOT NULL,
    `label`      varchar(50) NOT NULL,
    `weight`     int(11)     NOT NULL DEFAULT 1,
    `rare`       tinyint(4)  NOT NULL DEFAULT 0,
    `can_remove` tinyint(4)  NOT NULL DEFAULT 1,
    PRIMARY KEY (`name`)
);

INSERT INTO `items` (`name`, `label`, `weight`, `rare`, `can_remove`)
VALUES ('alive_chicken', 'Living chicken', 1, 0, 1),
       ('bandage', 'Bandage', 2, 0, 1),
       ('blowpipe', 'Blowtorch', 2, 0, 1),
       ('bread', 'Bread', 1, 0, 1),
       ('cannabis', 'Cannabis', 3, 0, 1),
       ('carokit', 'Body Kit', 3, 0, 1),
       ('carotool', 'Tools', 2, 0, 1),
       ('clothe', 'Cloth', 1, 0, 1),
       ('copper', 'Copper', 1, 0, 1),
       ('cutted_wood', 'Cut wood', 1, 0, 1),
       ('diamond', 'Diamond', 1, 0, 1),
       ('essence', 'Gas', 1, 0, 1),
       ('fabric', 'Fabric', 1, 0, 1),
       ('fish', 'Fish', 1, 0, 1),
       ('fixkit', 'Repair Kit', 3, 0, 1),
       ('fixtool', 'Repair Tools', 2, 0, 1),
       ('gazbottle', 'Gas Bottle', 2, 0, 1),
       ('gold', 'Gold', 1, 0, 1),
       ('iron', 'Iron', 1, 0, 1),
       ('marijuana', 'Marijuana', 2, 0, 1),
       ('medikit', 'Medikit', 2, 0, 1),
       ('packaged_chicken', 'Chicken fillet', 1, 0, 1),
       ('packaged_plank', 'Packaged wood', 1, 0, 1),
       ('petrol', 'Oil', 1, 0, 1),
       ('petrol_raffin', 'Processed oil', 1, 0, 1),
       ('phone', 'Phone', 1, 0, 1),
       ('slaughtered_chicken', 'Slaughtered chicken', 1, 0, 1),
       ('stone', 'Stone', 1, 0, 1),
       ('washed_stone', 'Washed stone', 1, 0, 1),
       ('water', 'Water', 1, 0, 1),
       ('wood', 'Wood', 1, 0, 1),
       ('wool', 'Wool', 1, 0, 1);
CREATE TABLE IF NOT EXISTS `jobs`
(
    `name`        varchar(50) NOT NULL,
    `label`       varchar(50)          DEFAULT NULL,
    `whitelisted` tinyint(1)  NOT NULL DEFAULT 0,
    PRIMARY KEY (`name`)
);

INSERT INTO `jobs` (`name`, `label`, `whitelisted`)
VALUES ('ambulance', 'EMS', 0),
       ('cardealer', 'Cardealer', 0),
       ('fisherman', 'Fisherman', 0),
       ('fueler', 'Fueler', 0),
       ('lumberjack', 'Lumberjack', 0),
       ('mechanic', 'Mechanic', 0),
       ('miner', 'Miner', 0),
       ('police', 'LSPD', 0),
       ('reporter', 'Reporter', 0),
       ('slaughterer', 'Butcher', 0),
       ('tailor', 'Tailor', 0),
       ('taxi', 'Taxi', 0),
       ('unemployed', 'Unemployed', 0);
CREATE TABLE IF NOT EXISTS `job_grades`
(
    `id`          int(11)     NOT NULL AUTO_INCREMENT,
    `job_name`    varchar(50) DEFAULT NULL,
    `grade`       int(11)     NOT NULL,
    `name`        varchar(50) NOT NULL,
    `label`       varchar(50) NOT NULL,
    `salary`      int(11)     NOT NULL,
    `skin_male`   longtext    NOT NULL,
    `skin_female` longtext    NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `job_grades` (`id`, `job_name`, `grade`, `name`, `label`, `salary`, `skin_male`, `skin_female`)
VALUES (1, 'unemployed', 0, 'unemployed', 'Unemployed', 200, '{}', '{}'),
       (2, 'police', 0, 'recruit', 'Recrue', 20, '{}', '{}'),
       (3, 'police', 1, 'officer', 'Officier', 40, '{}', '{}'),
       (4, 'police', 2, 'sergeant', 'Sergent', 60, '{}', '{}'),
       (5, 'police', 3, 'lieutenant', 'Lieutenant', 85, '{}', '{}'),
       (6, 'police', 4, 'boss', 'Commandant', 100, '{}', '{}'),
       (11, 'cardealer', 0, 'recruit', 'Recruit', 10, '{}', '{}'),
       (12, 'cardealer', 1, 'novice', 'Novice', 25, '{}', '{}'),
       (13, 'cardealer', 2, 'experienced', 'Experienced', 40, '{}', '{}'),
       (14, 'cardealer', 3, 'boss', 'Boss', 0, '{}', '{}'),
       (15, 'lumberjack', 0, 'employee', 'Employee', 0, '{}', '{}'),
       (16, 'fisherman', 0, 'employee', 'Employee', 0, '{}', '{}'),
       (17, 'fueler', 0, 'employee', 'Employee', 0, '{}', '{}'),
       (18, 'reporter', 0, 'employee', 'Employee', 0, '{}', '{}'),
       (19, 'tailor', 0, 'employee', 'Employee', 0,
        '{"mask_1":0,"arms":1,"glasses_1":0,"hair_color_2":4,"makeup_1":0,"face":19,"glasses":0,"mask_2":0,"makeup_3":0,"skin":29,"helmet_2":0,"lipstick_4":0,"sex":0,"torso_1":24,"makeup_2":0,"bags_2":0,"chain_2":0,"ears_1":-1,"bags_1":0,"bproof_1":0,"shoes_2":0,"lipstick_2":0,"chain_1":0,"tshirt_1":0,"eyebrows_3":0,"pants_2":0,"beard_4":0,"torso_2":0,"beard_2":6,"ears_2":0,"hair_2":0,"shoes_1":36,"tshirt_2":0,"beard_3":0,"hair_1":2,"hair_color_1":0,"pants_1":48,"helmet_1":-1,"bproof_2":0,"eyebrows_4":0,"eyebrows_2":0,"decals_1":0,"age_2":0,"beard_1":5,"shoes":10,"lipstick_1":0,"eyebrows_1":0,"glasses_2":0,"makeup_4":0,"decals_2":0,"lipstick_3":0,"age_1":0}',
        '{"mask_1":0,"arms":5,"glasses_1":5,"hair_color_2":4,"makeup_1":0,"face":19,"glasses":0,"mask_2":0,"makeup_3":0,"skin":29,"helmet_2":0,"lipstick_4":0,"sex":1,"torso_1":52,"makeup_2":0,"bags_2":0,"chain_2":0,"ears_1":-1,"bags_1":0,"bproof_1":0,"shoes_2":1,"lipstick_2":0,"chain_1":0,"tshirt_1":23,"eyebrows_3":0,"pants_2":0,"beard_4":0,"torso_2":0,"beard_2":6,"ears_2":0,"hair_2":0,"shoes_1":42,"tshirt_2":4,"beard_3":0,"hair_1":2,"hair_color_1":0,"pants_1":36,"helmet_1":-1,"bproof_2":0,"eyebrows_4":0,"eyebrows_2":0,"decals_1":0,"age_2":0,"beard_1":5,"shoes":10,"lipstick_1":0,"eyebrows_1":0,"glasses_2":0,"makeup_4":0,"decals_2":0,"lipstick_3":0,"age_1":0}'),
       (20, 'miner', 0, 'employee', 'Employee', 0,
        '{"tshirt_2":1,"ears_1":8,"glasses_1":15,"torso_2":0,"ears_2":2,"glasses_2":3,"shoes_2":1,"pants_1":75,"shoes_1":51,"bags_1":0,"helmet_2":0,"pants_2":7,"torso_1":71,"tshirt_1":59,"arms":2,"bags_2":0,"helmet_1":0}',
        '{}'),
       (21, 'slaughterer', 0, 'employee', 'Employee', 0,
        '{"age_1":0,"glasses_2":0,"beard_1":5,"decals_2":0,"beard_4":0,"shoes_2":0,"tshirt_2":0,"lipstick_2":0,"hair_2":0,"arms":67,"pants_1":36,"skin":29,"eyebrows_2":0,"shoes":10,"helmet_1":-1,"lipstick_1":0,"helmet_2":0,"hair_color_1":0,"glasses":0,"makeup_4":0,"makeup_1":0,"hair_1":2,"bproof_1":0,"bags_1":0,"mask_1":0,"lipstick_3":0,"chain_1":0,"eyebrows_4":0,"sex":0,"torso_1":56,"beard_2":6,"shoes_1":12,"decals_1":0,"face":19,"lipstick_4":0,"tshirt_1":15,"mask_2":0,"age_2":0,"eyebrows_3":0,"chain_2":0,"glasses_1":0,"ears_1":-1,"bags_2":0,"ears_2":0,"torso_2":0,"bproof_2":0,"makeup_2":0,"eyebrows_1":0,"makeup_3":0,"pants_2":0,"beard_3":0,"hair_color_2":4}',
        '{"age_1":0,"glasses_2":0,"beard_1":5,"decals_2":0,"beard_4":0,"shoes_2":0,"tshirt_2":0,"lipstick_2":0,"hair_2":0,"arms":72,"pants_1":45,"skin":29,"eyebrows_2":0,"shoes":10,"helmet_1":-1,"lipstick_1":0,"helmet_2":0,"hair_color_1":0,"glasses":0,"makeup_4":0,"makeup_1":0,"hair_1":2,"bproof_1":0,"bags_1":0,"mask_1":0,"lipstick_3":0,"chain_1":0,"eyebrows_4":0,"sex":1,"torso_1":49,"beard_2":6,"shoes_1":24,"decals_1":0,"face":19,"lipstick_4":0,"tshirt_1":9,"mask_2":0,"age_2":0,"eyebrows_3":0,"chain_2":0,"glasses_1":5,"ears_1":-1,"bags_2":0,"ears_2":0,"torso_2":0,"bproof_2":0,"makeup_2":0,"eyebrows_1":0,"makeup_3":0,"pants_2":0,"beard_3":0,"hair_color_2":4}'),
       (22, 'ambulance', 0, 'ambulance', 'Jr. EMT', 20,
        '{"tshirt_2":0,"hair_color_1":5,"glasses_2":3,"shoes":9,"torso_2":3,"hair_color_2":0,"pants_1":24,"glasses_1":4,"hair_1":2,"sex":0,"decals_2":0,"tshirt_1":15,"helmet_1":8,"helmet_2":0,"arms":92,"face":19,"decals_1":60,"torso_1":13,"hair_2":0,"skin":34,"pants_2":5}',
        '{"tshirt_2":3,"decals_2":0,"glasses":0,"hair_1":2,"torso_1":73,"shoes":1,"hair_color_2":0,"glasses_1":19,"skin":13,"face":6,"pants_2":5,"tshirt_1":75,"pants_1":37,"helmet_1":57,"torso_2":0,"arms":14,"sex":1,"glasses_2":0,"decals_1":0,"hair_2":0,"helmet_2":0,"hair_color_1":0}'),
       (23, 'ambulance', 1, 'doctor', 'EMT', 40,
        '{"tshirt_2":0,"hair_color_1":5,"glasses_2":3,"shoes":9,"torso_2":3,"hair_color_2":0,"pants_1":24,"glasses_1":4,"hair_1":2,"sex":0,"decals_2":0,"tshirt_1":15,"helmet_1":8,"helmet_2":0,"arms":92,"face":19,"decals_1":60,"torso_1":13,"hair_2":0,"skin":34,"pants_2":5}',
        '{"tshirt_2":3,"decals_2":0,"glasses":0,"hair_1":2,"torso_1":73,"shoes":1,"hair_color_2":0,"glasses_1":19,"skin":13,"face":6,"pants_2":5,"tshirt_1":75,"pants_1":37,"helmet_1":57,"torso_2":0,"arms":14,"sex":1,"glasses_2":0,"decals_1":0,"hair_2":0,"helmet_2":0,"hair_color_1":0}'),
       (24, 'ambulance', 2, 'chief_doctor', 'Sr. EMT', 60,
        '{"tshirt_2":0,"hair_color_1":5,"glasses_2":3,"shoes":9,"torso_2":3,"hair_color_2":0,"pants_1":24,"glasses_1":4,"hair_1":2,"sex":0,"decals_2":0,"tshirt_1":15,"helmet_1":8,"helmet_2":0,"arms":92,"face":19,"decals_1":60,"torso_1":13,"hair_2":0,"skin":34,"pants_2":5}',
        '{"tshirt_2":3,"decals_2":0,"glasses":0,"hair_1":2,"torso_1":73,"shoes":1,"hair_color_2":0,"glasses_1":19,"skin":13,"face":6,"pants_2":5,"tshirt_1":75,"pants_1":37,"helmet_1":57,"torso_2":0,"arms":14,"sex":1,"glasses_2":0,"decals_1":0,"hair_2":0,"helmet_2":0,"hair_color_1":0}'),
       (25, 'ambulance', 3, 'boss', 'EMT Supervisor', 80,
        '{"tshirt_2":0,"hair_color_1":5,"glasses_2":3,"shoes":9,"torso_2":3,"hair_color_2":0,"pants_1":24,"glasses_1":4,"hair_1":2,"sex":0,"decals_2":0,"tshirt_1":15,"helmet_1":8,"helmet_2":0,"arms":92,"face":19,"decals_1":60,"torso_1":13,"hair_2":0,"skin":34,"pants_2":5}',
        '{"tshirt_2":3,"decals_2":0,"glasses":0,"hair_1":2,"torso_1":73,"shoes":1,"hair_color_2":0,"glasses_1":19,"skin":13,"face":6,"pants_2":5,"tshirt_1":75,"pants_1":37,"helmet_1":57,"torso_2":0,"arms":14,"sex":1,"glasses_2":0,"decals_1":0,"hair_2":0,"helmet_2":0,"hair_color_1":0}'),
       (26, 'mechanic', 0, 'recrue', 'Recruit', 12, '{}', '{}'),
       (27, 'mechanic', 1, 'novice', 'Novice', 24, '{}', '{}'),
       (28, 'mechanic', 2, 'experimente', 'Experienced', 36, '{}', '{}'),
       (29, 'mechanic', 3, 'chief', 'Leader', 48, '{}', '{}'),
       (30, 'mechanic', 4, 'boss', 'Boss', 0, '{}', '{}'),
       (31, 'taxi', 0, 'recrue', 'Recruit', 12,
        '{"hair_2":0,"hair_color_2":0,"torso_1":32,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":31,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":0,"age_2":0,"glasses_2":0,"ears_2":0,"arms":27,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":0,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":0,"bproof_1":0,"mask_1":0,"decals_1":1,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":0,"eyebrows_1":0,"face":0,"shoes_1":10,"pants_1":24}',
        '{"hair_2":0,"hair_color_2":0,"torso_1":57,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":38,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":1,"age_2":0,"glasses_2":0,"ears_2":0,"arms":21,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":1,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":5,"bproof_1":0,"mask_1":0,"decals_1":1,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":0,"eyebrows_1":0,"face":0,"shoes_1":49,"pants_1":11}'),
       (32, 'taxi', 1, 'novice', 'Cabby', 24,
        '{"hair_2":0,"hair_color_2":0,"torso_1":32,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":31,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":0,"age_2":0,"glasses_2":0,"ears_2":0,"arms":27,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":0,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":0,"bproof_1":0,"mask_1":0,"decals_1":1,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":0,"eyebrows_1":0,"face":0,"shoes_1":10,"pants_1":24}',
        '{"hair_2":0,"hair_color_2":0,"torso_1":57,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":38,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":1,"age_2":0,"glasses_2":0,"ears_2":0,"arms":21,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":1,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":5,"bproof_1":0,"mask_1":0,"decals_1":1,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":0,"eyebrows_1":0,"face":0,"shoes_1":49,"pants_1":11}'),
       (33, 'taxi', 2, 'experimente', 'Experienced', 36,
        '{"hair_2":0,"hair_color_2":0,"torso_1":26,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":57,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":4,"age_2":0,"glasses_2":0,"ears_2":0,"arms":11,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":0,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":0,"bproof_1":0,"mask_1":0,"decals_1":0,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":0,"eyebrows_1":0,"face":0,"shoes_1":10,"pants_1":24}',
        '{"hair_2":0,"hair_color_2":0,"torso_1":57,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":38,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":1,"age_2":0,"glasses_2":0,"ears_2":0,"arms":21,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":1,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":5,"bproof_1":0,"mask_1":0,"decals_1":1,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":0,"eyebrows_1":0,"face":0,"shoes_1":49,"pants_1":11}'),
       (34, 'taxi', 3, 'uber', 'Uber Cabby', 48,
        '{"hair_2":0,"hair_color_2":0,"torso_1":26,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":57,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":4,"age_2":0,"glasses_2":0,"ears_2":0,"arms":11,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":0,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":0,"bproof_1":0,"mask_1":0,"decals_1":0,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":0,"eyebrows_1":0,"face":0,"shoes_1":10,"pants_1":24}',
        '{"hair_2":0,"hair_color_2":0,"torso_1":57,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":38,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":1,"age_2":0,"glasses_2":0,"ears_2":0,"arms":21,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":1,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":5,"bproof_1":0,"mask_1":0,"decals_1":1,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":0,"eyebrows_1":0,"face":0,"shoes_1":49,"pants_1":11}'),
       (35, 'taxi', 4, 'boss', 'Lead Cabby', 0,
        '{"hair_2":0,"hair_color_2":0,"torso_1":29,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":31,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":4,"age_2":0,"glasses_2":0,"ears_2":0,"arms":1,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":0,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":0,"bproof_1":0,"mask_1":0,"decals_1":0,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":4,"eyebrows_1":0,"face":0,"shoes_1":10,"pants_1":24}',
        '{"hair_2":0,"hair_color_2":0,"torso_1":57,"bags_1":0,"helmet_2":0,"chain_2":0,"eyebrows_3":0,"makeup_3":0,"makeup_2":0,"tshirt_1":38,"makeup_1":0,"bags_2":0,"makeup_4":0,"eyebrows_4":0,"chain_1":0,"lipstick_4":0,"bproof_2":0,"hair_color_1":0,"decals_2":0,"pants_2":1,"age_2":0,"glasses_2":0,"ears_2":0,"arms":21,"lipstick_1":0,"ears_1":-1,"mask_2":0,"sex":1,"lipstick_3":0,"helmet_1":-1,"shoes_2":0,"beard_2":0,"beard_1":0,"lipstick_2":0,"beard_4":0,"glasses_1":5,"bproof_1":0,"mask_1":0,"decals_1":1,"hair_1":0,"eyebrows_2":0,"beard_3":0,"age_1":0,"tshirt_2":0,"skin":0,"torso_2":0,"eyebrows_1":0,"face":0,"shoes_1":49,"pants_1":11}');

CREATE TABLE IF NOT EXISTS `licenses`
(
    `type`  varchar(60) NOT NULL,
    `label` varchar(60) NOT NULL,
    PRIMARY KEY (`type`)
);

INSERT INTO `licenses` (`type`, `label`)
VALUES ('weed_processing', 'Weed Processing License');

CREATE TABLE IF NOT EXISTS `owned_vehicles`
(
    `owner`   varchar(40) NOT NULL,
    `plate`   varchar(12) NOT NULL,
    `vehicle` longtext             DEFAULT NULL,
    `type`    varchar(20) NOT NULL DEFAULT 'car',
    `job`     varchar(20)          DEFAULT NULL,
    `stored`  tinyint(4)  NOT NULL DEFAULT 0,
    PRIMARY KEY (`plate`)
);

CREATE TABLE IF NOT EXISTS `rented_vehicles`
(
    `vehicle`     varchar(60)  NOT NULL,
    `plate`       varchar(12)  NOT NULL,
    `player_name` varchar(255) NOT NULL,
    `base_price`  int(11)      NOT NULL,
    `rent_price`  int(11)      NOT NULL,
    `owner`       varchar(22)  NOT NULL,
    PRIMARY KEY (`plate`)
);

-- Dumping structure for table npwd_test.shops
CREATE TABLE IF NOT EXISTS `shops`
(
    `id`    int(11)      NOT NULL AUTO_INCREMENT,
    `store` varchar(100) NOT NULL,
    `item`  varchar(100) NOT NULL,
    `price` int(11)      NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `shops` (`id`, `store`, `item`, `price`)
VALUES (1, 'TwentyFourSeven', 'bread', 30),
       (2, 'TwentyFourSeven', 'water', 15),
       (3, 'RobsLiquor', 'bread', 30),
       (4, 'RobsLiquor', 'water', 15),
       (5, 'LTDgasoline', 'bread', 30),
       (6, 'LTDgasoline', 'water', 15);

CREATE TABLE IF NOT EXISTS `society_moneywash`
(
    `id`         int(11)     NOT NULL AUTO_INCREMENT,
    `identifier` varchar(60) NOT NULL,
    `society`    varchar(60) NOT NULL,
    `amount`     int(11)     NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `users`
(
    `identifier`   varchar(40) NOT NULL,
    `accounts`     longtext     DEFAULT NULL,
    `group`        varchar(50)  DEFAULT 'user',
    `inventory`    longtext     DEFAULT NULL,
    `job`          varchar(20)  DEFAULT 'unemployed',
    `job_grade`    int(11)      DEFAULT 0,
    `loadout`      longtext     DEFAULT NULL,
    `position`     varchar(255) DEFAULT '{"x":-269.4,"y":-955.3,"z":31.2,"heading":205.8}',
    `firstname`    varchar(16)  DEFAULT NULL,
    `lastname`     varchar(16)  DEFAULT NULL,
    `dateofbirth`  varchar(10)  DEFAULT NULL,
    `sex`          varchar(1)   DEFAULT NULL,
    `height`       int(11)      DEFAULT NULL,
    `skin`         longtext     DEFAULT NULL,
    `status`       longtext     DEFAULT NULL,
    `is_dead`      tinyint(1)   DEFAULT 0,
    `phone_number` varchar(20)  DEFAULT NULL,
    PRIMARY KEY (`identifier`)
);

INSERT INTO `users` (`identifier`, `accounts`, `group`, `inventory`, `job`, `job_grade`, `loadout`, `position`,
                     `firstname`, `lastname`, `dateofbirth`, `sex`, `height`, `skin`, `status`, `is_dead`,
                     `phone_number`)
VALUES ('dba4d971256a8bfb1a543cf0d46e342ad1cdd478', '{"black_money":0,"bank":183800,"money":0}', 'admin', '[]',
        'unemployed', 0, '[]', '{"heading":208.9,"z":31.7,"y":-1346.9,"x":385.7}', 'Nice', 'Meme', '01/10/1995', 'm',
        62,
        '{"chest_1":0,"lipstick_3":0,"bags_2":0,"lipstick_1":0,"chest_2":0,"chain_2":0,"shoes_2":0,"hair_color_2":0,"bags_1":0,"makeup_2":0,"hair_2":0,"bracelets_2":0,"arms":0,"shoes_1":0,"sex":0,"complexion_1":0,"moles_1":0,"sun_2":0,"moles_2":0,"bodyb_1":0,"hair_color_1":0,"lipstick_4":0,"lipstick_2":0,"makeup_1":0,"beard_4":0,"watches_2":0,"blush_1":0,"helmet_1":-1,"decals_1":0,"pants_1":0,"bodyb_2":0,"age_1":0,"pants_2":0,"beard_1":0,"ears_1":-1,"blemishes_2":0,"helmet_2":0,"torso_2":0,"tshirt_2":0,"eyebrows_1":0,"tshirt_1":0,"ears_2":0,"arms_2":0,"bproof_1":0,"makeup_3":0,"torso_1":0,"eyebrows_3":0,"bproof_2":0,"watches_1":-1,"hair_1":0,"mask_2":0,"decals_2":0,"face":0,"bracelets_1":-1,"age_2":0,"eyebrows_4":0,"blemishes_1":0,"glasses_2":0,"skin":0,"beard_2":0,"eye_color":0,"beard_3":0,"sun_1":0,"eyebrows_2":0,"chest_3":0,"blush_2":0,"mask_1":0,"blush_3":0,"makeup_4":0,"complexion_2":0,"chain_1":0,"glasses_1":0}',
        '[{"percent":88.42,"val":884200,"name":"hunger"},{"percent":91.315,"val":913150,"name":"thirst"}]', 0,
        '704-1549');

CREATE TABLE IF NOT EXISTS `user_licenses`
(
    `id`    int(11)     NOT NULL AUTO_INCREMENT,
    `type`  varchar(60) NOT NULL,
    `owner` varchar(40) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `user_parkings`
(
    `id`         int(11) NOT NULL AUTO_INCREMENT,
    `identifier` varchar(60) DEFAULT NULL,
    `garage`     varchar(60) DEFAULT NULL,
    `zone`       int(11) NOT NULL,
    `vehicle`    longtext    DEFAULT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `vehicles`
(
    `name`     varchar(60) NOT NULL,
    `model`    varchar(60) NOT NULL,
    `price`    int(11)     NOT NULL,
    `category` varchar(60) DEFAULT NULL,
    PRIMARY KEY (`model`)
);

INSERT INTO `vehicles` (`name`, `model`, `price`, `category`)
VALUES ('Adder', 'adder', 900000, 'super'),
       ('Akuma', 'AKUMA', 7500, 'motorcycles'),
       ('Alpha', 'alpha', 60000, 'sports'),
       ('Ardent', 'ardent', 1150000, 'sportsclassics'),
       ('Asea', 'asea', 5500, 'sedans'),
       ('Autarch', 'autarch', 1955000, 'super'),
       ('Avarus', 'avarus', 18000, 'motorcycles'),
       ('Bagger', 'bagger', 13500, 'motorcycles'),
       ('Baller', 'baller2', 40000, 'suvs'),
       ('Baller Sport', 'baller3', 60000, 'suvs'),
       ('Banshee', 'banshee', 70000, 'sports'),
       ('Banshee 900R', 'banshee2', 255000, 'super'),
       ('Bati 801', 'bati', 12000, 'motorcycles'),
       ('Bati 801RR', 'bati2', 19000, 'motorcycles'),
       ('Bestia GTS', 'bestiagts', 55000, 'sports'),
       ('BF400', 'bf400', 6500, 'motorcycles'),
       ('Bf Injection', 'bfinjection', 16000, 'offroad'),
       ('Bifta', 'bifta', 12000, 'offroad'),
       ('Bison', 'bison', 45000, 'vans'),
       ('Blade', 'blade', 15000, 'muscle'),
       ('Blazer', 'blazer', 6500, 'offroad'),
       ('Blazer Sport', 'blazer4', 8500, 'offroad'),
       ('blazer5', 'blazer5', 1755600, 'offroad'),
       ('Blista', 'blista', 8000, 'compacts'),
       ('BMX (velo)', 'bmx', 160, 'motorcycles'),
       ('Bobcat XL', 'bobcatxl', 32000, 'vans'),
       ('Brawler', 'brawler', 45000, 'offroad'),
       ('Brioso R/A', 'brioso', 18000, 'compacts'),
       ('Btype', 'btype', 62000, 'sportsclassics'),
       ('Btype Hotroad', 'btype2', 155000, 'sportsclassics'),
       ('Btype Luxe', 'btype3', 85000, 'sportsclassics'),
       ('Buccaneer', 'buccaneer', 18000, 'muscle'),
       ('Buccaneer Rider', 'buccaneer2', 24000, 'muscle'),
       ('Buffalo', 'buffalo', 12000, 'sports'),
       ('Buffalo S', 'buffalo2', 20000, 'sports'),
       ('Bullet', 'bullet', 90000, 'super'),
       ('Burrito', 'burrito3', 19000, 'vans'),
       ('Camper', 'camper', 42000, 'vans'),
       ('Carbonizzare', 'carbonizzare', 75000, 'sports'),
       ('Carbon RS', 'carbonrs', 18000, 'motorcycles'),
       ('Casco', 'casco', 30000, 'sportsclassics'),
       ('Cavalcade', 'cavalcade2', 55000, 'suvs'),
       ('Cheetah', 'cheetah', 375000, 'super'),
       ('Chimera', 'chimera', 38000, 'motorcycles'),
       ('Chino', 'chino', 15000, 'muscle'),
       ('Chino Luxe', 'chino2', 19000, 'muscle'),
       ('Cliffhanger', 'cliffhanger', 9500, 'motorcycles'),
       ('Cognoscenti Cabrio', 'cogcabrio', 55000, 'coupes'),
       ('Cognoscenti', 'cognoscenti', 55000, 'sedans'),
       ('Comet', 'comet2', 65000, 'sports'),
       ('Comet 5', 'comet5', 1145000, 'sports'),
       ('Contender', 'contender', 70000, 'suvs'),
       ('Coquette', 'coquette', 65000, 'sports'),
       ('Coquette Classic', 'coquette2', 40000, 'sportsclassics'),
       ('Coquette BlackFin', 'coquette3', 55000, 'muscle'),
       ('Cruiser (velo)', 'cruiser', 510, 'motorcycles'),
       ('Cyclone', 'cyclone', 1890000, 'super'),
       ('Daemon', 'daemon', 11500, 'motorcycles'),
       ('Daemon High', 'daemon2', 13500, 'motorcycles'),
       ('Defiler', 'defiler', 9800, 'motorcycles'),
       ('Deluxo', 'deluxo', 4721500, 'sportsclassics'),
       ('Dominator', 'dominator', 35000, 'muscle'),
       ('Double T', 'double', 28000, 'motorcycles'),
       ('Dubsta', 'dubsta', 45000, 'suvs'),
       ('Dubsta Luxuary', 'dubsta2', 60000, 'suvs'),
       ('Bubsta 6x6', 'dubsta3', 120000, 'offroad'),
       ('Dukes', 'dukes', 28000, 'muscle'),
       ('Dune Buggy', 'dune', 8000, 'offroad'),
       ('Elegy', 'elegy2', 38500, 'sports'),
       ('Emperor', 'emperor', 8500, 'sedans'),
       ('Enduro', 'enduro', 5500, 'motorcycles'),
       ('Entity XF', 'entityxf', 425000, 'super'),
       ('Esskey', 'esskey', 4200, 'motorcycles'),
       ('Exemplar', 'exemplar', 32000, 'coupes'),
       ('F620', 'f620', 40000, 'coupes'),
       ('Faction', 'faction', 20000, 'muscle'),
       ('Faction Rider', 'faction2', 30000, 'muscle'),
       ('Faction XL', 'faction3', 40000, 'muscle'),
       ('Faggio', 'faggio', 1900, 'motorcycles'),
       ('Vespa', 'faggio2', 2800, 'motorcycles'),
       ('Felon', 'felon', 42000, 'coupes'),
       ('Felon GT', 'felon2', 55000, 'coupes'),
       ('Feltzer', 'feltzer2', 55000, 'sports'),
       ('Stirling GT', 'feltzer3', 65000, 'sportsclassics'),
       ('Fixter (velo)', 'fixter', 225, 'motorcycles'),
       ('FMJ', 'fmj', 185000, 'super'),
       ('Fhantom', 'fq2', 17000, 'suvs'),
       ('Fugitive', 'fugitive', 12000, 'sedans'),
       ('Furore GT', 'furoregt', 45000, 'sports'),
       ('Fusilade', 'fusilade', 40000, 'sports'),
       ('Gargoyle', 'gargoyle', 16500, 'motorcycles'),
       ('Gauntlet', 'gauntlet', 30000, 'muscle'),
       ('Gang Burrito', 'gburrito', 45000, 'vans'),
       ('Burrito', 'gburrito2', 29000, 'vans'),
       ('Glendale', 'glendale', 6500, 'sedans'),
       ('Grabger', 'granger', 50000, 'suvs'),
       ('Gresley', 'gresley', 47500, 'suvs'),
       ('GT 500', 'gt500', 785000, 'sportsclassics'),
       ('Guardian', 'guardian', 45000, 'offroad'),
       ('Hakuchou', 'hakuchou', 31000, 'motorcycles'),
       ('Hakuchou Sport', 'hakuchou2', 55000, 'motorcycles'),
       ('Hermes', 'hermes', 535000, 'muscle'),
       ('Hexer', 'hexer', 12000, 'motorcycles'),
       ('Hotknife', 'hotknife', 125000, 'muscle'),
       ('Huntley S', 'huntley', 40000, 'suvs'),
       ('Hustler', 'hustler', 625000, 'muscle'),
       ('Infernus', 'infernus', 180000, 'super'),
       ('Innovation', 'innovation', 23500, 'motorcycles'),
       ('Intruder', 'intruder', 7500, 'sedans'),
       ('Issi', 'issi2', 10000, 'compacts'),
       ('Jackal', 'jackal', 38000, 'coupes'),
       ('Jester', 'jester', 65000, 'sports'),
       ('Jester(Racecar)', 'jester2', 135000, 'sports'),
       ('Journey', 'journey', 6500, 'vans'),
       ('Kamacho', 'kamacho', 345000, 'offroad'),
       ('Khamelion', 'khamelion', 38000, 'sports'),
       ('Kuruma', 'kuruma', 30000, 'sports'),
       ('Landstalker', 'landstalker', 35000, 'suvs'),
       ('RE-7B', 'le7b', 325000, 'super'),
       ('Lynx', 'lynx', 40000, 'sports'),
       ('Mamba', 'mamba', 70000, 'sports'),
       ('Manana', 'manana', 12800, 'sportsclassics'),
       ('Manchez', 'manchez', 5300, 'motorcycles'),
       ('Massacro', 'massacro', 65000, 'sports'),
       ('Massacro(Racecar)', 'massacro2', 130000, 'sports'),
       ('Mesa', 'mesa', 16000, 'suvs'),
       ('Mesa Trail', 'mesa3', 40000, 'suvs'),
       ('Minivan', 'minivan', 13000, 'vans'),
       ('Monroe', 'monroe', 55000, 'sportsclassics'),
       ('The Liberator', 'monster', 210000, 'offroad'),
       ('Moonbeam', 'moonbeam', 18000, 'vans'),
       ('Moonbeam Rider', 'moonbeam2', 35000, 'vans'),
       ('Nemesis', 'nemesis', 5800, 'motorcycles'),
       ('Neon', 'neon', 1500000, 'sports'),
       ('Nightblade', 'nightblade', 35000, 'motorcycles'),
       ('Nightshade', 'nightshade', 65000, 'muscle'),
       ('9F', 'ninef', 65000, 'sports'),
       ('9F Cabrio', 'ninef2', 80000, 'sports'),
       ('Omnis', 'omnis', 35000, 'sports'),
       ('Oppressor', 'oppressor', 3524500, 'super'),
       ('Oracle XS', 'oracle2', 35000, 'coupes'),
       ('Osiris', 'osiris', 160000, 'super'),
       ('Panto', 'panto', 10000, 'compacts'),
       ('Paradise', 'paradise', 19000, 'vans'),
       ('Pariah', 'pariah', 1420000, 'sports'),
       ('Patriot', 'patriot', 55000, 'suvs'),
       ('PCJ-600', 'pcj', 6200, 'motorcycles'),
       ('Penumbra', 'penumbra', 28000, 'sports'),
       ('Pfister', 'pfister811', 85000, 'super'),
       ('Phoenix', 'phoenix', 12500, 'muscle'),
       ('Picador', 'picador', 18000, 'muscle'),
       ('Pigalle', 'pigalle', 20000, 'sportsclassics'),
       ('Prairie', 'prairie', 12000, 'compacts'),
       ('Premier', 'premier', 8000, 'sedans'),
       ('Primo Custom', 'primo2', 14000, 'sedans'),
       ('X80 Proto', 'prototipo', 2500000, 'super'),
       ('Radius', 'radi', 29000, 'suvs'),
       ('raiden', 'raiden', 1375000, 'sports'),
       ('Rapid GT', 'rapidgt', 35000, 'sports'),
       ('Rapid GT Convertible', 'rapidgt2', 45000, 'sports'),
       ('Rapid GT3', 'rapidgt3', 885000, 'sportsclassics'),
       ('Reaper', 'reaper', 150000, 'super'),
       ('Rebel', 'rebel2', 35000, 'offroad'),
       ('Regina', 'regina', 5000, 'sedans'),
       ('Retinue', 'retinue', 615000, 'sportsclassics'),
       ('Revolter', 'revolter', 1610000, 'sports'),
       ('riata', 'riata', 380000, 'offroad'),
       ('Rocoto', 'rocoto', 45000, 'suvs'),
       ('Ruffian', 'ruffian', 6800, 'motorcycles'),
       ('Ruiner 2', 'ruiner2', 5745600, 'muscle'),
       ('Rumpo', 'rumpo', 15000, 'vans'),
       ('Rumpo Trail', 'rumpo3', 19500, 'vans'),
       ('Sabre Turbo', 'sabregt', 20000, 'muscle'),
       ('Sabre GT', 'sabregt2', 25000, 'muscle'),
       ('Sanchez', 'sanchez', 5300, 'motorcycles'),
       ('Sanchez Sport', 'sanchez2', 5300, 'motorcycles'),
       ('Sanctus', 'sanctus', 25000, 'motorcycles'),
       ('Sandking', 'sandking', 55000, 'offroad'),
       ('Savestra', 'savestra', 990000, 'sportsclassics'),
       ('SC 1', 'sc1', 1603000, 'super'),
       ('Schafter', 'schafter2', 25000, 'sedans'),
       ('Schafter V12', 'schafter3', 50000, 'sports'),
       ('Scorcher (velo)', 'scorcher', 280, 'motorcycles'),
       ('Seminole', 'seminole', 25000, 'suvs'),
       ('Sentinel', 'sentinel', 32000, 'coupes'),
       ('Sentinel XS', 'sentinel2', 40000, 'coupes'),
       ('Sentinel3', 'sentinel3', 650000, 'sports'),
       ('Seven 70', 'seven70', 39500, 'sports'),
       ('ETR1', 'sheava', 220000, 'super'),
       ('Shotaro Concept', 'shotaro', 320000, 'motorcycles'),
       ('Slam Van', 'slamvan3', 11500, 'muscle'),
       ('Sovereign', 'sovereign', 22000, 'motorcycles'),
       ('Stinger', 'stinger', 80000, 'sportsclassics'),
       ('Stinger GT', 'stingergt', 75000, 'sportsclassics'),
       ('Streiter', 'streiter', 500000, 'sports'),
       ('Stretch', 'stretch', 90000, 'sedans'),
       ('Stromberg', 'stromberg', 3185350, 'sports'),
       ('Sultan', 'sultan', 15000, 'sports'),
       ('Sultan RS', 'sultanrs', 65000, 'super'),
       ('Super Diamond', 'superd', 130000, 'sedans'),
       ('Surano', 'surano', 50000, 'sports'),
       ('Surfer', 'surfer', 12000, 'vans'),
       ('T20', 't20', 300000, 'super'),
       ('Tailgater', 'tailgater', 30000, 'sedans'),
       ('Tampa', 'tampa', 16000, 'muscle'),
       ('Drift Tampa', 'tampa2', 80000, 'sports'),
       ('Thrust', 'thrust', 24000, 'motorcycles'),
       ('Tri bike (velo)', 'tribike3', 520, 'motorcycles'),
       ('Trophy Truck', 'trophytruck', 60000, 'offroad'),
       ('Trophy Truck Limited', 'trophytruck2', 80000, 'offroad'),
       ('Tropos', 'tropos', 40000, 'sports'),
       ('Turismo R', 'turismor', 350000, 'super'),
       ('Tyrus', 'tyrus', 600000, 'super'),
       ('Vacca', 'vacca', 120000, 'super'),
       ('Vader', 'vader', 7200, 'motorcycles'),
       ('Verlierer', 'verlierer2', 70000, 'sports'),
       ('Vigero', 'vigero', 12500, 'muscle'),
       ('Virgo', 'virgo', 14000, 'muscle'),
       ('Viseris', 'viseris', 875000, 'sportsclassics'),
       ('Visione', 'visione', 2250000, 'super'),
       ('Voltic', 'voltic', 90000, 'super'),
       ('Voltic 2', 'voltic2', 3830400, 'super'),
       ('Voodoo', 'voodoo', 7200, 'muscle'),
       ('Vortex', 'vortex', 9800, 'motorcycles'),
       ('Warrener', 'warrener', 4000, 'sedans'),
       ('Washington', 'washington', 9000, 'sedans'),
       ('Windsor', 'windsor', 95000, 'coupes'),
       ('Windsor Drop', 'windsor2', 125000, 'coupes'),
       ('Woflsbane', 'wolfsbane', 9000, 'motorcycles'),
       ('XLS', 'xls', 32000, 'suvs'),
       ('Yosemite', 'yosemite', 485000, 'muscle'),
       ('Youga', 'youga', 10800, 'vans'),
       ('Youga Luxuary', 'youga2', 14500, 'vans'),
       ('Z190', 'z190', 900000, 'sportsclassics'),
       ('Zentorno', 'zentorno', 1500000, 'super'),
       ('Zion', 'zion', 36000, 'coupes'),
       ('Zion Cabrio', 'zion2', 45000, 'coupes'),
       ('Zombie', 'zombiea', 9500, 'motorcycles'),
       ('Zombie Luxuary', 'zombieb', 12000, 'motorcycles'),
       ('Z-Type', 'ztype', 220000, 'sportsclassics');
CREATE TABLE IF NOT EXISTS `vehicle_categories`
(
    `name`  varchar(60) NOT NULL,
    `label` varchar(60) NOT NULL,
    PRIMARY KEY (`name`)
);

INSERT INTO `vehicle_categories` (`name`, `label`)
VALUES ('compacts', 'Compacts'),
       ('coupes', 'Coupés'),
       ('motorcycles', 'Motos'),
       ('muscle', 'Muscle'),
       ('offroad', 'Off Road'),
       ('sedans', 'Sedans'),
       ('sports', 'Sports'),
       ('sportsclassics', 'Sports Classics'),
       ('super', 'Super'),
       ('suvs', 'SUVs'),
       ('vans', 'Vans');

CREATE TABLE IF NOT EXISTS `vehicle_sold`
(
    `client` varchar(50) NOT NULL,
    `model`  varchar(50) NOT NULL,
    `plate`  varchar(50) NOT NULL,
    `soldby` varchar(50) NOT NULL,
    `date`   varchar(50) NOT NULL,
    PRIMARY KEY (`plate`)
);

CREATE TABLE IF NOT EXISTS `weashops`
(
    `id`    int(11)      NOT NULL AUTO_INCREMENT,
    `zone`  varchar(255) NOT NULL,
    `item`  varchar(255) NOT NULL,
    `price` int(11)      NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `weashops` (`id`, `zone`, `item`, `price`)
VALUES (1, 'GunShop', 'WEAPON_PISTOL', 300),
       (2, 'BlackWeashop', 'WEAPON_PISTOL', 500),
       (3, 'GunShop', 'WEAPON_FLASHLIGHT', 60),
       (4, 'BlackWeashop', 'WEAPON_FLASHLIGHT', 70),
       (5, 'GunShop', 'WEAPON_MACHETE', 90),
       (6, 'BlackWeashop', 'WEAPON_MACHETE', 110),
       (7, 'GunShop', 'WEAPON_NIGHTSTICK', 150),
       (8, 'BlackWeashop', 'WEAPON_NIGHTSTICK', 150),
       (9, 'GunShop', 'WEAPON_BAT', 100),
       (10, 'BlackWeashop', 'WEAPON_BAT', 100),
       (11, 'GunShop', 'WEAPON_STUNGUN', 50),
       (12, 'BlackWeashop', 'WEAPON_STUNGUN', 50),
       (13, 'GunShop', 'WEAPON_MICROSMG', 1400),
       (14, 'BlackWeashop', 'WEAPON_MICROSMG', 1700),
       (15, 'GunShop', 'WEAPON_PUMPSHOTGUN', 3400),
       (16, 'BlackWeashop', 'WEAPON_PUMPSHOTGUN', 3500),
       (17, 'GunShop', 'WEAPON_ASSAULTRIFLE', 10000),
       (18, 'BlackWeashop', 'WEAPON_ASSAULTRIFLE', 11000),
       (19, 'GunShop', 'WEAPON_SPECIALCARBINE', 15000),
       (20, 'BlackWeashop', 'WEAPON_SPECIALCARBINE', 16500),
       (21, 'GunShop', 'WEAPON_SNIPERRIFLE', 22000),
       (22, 'BlackWeashop', 'WEAPON_SNIPERRIFLE', 24000),
       (23, 'GunShop', 'WEAPON_FIREWORK', 18000),
       (24, 'BlackWeashop', 'WEAPON_FIREWORK', 20000),
       (25, 'GunShop', 'WEAPON_GRENADE', 500),
       (26, 'BlackWeashop', 'WEAPON_GRENADE', 650),
       (27, 'GunShop', 'WEAPON_BZGAS', 200),
       (28, 'BlackWeashop', 'WEAPON_BZGAS', 350),
       (29, 'GunShop', 'WEAPON_FIREEXTINGUISHER', 100),
       (30, 'BlackWeashop', 'WEAPON_FIREEXTINGUISHER', 100),
       (31, 'GunShop', 'WEAPON_BALL', 50),
       (32, 'BlackWeashop', 'WEAPON_BALL', 50),
       (33, 'GunShop', 'WEAPON_SMOKEGRENADE', 100),
       (34, 'BlackWeashop', 'WEAPON_SMOKEGRENADE', 100),
       (35, 'BlackWeashop', 'WEAPON_APPISTOL', 1100),
       (36, 'BlackWeashop', 'WEAPON_CARBINERIFLE', 12000),
       (37, 'BlackWeashop', 'WEAPON_HEAVYSNIPER', 30000),
       (38, 'BlackWeashop', 'WEAPON_MINIGUN', 45000),
       (39, 'BlackWeashop', 'WEAPON_RAILGUN', 50000),
       (40, 'BlackWeashop', 'WEAPON_STICKYBOMB', 500);
