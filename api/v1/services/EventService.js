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
 * @param  {Event}          event           An Event object, with locations having an array of
 *                                          location objects or an `id` with an existing location.
 */
module.exports.createEvent = function (event) {
        var event_obj = null;
        var location_objs = null;
        return Event.create(event)
                .then(function(result) {
                        event_obj = result;
                        return _Promise.map(event.locations, function(location) {
                                return Location.addLocation(location);
                        });
                })
                .then(function (result) {
                        for (var i = 0; i < result.length; i++) {
                                result.validate();
                        }
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

module.exports.createLocation = function (id, name, short_name, latitude, longitude) {
        return Location.addLocation(id, name, short_name, latitude, longitude)
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