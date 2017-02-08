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
        if (!req.query.last_updated) {
                return services.EventService.findByUpdated(0)
                        .then(function(result) {
                                res.body = result.length == 0 ? [] : result.toJSON();
                                next();
                                return null;
                        });
        }
        return services.EventService.findByUpdated(req.query.last_updated)
                .then(function(result) {
                        res.body = result.length == 0 ? [] : result.toJSON();
                        next();
                        return null;
                });
}

function createEvent(req, res, next) {
        return services.EventService.createEvent(req.body.name,
                                                 req.body.description,
                                                 req.body.qr_code,
                                                 req.body.time,
                                                 req.body.locations)
                .then(function(result) {
                        res.body = result.toJSON();
                        next();
                        return null;
                });
}

function createLocation(req, res, next) {
        return services.EventService.createLocation(req.body.name,
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


router.use(bodyParser.json());

router.get('/', getEvents);
router.get('/locations', getLocations);
router.post('/create', middleware.auth,
            middleware.permission(roles.ORGANIZERS), // Change to SUPERUSER?
            middleware.request(requests.EventCreationRequest),
            createEvent);
router.post('/location', middleware.auth,
            middleware.permission(roles.ORGANIZERS), // Change to SUPERUSER?
            middleware.request(requests.LocationCreationRequest),
            createLocation);

// router.post('/', middleware.request(requests.BasicAuthRequest), createUser);
// router.post('/accredited', middleware.request(requests.AccreditedUserCreationRequest),
//      middleware.permission(roles.ORGANIZERS), createAccreditedUser);
// router.post('/reset', middleware.request(requests.ResetTokenRequest), requestPasswordReset);
// router.get('/:id', middleware.permission(roles.ORGANIZERS, isRequester), getUser);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.getEvents = getEvents;
module.exports.router = router;
