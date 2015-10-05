function Vector3D(...args) {
	this.x = null;
	this.y = null;
	this.z = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [from, to] = args;
				this.x = to.x - from.x;
				this.y = to.y - from.y;
				this.z = to.z - from.z;
			})(...args);
		case 1:
			return ((...args) => {
				let [v] = args;
				this.x = v.x;
				this.y = v.y;
				this.z = v.z;
			})(...args);
		case 3:
			return ((...args) => {
				let [x, y, z] = args;
				this.x = x;
				this.y = y;
				this.z = z;
			})(...args);
	}
}
module.exports = Vector3D
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
Vector3D.prototype.dot = function (v) {
	return this.x * v.x + this.y * v.y + this.z * v.z;
};
Vector3D.prototype.getZ = function () {
	return this.z;
};
Vector3D.prototype.normalize = function () {
	var length = this.length();
	if (length > 0.0) return this.divide(this.length());
	return Vector3D.create(0.0, 0.0, 0.0);
};
Vector3D.prototype.divide = function (d) {
	return Vector3D.create(this.x / d, this.y / d, this.z / d);
};
Vector3D.prototype.getX = function () {
	return this.x;
};
Vector3D.prototype.toString = function () {
	return "[" + this.x + ", " + this.y + ", " + this.z + "]";
};
Vector3D.prototype.length = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
Vector3D.prototype.getY = function () {
	return this.y;
};
Vector3D.length = function (v) {
	return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};
Vector3D.dot = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [v1, v2] = args;
				return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
			})(...args);
		case 4:
			return ((...args) => {
				let [A, B, C, D] = args;
				var ABx = B.x - A.x;
				var ABy = B.y - A.y;
				var ABz = B.z - A.z;
				var CDx = D.x - C.x;
				var CDy = D.y - C.y;
				var CDz = D.z - C.z;
				return ABx * CDx + ABy * CDy + ABz * CDz;
			})(...args);
	}
};
Vector3D.normalize = function (v) {
	var len = Vector3D.length(v);
	return new Coordinate(v.x / len, v.y / len, v.z / len);
};
Vector3D.create = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [coord] = args;
				return new Vector3D(coord);
			})(...args);
		case 3:
			return ((...args) => {
				let [x, y, z] = args;
				return new Vector3D(x, y, z);
			})(...args);
	}
};
