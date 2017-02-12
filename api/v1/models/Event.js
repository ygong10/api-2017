/* jshint esversion 6 */
var _Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');

var Model = require('./Model');
var LocationEvents = require('./LocationEvents');

var eventTags = require('../utils/eventTags.js');

var Event = Model.extend({
        tableName: 'events',
        idAttribute: 'id',
        hasTimestamps: ['created', 'updated'],
        validations: {
                name: ['required', 'string', 'maxLength:255'],
                shortName: ['required', 'string', 'maxLength:25'],
                description: ['required', 'string', 'maxLength:2047'],
                tracking: ['required', 'boolean'],
                startTime: ['required', 'date'],
                endTime: ['required', 'date'],
                tag: ['required', 'string', eventTags.verifyTags]
        },

        locationEvents: function () {
                return this.belongsToMany(LocationEvents);
        }
});

/**
 * Finds a event by its ID, joining in its related roles
 * @param  {Number|String} id   the ID of the model with the appropriate type
 * @return {Promise<Model>}     a Promise resolving to the resulting model or null
 */
Event.findById = function(id) {
        return Event.where({ id: id }).fetch();
};


/**
 * Finds all events that have been updated since the given timestamp.
 * @param {Date}        dateObj       the timestamp to fetch from
 * @return {Promise<Model>}           a Promise resolving to models since the timestamps
 */
Event.findByUpdated = function(dateObj) {
        return Event.where('updated', '>=', dateObj)
		.fetchAll();
};

/**
 * Creates a new event and locations with the specified parameters. Validation is performed on-save only
 * @param {event_req} Event request parameter.
 */
Event.create = function (event_req) {
        var event = Event.forge({
                name: event_req.name,
		shortName: event_req.shortName,
                description: event_req.description,
                tracking: event_req.tracking != 0,
		startTime: event_req.startTime,
		endTime: event_req.endTime,
                tag: event_req.tag
        });

        return event.save();
};

module.exports = Event;
