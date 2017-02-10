var Checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');

var Event = require('../models/Event');
var Location = require('../models/Location');
var LocationEvents = require('../models/LocationEvents');

var errors = require('../errors');
var utils = require('../utils');

/**
 * Creates a new event and locations with the specified parameters. Validation is performed on-save only
 * @param  {String}         name            The event's name
 * @param  {String}         short_name            The event's name
 * @param  {String}         description     The event's description
 * @param  {Number|Boolean} qr_code         Whether the event needs a QR code or not
 * @param  {Number}         start_time      Time at which the event starts
 * @param  {Number}         end_time        Time at which the event ends
 * @param  {String}         eventTag        Array of Location objects, or id referencing them.
 * @param  {[Object]}       locations       Array of Location objects, or id referencing them.
 *                                          Location object containing three parameters:
 *                                              name:      name of the location,
 *                                              latitude:  latitude of the location,
 *                                              longitude: longitude of the location
 *                                          Otherwise, we expect just an id.
 */
module.exports.createEvent = function (name, short_name,
                                       description, qr_code,
                                       start_time, end_time,
                                       tag, locations) {
        var event_obj = null;
        return Event.create(name, short_name,
                            description, qr_code,
                            start_time, end_time, tag, locations)
                .then(function(result) {
                        event_obj = result;
                        return _Promise.map(locations, function(location) {
                                return Location.addLocation(location.id,
                                                            location.name,
                                                            location.shortName,
                                                            location.latitude,
                                                            location.longitude);
                        });
                })
                .then(function (result) {
                        event_obj.attributes.locations = result;
                        return LocationEvents.addRecordModels(result || [], [event_obj]);
                })
                .then(function (result) {
                        return event_obj;
                });
};

function appendEvent(location) {
        return LocationEvents.getEventsFromLocationId(location.getEvents('id'))
                .then(function(result) {
                        return _Promise.map(result.models, function(mapModel) {
                                return Event.findById(mapModel.get('eventId'));
                        });
                });
}

function appendLocation(event) {
        return LocationEvents.getLocationsFromEventId(event.get('id'))
                .then(function (result) {
                        return _Promise.map(result.models, function(mapModel) {
                                return Location.findById(mapModel.get('locationId'));
                        })
                                .then(function(locations) {
                                        event.attributes.locations = locations;
                                        return event;
                                });
                });
}

/**
 * Find event and corresponding locations.
 */
module.exports.findEventById = function (id) {
        return Event.findById(id)
                .then(function (result) {
                        if (_.isNull(result)) {
                                var message = "The Event with the given ID could not be found.";
                                var source = "id";
                                throw new errors.NotFoundError(message, id);
                        }

                        result.attributes.locations = [];
                        return appendLocation(result);
                });
};

module.exports.findLocationById = function(id) {
        return Location.findById(id)
                .then(function (result) {
                        if (_.isNull(result)) {
                                var message = "The Event with the given ID could not be found.";
                                var source = "id";
                                throw new errors.NotFoundError(message, id);
                        }

                        result.attributes.events = [];
                        return appendEvent(result);
                });
};

module.exports.findByUpdated = function (unix_timestamp) {
        return Event.findByUpdated(unix_timestamp)
                .then(function (events) {
                        return _Promise.map(events.models, function(event) {
                                event.attributes.locations = [];
                                return appendLocation(event);
                        });
                });
};

module.exports.createLocation = function (name, short_name, latitude, longitude) {
        return Location.addLocation(name, short_name, latitude, longitude)
                .then(function (result) {
                        return result.save();
                });
};

module.exports.getLocations = function () {
        return Location.fetchAll();
};

module.exports.addLocationToEvents = function (event_ids, location_id) {
        return LocationEvents.addRecords([location_id], event_ids)
                .catch(function(err) {
                        return _Promise.reject(err);
                });
};

module.exports.addEventToLocations = function (event_id, location_ids) {
        return LocationEvents.addRecords(location_ids, [event_id])
                .catch(function(err) {
                        return _Promise.reject(err);
                });
};

module.exports.deleteReference = function(event_ids, location_ids) {
        return LocationEvents.deleteEventReference(event_ids, location_ids);
};

module.exports.deleteEvents = function(event_id) {
        return LocationEvents.deleteEventReference([event_id])
                .then(function (result) {
                        return Event.where({ id: event_id }).destroy();
                });
};
