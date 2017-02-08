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
                                event_id: events[j].get('id'),
                                location_id: locations[i].get('id')
                        };
                }
        }

        return Location_Events.transaction(function (t) {
                return _Promise.map(records, function(model) {
                        return Location_Events.forge(model).save(null, t);
                });
        });
};

Location_Events.getEventsFromLocation = function (location) {
        return Location_Events.where({ location_id: location.get('id') })
                .fetchAll()
                .then(function (results) {
                        console.log(results);
                        return results;
                });
};

Location_Events.getLocationsFromEvent = function (event) {
        return Location_Events.where({ location_id: event.get('id') })
                .fetchAll()
                .then(function (results) {
                        console.log(results);
                        return results;
                });
};

module.exports = Location_Events;
