var bodyParser = require('body-parser');
var _Promise = require('bluebird');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');
var mail = require('../utils/mail');

var router = require('express').Router();

function _isAuthenticated (req) {
    return req.auth && (req.user !== undefined);
}

function _removeFromList(rsvpCurrent, rsvpNew) {
    return rsvpCurrent.get('isAttending') && !rsvpNew.isAttending;
}

function _addToList(rsvpCurrent, rsvpNew) {
    return !rsvpCurrent.get('isAttending') && rsvpNew.isAttending;
}

function createRSVP(req, res, next) {
    if(!req.body.isAttending)
        delete req.body.type;

    services.RegistrationService
        .findAttendeeByUser(req.user)
        .then(function(attendee) {
           return services.RSVPService
                .createRSVP(attendee, req.user, req.body);
        })
        .then(function(rsvp) {
            if(rsvp.get('isAttending'))
                services.MailService.addToList(req.user, mail.lists.attendees);
            res.body = rsvp.toJSON();

            return next();
        })
        .catch(function(error) {
            return next(error);
        });
}

function fetchRSVPByUser(req, res, next) {
    services.RegistrationService
        .findAttendeeByUser(req.user)
        .then(function(attendee) {
            return services.RSVPService
                .findRSVPByAttendee(attendee);
        })
        .then(function (rsvp) {
            res.body = rsvp.toJSON();
            if(!res.body.type) {
                delete res.body.type;
            }

            return next();
        })
        .catch(function(error) {
            return next(error);
        })
}

function fetchRSVPById(req, res, next) {
    services.RSVPService
        .getRSVPById(req.params.id)
        .then(function(rsvp){
            res.body = rsvp.toJSON();
            if(!res.body.type) {
                delete res.body.type;
            }

            return next();
        })
        .catch(function(error) {
            return next(error);
        })
}

function updateRSVPByUser(req, res, next) {
    if(!req.body.isAttending)
        delete req.body.type;

    services.RegistrationService
        .findAttendeeByUser(req.user)
        .then(function(attendee) {
            return _updateRSVPByAttendee(req.user, attendee, req.body);
        })
        .then(function(rsvp){
            res.body = rsvp.toJSON();

            return next();
        })
        .catch(function (error) {
            return next(error);
        });
}

function _updateRSVPByAttendee(user, attendee, newRSVP) {
    return services.RSVPService
        .findRSVPByAttendee(attendee)
        .then(function (rsvp) {
            return services.RSVPService.updateRSVP(user, rsvp, newRSVP)
                .then(function (updatedRSVP) {
                    if(_addToList(rsvp, newRSVP))
                        services.MailService.addToList(user, mail.lists.attendees);
                    if(_removeFromList(rsvp, newRSVP))
                        services.MailService.removeFromList(user, mail.lists.attendees);

                    return updatedRSVP
                });
        });
}

router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/attendee', middleware.request(requests.RSVPRequest),
    middleware.permission(roles.ATTENDEE, _isAuthenticated), createRSVP);
router.get('/attendee/', middleware.permission(roles.ATTENDEE), fetchRSVPByUser);
router.get('/attendee/:id', middleware.permission(roles.ORGANIZERS), fetchRSVPById);
router.put('/attendee/', middleware.request(requests.RSVPRequest),
    middleware.permission(roles.ATTENDEE), updateRSVPByUser);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;