var Request = require('./Request');

var bodyRequired = ['time', 'name', 'qr_code', 'description'];
var bodyValidations = {
        'time'		: ['number'],
        'name'		: ['string', 'maxLength:25'],
        'qr_code'	: ['natural'],
        'description'	: ['string', 'maxLength:2048']
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
