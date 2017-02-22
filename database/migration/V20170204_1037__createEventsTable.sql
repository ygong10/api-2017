CREATE TABLE `events` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `name` VARCHAR(255) NOT NULL,
   `short_name` VARCHAR(25) NOT NULL,
   `tracking` BOOLEAN NOT NULL,
   `description` VARCHAR(2047) NOT NULL,
   `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
   `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `start_time` DATETIME NOT NULL,
   `end_time` DATETIME NOT NULL,
   `tag` ENUM('HACKATHON', 'SCHEDULE') NOT NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `locations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `short_name` VARCHAR(25) NOT NULL,
  `longitude` DOUBLE NOT NULL,
  `latitude` DOUBLE NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `location_events` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `event_id` INT UNSIGNED NOT NULL,
   `location_id` INT UNSIGNED NOT NULL,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
   FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`),
   UNIQUE KEY (`event_id`, `location_id`)
);