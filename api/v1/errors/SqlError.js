function checkError(err) {
        if (!err) return false;
        var re = /ER_DUP_ENTRY|ER_NO_REFERENCED_ROW/;
        return re.test(err.message);
};


var UnprocessableRequestError = require('./UnprocessableRequestError.js');

var ERROR_TYPE = 'SqlError';
var ERROR_TITLE = 'Invalid Request';

var DEFAULT_MESSAGE = "MySQL Returned an error";

function SqlError(message, source) {
	UnprocessableRequestError.call(this, message, source);

	this.type = ERROR_TYPE;
	this.title = ERROR_TITLE;
	this.message = (message) ? message : DEFAULT_MESSAGE;
	this.source = (source) ? source : null;
}

SqlError.prototype = Object.create(UnprocessableRequestError.prototype);
SqlError.prototype.constructor = SqlError;

module.exports = SqlError;
module.exports.checkError = checkError;
