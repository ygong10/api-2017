var Checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');

var Event = require('../models/Event');
var Location = require('../models/Location');
var Location_Event = require('../models/Location_Events');

var errors = require('../errors');
var utils = require('../utils');

/**
 * Creates a new event and locations with the specified parameters. Validation is performed on-save only
 * @param  {String}         name            The event's name
 * @param  {String}         description     The event's description
 * @param  {Number|Boolean} qr_code         Whether the event needs a QR code or not
 * @param  {Number}         time            Time at which the event takes place
 * @param  {[Location]}     locations       Array of Location objects. Containing three parameters:
 *                                              name:      name of the location,
 *                                              latitude:  latitude of the location,
 *                                              longitude: longitude of the location,
 */
module.exports.createEvent = function (name, description, qr_code, time, locations) {
        return Event.create(name, description, qr_code, time, locations)
                .then(function(result) {
                        return _Promise.resolve(result);
                });
};

module.exports.findByUpdated = function (unix_timestamp) {
        return Event.findByUpdated(unix_timestamp)
                .then(function(result) {
                        if (_.isNull(result)) {
                                return _Promise.resolve([]);
                        }
                        return _Promise.resolve(result);
                });
};

module.exports.createLocation = function (name, latitude, longitude) {
        return Location.addLocation(name, latitude, longitude)
                .then(function (result) {
                        return result.save();
                });
};

module.exports.getLocations = function () {
	return Location.fetchAll();
};

// /**
//  * Finds a user by querying for the given ID
//  * @param  {Number} id the ID to query
//  * @return {Promise} resolving to the associated User model
//  * @throws {NotFoundError} when the requested user cannot be found
//  */
// module.exports.findUserById = function (id) {
//      return User
//              .findById(id)
//              .then(function (result) {
//                      if (_.isNull(result)) {
//                              var message = "A user with the given ID cannot be found";
//                              var source = "id";
//                              throw new errors.NotFoundError(message, source);
//                      }

//                      return _Promise.resolve(result);
//              });
// };

// /**
//  * Finds a user by querying for the given email
//  * @param  {String} email the email to query
//  * @return {Promise} resolving to the associated User model
//  * @throws {NotFoundError} when the requested user cannot be found
//  */
// module.exports.findUserByEmail = function (email) {
//      return User
//              .findByEmail(email)
//              .then(function (result) {
//                      if (_.isNull(result)) {
//                              var message = "A user with the given email cannot be found";
//                              var source = "email";
//                              throw new errors.NotFoundError(message, source);
//                      }
//                      return _Promise.resolve(result);
//              });
// };

// /**
//  * Verifies that the provided password matches the user's password
//  * @param  {User} user a User model
//  * @param  {String} password the value to verify
//  * @return {Promise} resolving to the validity of the provided password
//  * @throws {InvalidParameterError} when the password is invalid
//  */
// module.exports.verifyPassword = function (user, password) {
//      return user
//              .hasPassword(password)
//              .then(function (result) {
//                      if (!result) {
//                              var message = "The provided password is incorrect";
//                              var source = "password";
//                              throw new errors.InvalidParameterError(message, source);
//                      }

//                      return _Promise.resolve(true);
//              });
// };

// /**
//  * Resets the user's password and saves it.
//  * @param  {User} user a User model
//  * @param  {String} password the password to change to
//  * @return {Promise} resolving to the new User model
//  */
// module.exports.resetPassword = function (user, password) {
//      return user
//              .setPassword(password)
//              .then(function (updated) {
//                      return updated.save();
//              });
// };
