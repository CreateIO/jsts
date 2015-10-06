var Collection = require('./Collection');
var IndexOutOfBoundsException = require('./IndexOutOfBoundsException');
var Iterator = require('./Iterator');
var List = require('./List');
var NoSuchElementException = require('./NoSuchElementException');
var OperationNotSupported = require('./OperationNotSupported');

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/ArrayList.html
 *
 * @extends List
 * @constructor
 */
var ArrayList = function() {
  /**
   * @type {Array}
   * @private
  */
  this.array_ = [];

  if (arguments[0] instanceof Collection) {
    this.addAll(arguments[0]);
  }
};
ArrayList.prototype = new List()


/**
 * @override
 */
ArrayList.prototype.add = function(e) {
  this.array_.push(e);
  return true;
};


/**
 * @override
 */
ArrayList.prototype.addAll = function(c) {
  for (var i = c.iterator(); i.hasNext();) {
    this.add(i.next());
  }
  return true;
};


/**
 * @override
 */
ArrayList.prototype.set = function(index, element) {
  var oldElement = this.array_[index];
  this.array_[index] = element;
  return oldElement;
};


/**
 * @override
 */
ArrayList.prototype.iterator = function() {
  return new Iterator_(this);
};


/**
 * @override
 */
ArrayList.prototype.get = function(index) {
  if (index < 0 || index >= this.size()) {
    throw new IndexOutOfBoundsException();
  }

  return this.array_[index];
};


/**
 * @override
 */
ArrayList.prototype.isEmpty = function() {
  return this.array_.length === 0;
};


/**
 * @override
 */
ArrayList.prototype.size = function() {
  return this.array_.length;
};


/**
 * @override
 */
ArrayList.prototype.toArray = function() {
  var array = [];

  for (var i = 0, len = this.array_.length; i < len; i++) {
    array.push(this.array_[i]);
  }

  return array;
};


/**
 * @override
 */
ArrayList.prototype.remove = function(o) {
  var found = false;

  for (var i = 0, len = this.array_.length; i < len; i++) {
    if (this.array_[i] === o) {
      this.array_.splice(i, 1);
      found = true;
      break;
    }
  }

  return found;
};



/**
 * @extends {Iterator}
 * @param {ArrayList} arrayList
 * @constructor
 * @private
 */
var Iterator_ = function(arrayList) {
  /**
   * @type {ArrayList}
   * @private
  */
  this.arrayList_ = arrayList;
  /**
   * @type {number}
   * @private
  */
  this.position_ = 0;
};


/**
 * @override
 */
Iterator_.prototype.next = function() {
  if (this.position_ === this.arrayList_.size()) {
    throw new NoSuchElementException();
  }
  return this.arrayList_.get(this.position_++);
};


/**
 * @override
 */
Iterator_.prototype.hasNext = function() {
  if (this.position_ < this.arrayList_.size()) {
    return true;
  } else {
    return false;
  }
};

/**
 * TODO: should be in ListIterator
 * @override
 */
Iterator_.prototype.set = function(element) {
  return this.arrayList_.set(this.position_ - 1, element);
};


/**
 * @override
 */
Iterator_.prototype.remove = function() {
  throw new OperationNotSupported();
};

module.exports = ArrayList;
