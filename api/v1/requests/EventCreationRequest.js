var Request = require('./Request');
var eventTags = require('../utils/eventTags');

var bodyRequired = ['name', 'shortName', 'qrCode',
                    'description', 'startTime',
                    'endTime'];

var bodyValidations = {
        'shortName'   : ['string', 'maxLength:25'],
        'name'        : ['string', 'maxLength:255'],
        'qrCode'      : ['natural'],
        'description' : ['string', 'maxLength:2047'],
        'startTime'   : ['string'],
        'endTime'     : ['string'],
        'tag'         : ['string', eventTags.verifyTags]
};

var bodyAllowed = ['locations', 'tag'];

function EventCreationRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
        this.bodyAllowed = bodyAllowed;
}

EventCreationRequest.prototype = Object.create(Request.prototype);
EventCreationRequest.prototype.constructor = EventCreationRequest;

module.exports = EventCreationRequest;
