CREATE TABLE `location-events` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `event_id` INT UNSIGNED NOT NULL,
   `location_id` INT UNSIGNED NOT NULL,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
   FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`))
