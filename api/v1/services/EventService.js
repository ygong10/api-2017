var Checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');

var Event = require('../models/Event');
var Location = require('../models/Location');
var Location_Events = require('../models/Location_Events');

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
 * @param  {[Location]}     locations       Array of Location objects. Containing three parameters:
 *                                              name:      name of the location,
 *                                              latitude:  latitude of the location,
 *                                              longitude: longitude of the location
 */
module.exports.createEvent = function (name, short_name,
                                       description, qr_code,
                                       start_time, end_time, locations) {
        var event_obj = null;
        return Event.create(name, short_name,
                            description, qr_code,
                            start_time, end_time, locations)
                .then(function(result) {
                        event_obj = result;
                        return _Promise.map(locations, function(location) {
                                return Location.addLocation(location.name,
                                                            location.short_name,
                                                            location.latitude,
                                                            location.longitude);
                        });
                })
                .then(function (result) {
                        event_obj.attributes.locations = result;
                        return Location_Events.addRecordModels(result || [], [event_obj]);
                })
                .then(function (result) {
                        return event_obj;
                });
};

function appendLocation(event) {
        return Location_Events.getLocationsFromEventId(event.get('id'))
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

module.exports.findByUpdated = function (unix_timestamp) {
        console.log(unix_timestamp);
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
        return Location_Events.addRecords([location_id], event_ids)
                .then(function (result) {
                        return _Promise.map(event_ids, function (event_id) {
                                return Event.where({ id: event_id }).fetch();
                        });
                });
};

module.exports.addEventToLocations = function (event_id, location_ids) {
        return Location_Event.addRecords([event_id], location_ids)
                .then(function (result) {
                        return _Promise.map(location_ids, function (location_id) {
                                return Location.where({ id: location_id }).fetch();
                        });
                });
};
