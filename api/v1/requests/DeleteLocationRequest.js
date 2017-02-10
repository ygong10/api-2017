var Request = require('./Request');

var bodyRequired = ['eventIds', 'locationIds'];
var bodyValidations = {
        'eventIds'     : ['array'],
        'locationIds'   : ['array']
};

function DeleteLocationRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyRequired = bodyRequired;
        this.bodyValidations = bodyValidations;
}

DeleteLocationRequest.prototype = Object.create(Request.prototype);
DeleteLocationRequest.prototype.constructor = DeleteLocationRequest;

module.exports = DeleteLocationRequest;
