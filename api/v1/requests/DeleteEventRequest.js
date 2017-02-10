var Request = require('./Request');

var bodyRequired = ['eventId'];
var bodyValidations = {
        'eventId'     : ['number']
};

function DeleteEventRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
}

DeleteEventRequest.prototype = Object.create(Request.prototype);
DeleteEventRequest.prototype.constructor = DeleteEventRequest;

module.exports = DeleteEventRequest;
