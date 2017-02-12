/* jshint esversion 6 */
var _Promise = require('bluebird');
var _ = require('lodash');

var errors = require('../errors');

var Model = require('./Model');
var LocationEvents = require('./LocationEvents');

var Location = Model.extend({
        tableName: 'locations',
        idAttribute: 'id',
        validations: {
                name: ['required', 'string', 'maxLength:255'],
                shortName: ['required', 'string', 'maxLength:25'],
                latitude: ['required', 'number'],
                longitude: ['required', 'number']
        },

        locationEvents: function () {
                return this.belongsToMany(LocationEvents);
        }
});

/**
 * Adds locations to the specified event. If the role already exists, it is returned
 * unmodified
 * @param  {id}          id          Event id. If undefined, the event will be created
 * @param  {Event}       event       Event Object to add the event to
 * @param  {Location}    location    Location object. Containing three parameters:
 *                                            name:      name of the location,
 *                                            latitude:  latitude of the location,
 *                                            longitude: longitude of the location,
 * @throws NotFoundError             When and id that is not found is requested.
 * @returns {Promise<Location>} the result of the addititon
 */
Location.addLocation = function(location) {
        if (location.id) {
                return Location.findById(location.id)
                        .then(function(result) {
                                if (_.isNull(result)) {
                                        var message = "Location with the specified id " +
                                            location.id + " cannot be found";
                                        var source = "id";
                                        throw new errors.NotFoundError(message, source);
                                }

                                return result;
                        });
        }

        return Location.forge({
                name: location.name,
                shortName: location.shortName,
                latitude: location.latitude,
                longitude: location.longitude
        }).save();

};

/**
 * Finds a location by its ID.
 * @param  {Number|String} id   the ID of the model with the appropriate type
 * @return {Promise<Model>}             a Promise resolving to the resulting model or null
 */
Location.findById = function(id) {
        return Location.where({ id: id }).fetch();
};

module.exports = Location;
