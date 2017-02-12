var Request = require('./Request');
var eventTags = require('../utils/eventTags');

var bodyRequired = ['name', 'shortName', 'tracking',
                    'description', 'startTime',
                    'endTime', 'tag'];

var bodyValidations = {
        'shortName'   : ['string', 'maxLength:25'],
        'name'        : ['string', 'maxLength:255'],
        'tracking'      : ['natural'],
        'description' : ['string', 'maxLength:2047'],
        'startTime'   : ['string'],
        'endTime'     : ['string'],
        'tag'         : ['string', eventTags.verifyTags]
};

var bodyAllowed = ['locations'];

function EventCreationRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
        this.bodyAllowed = bodyAllowed;
}

EventCreationRequest.prototype = Object.create(Request.prototype);
EventCreationRequest.prototype.constructor = EventCreationRequest;

module.exports = EventCreationRequest;
