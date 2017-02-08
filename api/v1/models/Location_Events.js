/* jshint version 8 */
var _Promise = require('bluebird');
var bcrypt = _Promise.promisifyAll(require('bcrypt'));
var _ = require('lodash');

var Model = require('./Model');

var Location_Events = Model.extend({
        tableName: 'location-events',
        idAttribute: 'id',
        validations: {
                event_id: ['required', 'natural'],
                location_id: ['required', 'natural']
        }
});


Location_Events.addRecords = function (locations, events) {
        var records = new Array(locations.length*events.length);

        for (var i = 0; i < locations.length; i++) {
                for (var j = 0; j < events.length; j++) {
                        records[i*events.length+j] = {
                                event_id: events[j],
                                location_id: locations[i]
                        };
                }
        }

	console.log(records);

        return Location_Events.transaction(function (t) {
                return _Promise.map(records, function(model) {
                        return Location_Events.forge(model).save(null, t);
                });
        });
};

Location_Events.getEventsFromLocationId = function (location_id) {
        return Location_Events
		.where({ location_id: location_id })
                .fetchAll();
};

Location_Events.getLocationsFromEventId = function (event_id) {
        return Location_Events
		.where({ event_id: event_id })
                .fetchAll();
};

module.exports = Location_Events;
