var Request = require('./Request');

var bodyRequired = ['event_id', 'location_ids'];
var bodyValidations = {
        'event_id'     : ['number'],
        'location_ids'   : ['array']
};

function AddEventToLocationsRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
}

AddEventToLocationsRequest.prototype = Object.create(Request.prototype);
AddEventToLocationsRequest.prototype.constructor = AddEventToLocationsRequest;

module.exports = AddEventToLocationsRequest;
