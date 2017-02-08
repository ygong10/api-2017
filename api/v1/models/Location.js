/* jshint esversion 6 */
var _Promise = require('bluebird');
var _ = require('lodash');

var Model = require('./Model');
var Location_Events = require('./Location_Events');

var Location = Model.extend({
        tableName: 'locations',
        idAttribute: 'id',
        validations: {
                name: ['required', 'string', 'maxLength:25'],
                latitude: ['required', 'number'],
                longitude: ['required', 'number']
        },

        location_events: function () {
                return this.belongsToMany(Location_Events);
        }
});

/**
 * Adds locations to the specified event. If the role already exists, it is returned
 * unmodified
 * @param  {Event}       event       Event Object to add the event to
 * @param  {[Location]}  locations   Array of Location objects. Containing three parameters:
 name:      name of the location,
 latitude:  latitude of the location,
 longitude: longitude of the location,
 * @param {Transaction} t       pending transaction (optional)
 * @returns {Promise<Location>} the result of the addititon
 */
Location.addLocation = function(name, latitude, longitude) {
	console.log(name, latitude, longitude);
        var location = Location.forge({
                name: name,
                latitude: latitude,
                longitude: longitude
        });

	return _Promise.resolve(location);
};

/**
 * Finds a location by its ID.
 * @param  {Number|String} id   the ID of the model with the appropriate type
 * @return {Promise<Model>}             a Promise resolving to the resulting model or null
 */
Location.findById = function(id) {
        return Location.where({ id: id }).fetch();
};

/**
 * Finds a Location by its event ID.
 * @param  {Number|String} id   the ID of the model with the appropriate type
 * @return {Promise<Model>}             a Promise resolving to the resulting model or null
 */
Location.findByEventId = function(id) {
        return Location.where({ event_id: id}).fetch();
};

module.exports = Location;
