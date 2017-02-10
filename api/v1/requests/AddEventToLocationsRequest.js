var Request = require('./Request');

var bodyRequired = ['eventIds', 'locationIds'];
var bodyValidations = {
        'eventId'     : ['array'],
        'locationIds'   : ['array']
};

function AddEventToLocationsRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
}

AddEventToLocationsRequest.prototype = Object.create(Request.prototype);
AddEventToLocationsRequest.prototype.constructor = AddEventToLocationsRequest;

module.exports = AddEventToLocationsRequest;
