var bodyParser = require('body-parser');
var _Promise = require('bluebird');
var config = require('../../config');
var errors = require('../errors');
var logger = require('../../logging');
var middleware = require('../middleware');
var services = require('../services');
var requests = require('../requests');
var router = require('express').Router();
var utils = require('../utils');


function getAllEvents(req, res, next) {
        var updated = req.query.lastUpdated || 0;
        return services.EventService.findByUpdated(updated)
                .then(function(result) {
                        res.body = result.toJSON();
                        next();
                        return null;
                })
                .catch(function(err) {
                        next(err);
                        return null;
                });
}

function createEvent(req, res, next) {
        req.body.tag = req.body.tag || "SCHEDULE";
        req.body.locations = req.body.locations || [];
        return services.EventService.createEvent(req.body)
                .then(function(result) {
                        res.body = result.toJSON();
                        next();
                        return null;
                })
                .catch(function(err) {
                        next(err);
                        return null;
                });
}

function createLocation(req, res, next) {
        return services.EventService.createLocation(null,
                                                    req.body.name,
                                                    req.body.shortName,
                                                    req.body.latitude,
                                                    req.body.longitude)
                .then(function (result) {
                        res.body = result.length == 0 ? [] : result.toJSON();
                        next();
                        return null;
                })
                .catch(function(err) {
                        next(err);
                        return null;
                });
}

function getLocations(req, res, next) {
        return services.EventService.getLocations()
                .then(function (result) {
                        res.body = result.length == 0 ? [] : result.toJSON();
                        next();
                        return null;
                })
                .catch(function(err) {
                        next(err);
                        return null;
                });
}

function addLocationToEvents(req, res, next) {
        return services.EventService.addLocationToEvents(req.body.eventIds,
                                                         req.body.locationId)
                .then(function (event) {
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

router.use(bodyParser.json());

router.get('/', getAllEvents);
router.get('/locations', getLocations);
router.post('/create', middleware.auth,
            middleware.permission(utils.roles.ORGANIZERS), // Change to SUPERUSER?
            middleware.request(requests.EventCreationRequest),
            createEvent);
router.post('/locations', middleware.auth,
            middleware.permission(utils.roles.ORGANIZERS), // Change to SUPERUSER?
            middleware.request(requests.LocationCreationRequest),
            createLocation);
router.post('/addLocation', middleware.auth,
            middleware.permission(utils.roles.ORGANIZERS), // Change to SUPERUSER?
            middleware.request(requests.AddEventToLocationsRequest), 
            addEventToLocations);
router.post('/locations/addEvent', middleware.auth,
            middleware.permission(utils.roles.ORGANIZERS), // Change to SUPERUSER?
            middleware.request(requests.addLocationToEvents),
            addLocationToEvents);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.getEvents = getEvents;
module.exports.router = router;
