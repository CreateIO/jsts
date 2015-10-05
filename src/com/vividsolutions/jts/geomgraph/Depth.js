function Depth() {
	this.depth = [];
	if (arguments.length === 0) return;
	for (var i = 0; i < 2; i++) {
		for (var j = 0; j < 3; j++) {
			this.depth[i][j] = Depth.NULL_VALUE;
		}
	}
}
module.exports = Depth
var Location = require('com/vividsolutions/jts/geom/Location');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
Depth.prototype.getDepth = function (geomIndex, posIndex) {
	return this.depth[geomIndex][posIndex];
};
Depth.prototype.setDepth = function (geomIndex, posIndex, depthValue) {
	this.depth[geomIndex][posIndex] = depthValue;
};
Depth.prototype.isNull = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geomIndex, posIndex] = args;
				return this.depth[geomIndex][posIndex] === Depth.NULL_VALUE;
			})(...args);
		case 1:
			return ((...args) => {
				let [geomIndex] = args;
				return this.depth[geomIndex][1] === Depth.NULL_VALUE;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				for (var i = 0; i < 2; i++) {
					for (var j = 0; j < 3; j++) {
						if (this.depth[i][j] !== Depth.NULL_VALUE) return false;
					}
				}
				return true;
			})(...args);
	}
};
Depth.prototype.normalize = function () {
	for (var i = 0; i < 2; i++) {
		if (!this.isNull(i)) {
			var minDepth = this.depth[i][1];
			if (this.depth[i][2] < minDepth) minDepth = this.depth[i][2];
			if (minDepth < 0) minDepth = 0;
			for (var j = 1; j < 3; j++) {
				var newValue = 0;
				if (this.depth[i][j] > minDepth) newValue = 1;
				this.depth[i][j] = newValue;
			}
		}
	}
};
Depth.prototype.getDelta = function (geomIndex) {
	return this.depth[geomIndex][Position.RIGHT] - this.depth[geomIndex][Position.LEFT];
};
Depth.prototype.getLocation = function (geomIndex, posIndex) {
	if (this.depth[geomIndex][posIndex] <= 0) return Location.EXTERIOR;
	return Location.INTERIOR;
};
Depth.prototype.toString = function () {
	return "A: " + this.depth[0][1] + "," + this.depth[0][2] + " B: " + this.depth[1][1] + "," + this.depth[1][2];
};
Depth.prototype.add = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [lbl] = args;
				for (var i = 0; i < 2; i++) {
					for (var j = 1; j < 3; j++) {
						var loc = lbl.getLocation(i, j);
						if (loc === Location.EXTERIOR || loc === Location.INTERIOR) {
							if (this.isNull(i, j)) {
								this.depth[i][j] = Depth.depthAtLocation(loc);
							} else this.depth[i][j] += Depth.depthAtLocation(loc);
						}
					}
				}
			})(...args);
		case 3:
			return ((...args) => {
				let [geomIndex, posIndex, location] = args;
				if (location === Location.INTERIOR) this.depth[geomIndex][posIndex]++;
			})(...args);
	}
};
Depth.depthAtLocation = function (location) {
	if (location === Location.EXTERIOR) return 0;
	if (location === Location.INTERIOR) return 1;
	return Depth.NULL_VALUE;
};
Depth.NULL_VALUE = -1;
