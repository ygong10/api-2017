var Request = require('./Request');

var bodyRequired = ['name', 'short_name', 'qr_code',
		    'description', 'start_time', 'end_time'];

var bodyValidations = {
	'short_name'    : ['string', 'maxLength:25'],
        'name'		: ['string', 'maxLength:255'],
        'qr_code'	: ['natural'],
        'description'	: ['string', 'maxLength:2047'],
        'start_time'    : ['number'],
        'end_time'      : ['number']
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
