var Request = require('./Request');

var bodyRequired = ['eventId', 'locationIds'];
var bodyValidations = {
        'eventId'     : ['number'],
        'locationIds'   : ['array', 'minLength:1']
};

function AddEventToLocationsRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
}

AddEventToLocationsRequest.prototype = Object.create(Request.prototype);
AddEventToLocationsRequest.prototype.constructor = AddEventToLocationsRequest;

module.exports = AddEventToLocationsRequest;
