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
 * Finds all events that have been updated since the given timestamp.
 * @param {Date}        dateObj       the timestamp to fetch from
 * @return {Promise<Model>}           a Promise resolving to models since the timestamps
 */
Event.findByUpdated = function(dateObj) {
        return Event.where('updated', '>=', dateObj)
		.fetchAll();
};

module.exports = Event;
