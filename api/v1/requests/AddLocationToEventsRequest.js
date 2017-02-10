var Request = require('./Request');

var bodyRequired = ['eventIds', 'locationId'];
var bodyValidations = {
        'eventIds'     : ['array'],
        'locationId'   : ['number']
};

function AddLocationToEventsRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
}

AddLocationToEventsRequest.prototype = Object.create(Request.prototype);
AddLocationToEventsRequest.prototype.constructor = AddLocationToEventsRequest;

module.exports = AddLocationToEventsRequest;
