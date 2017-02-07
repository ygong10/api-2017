CREATE TABLE `locations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(25) NOT NULL,
  `longitude` DOUBLE NOT NULL,
  `latitude` DOUBLE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_events_event_id_idx` (`event_id` ASC),
  CONSTRAINT `fk_event_event_id`
  	     FOREIGN KEY (`event_id`)
	     REFERENCES `events` (`id`)
	     ON DELETE NO ACTION
	     ON UPDATE NO ACTION)
