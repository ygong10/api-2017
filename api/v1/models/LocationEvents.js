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
