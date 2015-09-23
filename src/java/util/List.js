var Collection = require('./Collection');


/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/List.html
 *
 * @extends {javascript.util.Collection}
 * @constructor
 */
var List = function() { };
List.prototype = new Collection();


/**
 * Returns the element at the specified position in this list.
 * @param {number} index
 * @return {Object}
 */
List.prototype.get = function() { };


/**
 * Replaces the element at the specified position in this list with the
 * specified element (optional operation).
 * @param {number} index
 * @param {Object} e
 * @return {Object}
 */
List.prototype.set = function() { };


/**
 * Returns true if this collection contains no elements.
 * @return {boolean}
 */
List.prototype.isEmpty = function() { };

module.exports = List;
