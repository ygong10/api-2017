var bodyParser = require('body-parser');
var _Promise = require('bluebird');

var errors = require('../errors');
var services = require('../services');
var config = require('../../config');

var middleware = require('../middleware');
var requests = require('../requests');
var utils = require('../utils');
var roles = require('../utils/roles');

var EventService = require('../services/EventService');

var logger = require('../../logging');

var router = require('express').Router();

function getEvents(req, res, next) {
        var updated = req.query.lastUpdated || 0;
        return services.EventService.findByUpdated(updated)
                .then(function(result) {
                        res.body = result.length == 0 ? [] : result.map(function (obj) {
                                return obj.toJSON();
                        });
                        next();
                        return null;
                });
}

function createEvent(req, res, next) {
        return services.EventService.createEvent(req.body.name,
                                                 req.body.shortName,
                                                 req.body.description,
                                                 req.body.qrCode,
                                                 req.body.startTime,
                                                 req.body.endTime,
                                                 req.body.tag || "SCHEDULE",
                                                 req.body.locations || [])
                .then(function(result) {
                        res.body = result.toJSON();
                        next();
                        return null;
                });
}

function createLocation(req, res, next) {
        return services.EventService.createLocation(req.body.name,
                                                    req.body.shortName,
                                                    req.body.latitude,
                                                    req.body.longitude)
                .then(function (result) {
                        res.body = result.length == 0 ? [] : result.toJSON();
                        next();
                        return null;
                });
}

function getLocations(req, res, next) {
        return services.EventService.getLocations()
                .then(function (result) {
                        res.body = result.length == 0 ? [] : result.toJSON();
                        next();
                        return null;
                });
}

function addLocationToEvents(req, res, next) {
        return services.EventService.addLocationToEvents(req.body.eventIds,
                                                         req.body.locationId)
                .then(function (result) {
                        return services.EventService.findEventById(req.body.eventId);
                })
                .then(function (event) {
                        res.body = event.toJSON();
                        next();
                        return null;
                })
                .catch(function (err) {
                        next(err);
                        return null;
                });
}

function addEventToLocations(req, res, next) {
        return services.EventService.addEventToLocations(req.body.eventId,
                                                         req.body.locationIds)
                .then(function (result) {
                        return services.EventService.findEventById(req.body.eventId);
                })
                .then(function (event) {
                        res.body = event.toJSON();
                        next();
                        return null;
                })
                .catch(function (err) {
                        next(err);
                        return null;
                });
}

function deleteReference(req, res, next) {
        return services.EventService.deleteReference(req.body.eventIds, req.body.locationIds)
                .then(function (result) {
                        next();
                        return null;
                });
}

function deleteEvent(req, res, next) {
        return services.EventService.deleteEvents(req.body.eventId)
                .then(function (result) {
                        next();
                        return null;
                });
}

router.use(bodyParser.json());

router.get('/', getEvents);
router.get('/locations', getLocations);
// change me to the non helper function verison
router.post('/create', middleware.auth,
            middleware.permission(roles.ORGANIZERS), // Change to SUPERUSER?
            middleware.request(requests.EventCreationRequest),
            createEvent);
router.post('/delete', middleware.auth,
            middleware.permission(roles.ORGANIZERS),
            middleware.request(requests.DeleteEventRequest),
            deleteEvent);
router.post('/deleteLocation', middleware.auth,
            middleware.permission(roles.ORGANIZERS),
            middleware.request(requests.DeleteLocationRequest),
            deleteReference);
router.post('/locations', middleware.auth,
            middleware.permission(roles.ORGANIZERS), // Change to SUPERUSER?
            middleware.request(requests.LocationCreationRequest),
            createLocation);
router.post('/addLocation', middleware.auth,
            middleware.permission(roles.ORGANIZERS), // Change to SUPERUSER?
            addEventToLocations);
router.post('/locations/addEvent', middleware.auth,
            middleware.permission(roles.ORGANIZERS), // Change to SUPERUSER?
            addLocationToEvents);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.getEvents = getEvents;
module.exports.router = router;
