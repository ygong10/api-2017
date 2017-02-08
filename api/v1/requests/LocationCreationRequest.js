var Request = require('./Request');

var bodyRequired = ['name', 'latitude', 'longitude'];
var bodyValidations = {
        'name'          : ['string', 'maxLength:25'],
        'latitude'      : ['numeric'],
        'longitude'     : ['numeric']
};


function LocationCreationRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
}

LocationCreationRequest.prototype = Object.create(Request.prototype);
LocationCreationRequest.prototype.constructor = LocationCreationRequest;

module.exports = LocationCreationRequest;
