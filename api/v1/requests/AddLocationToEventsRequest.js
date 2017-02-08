var Request = require('./Request');

var bodyRequired = ['event_ids', 'location_id'];
var bodyValidations = {
        'event_ids'     : ['array'],
        'location_id'   : ['number']
};

function AddLocationToEventsRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
}

AddLocationToEventsRequest.prototype = Object.create(Request.prototype);
AddLocationToEventsRequest.prototype.constructor = AddLocationToEventsRequest;

module.exports = AddLocationToEventsRequest;
