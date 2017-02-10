var _ = require('lodash');

var ALL_TAGS = ['HACKATHON', 'SCHEDULE'];

_.forEach(ALL_TAGS, function (tag) {
	module.exports[tag] = tag;
});


/**
 * Determines whether or not a given tag is in a certain tag group
 * @param  {Array}  group  a group of tags
 * @param  {String}  tag   a tag to verify
 * @return {Boolean}       whether or not the tag is in the given group
 */
module.exports.isIn = function (group, tag) {
	return _.includes(group, tag);
}
/**
 * Ensures that the provided tag is in ALL_TAGS
 * @param  {String} role the value to check
 * @return {Boolean} true when the tag is valid
 * @throws TypeError when the tag is invalid
 */
module.exports.verifyTags = function (tag) {
	if (!module.exports.isIn(ALL_TAGS, tag)) {
		throw new TypeError(tag + " is not a valid role");
	}

	return true;
};
