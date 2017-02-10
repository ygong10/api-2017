var Request = require('./Request');

var bodyValidations = {
        'eventIds'     : ['array'],
        'locationIds'   : ['array']
};

var bodyAllowed = ['eventIds', 'locationIds'];

function DeleteReferenceRequest(headers, body) {
        Request.call(this, headers, body);

        this.bodyValidations = bodyValidations;
        this.bodyAllowed = bodyAllowed;
}

DeleteReferenceRequest.prototype = Object.create(Request.prototype);
DeleteReferenceRequest.prototype.constructor = DeleteReferenceRequest;

module.exports = DeleteReferenceRequest;
