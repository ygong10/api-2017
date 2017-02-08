/* jshint esversion 6 */

var _Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');

var Model = require('./Model');
var Location_Events = require('./Location_Events');

var Event = Model.extend({
        tableName: 'events',
        idAttribute: 'id',
        hasTimestamps: ['created', 'updated'],
        validations: {
                name: ['required', 'string', 'maxLength:25'],
                time: ['required'],
                description: ['required', 'string'],
                qr_code: ['required', 'boolean']
        },

        location_events: function () {
                return this.belongsToMany(Location_Events);
        }
});

/**
 * Finds a event by its ID, joining in its related roles
 * @param  {Number|String} id   the ID of the model with the appropriate type
 * @return {Promise<Model>}     a Promise resolving to the resulting model or null
 */
Event.findById = function(id) {
        return Event.where({ id: id }).fetchAll({ withRelated: ['locations'] });
};


/**
 * Finds all events that have been updated since the given timestamp.
 * @param {Number} unix_timestamp     the timestamp to fetch from
 * @return {Promise<Model>}           a Promise resolving to models since the timestamps
 */
Event.findByUpdated = function(unix_timestamp) {
        return Event.where('updated', '>=', moment.unix(unix_timestamp).toDate())
                .fetchAll({ withRelated: ['locations'] });
};

/**
 * Creates a new event and locations with the specified parameters. Validation is performed on-save only
 * @param  {String}         name            The event's name
 * @param  {String}         description     The event's description
 * @param  {Number|Boolean} qr_code         Whether the event needs a QR code or not
 * @param  {Number}         time            Time at which the event takes place
 * @param  {[Location]}     locations       Array of Location objects. Containing three parameters:
 *                                                   name:      name of the location,
 *                                                   latitude:  latitude of the location,
 *                                                   longitude: longitude of the location,
 */
Event.create = function (name, description, qr_code, time, locations) {
        var event = Event.forge({
                name: name,
                description: description,
                qr_code: qr_code != 0,
                time: moment.unix(time).toDate()
        });

        if (!locations || locations.length == 0) {
                return event.save();
        }

	return event.save()
                .then(function(result) {
			event = result;
                        return Location.addLocations(event, locations);
                })
		.then(function (result) {
			return Event.findById(event.get('id'));
		});
};

Event.prototype.serialize = function () {
        return _.omit(this.attributes, ['created']);
};

module.exports = Event;
