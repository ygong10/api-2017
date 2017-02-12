/* jshint version 8 */
var _Promise = require('bluebird');
var _ = require('lodash');

var Model = require('./Model');
var errors = require('../errors');

var LocationEvents = Model.extend({
        tableName: 'location_events',
        idAttribute: 'id',
        validations: {
                eventId: ['required', 'natural'],
                locationId: ['required', 'natural']
        }
});

LocationEvents.deleteEventReference = function(events, locations) {
        if (!events && !locations) {
                return null;
        }

        if (!events || events.length == 0) {
                return _Promise.map(locations, function (location) {
                        return LocationEvents.where({ location_id: location }).destroy();
                });
        }

        if (!locations || locations.length == 0) {
                return _Promise.map(events, function (event) {
                        return LocationEvents.where({ event_id: event }).destroy();
                });
        }

        var records = new Array(locations.length*events.length);

        for (var i = 0; i < locations.length; i++) {
                for (var j = 0; j < events.length; j++) {
                        records[i*events.length+j] = {
                                event_id: events[j],
                                location_id: locations[i]
                        };
                }
        }

        return _Promise.map(records, function(record) {
                LocationEvents.where(record).destroy();
        });
};

LocationEvents.addRecords = function (locations, events) {
        var records = new Array(locations.length*events.length);

        for (var i = 0; i < locations.length; i++) {
                for (var j = 0; j < events.length; j++) {
                        records[i*events.length+j] = {
                                eventId: events[j],
                                locationId: locations[i]
                        };
                }
        }

        return LocationEvents.transaction(function (t) {
                return _Promise.map(records, function(model) {
                        return LocationEvents.forge(model).save(null, {transacting: t});
                });
        })
                .catch(errors.SqlError.checkError, function(err) {
                        var message = "Bad SQL Error. " ;
                        message +=  "Either there are duplicates, or requested id does not exist ";
                        message +=  "(" + err.code + ")";
                        return _Promise.reject(new errors.SqlError(message, err.code));
                });
};

LocationEvents.addRecordModels = function (locations, events) {
        var records = new Array(locations.length*events.length);

        for (var i = 0; i < locations.length; i++) {
                for (var j = 0; j < events.length; j++) {
                        records[i*events.length+j] = {
                                eventId: events[j].get('id'),
                                locationId: locations[i].get('id')
                        };
                }
        }

        return LocationEvents.transaction(function (t) {
                return _Promise.map(records, function(model) {
                        return LocationEvents.forge(model).save(null, {transacting: t});
                });
        });
};

LocationEvents.getEventsFromLocationId = function (locationId) {
        return LocationEvents
                .where({ location_id: locationId })
                .fetchAll();
};

LocationEvents.getLocationsFromEventId = function (eventId) {
        return LocationEvents
                .where({ event_id: eventId })
                .fetchAll();
};

module.exports = LocationEvents;
