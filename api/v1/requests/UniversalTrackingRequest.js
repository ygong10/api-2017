var Request = require('./Request');

var bodyRequired = ['name', 'duration'];
var bodyValidations = {
    'name': ['required', 'string', 'maxLength:255'],
    'duration': ['required', 'naturalNonZero']
};

function UniversalTrackingRequest(headers, body) {
    Request.call(this, headers, body);

    this.bodyRequired = bodyRequired;
    this.bodyValidations = bodyValidations;
}

UniversalTrackingRequest.prototype = Object.create(Request.prototype);
UniversalTrackingRequest.prototype.constructor = UniversalTrackingRequest;

module.exports = UniversalTrackingRequest;
