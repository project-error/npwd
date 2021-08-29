# DEFAULT ESX USER TABLE FOR TIE IN WITH IDENTS
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
    PRIMARY KEY (`identifier`) USING BTREE,
    UNIQUE KEY `identifier` (`identifier`)
)