function RepeatedPointTester() {
	this.repeatedCoord = null;
	if (arguments.length === 0) return;
}
module.exports = RepeatedPointTester
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
RepeatedPointTester.prototype.getCoordinate = function () {
	return this.repeatedCoord;
};
RepeatedPointTester.prototype.hasRepeatedPoint = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [g] = args;
					if (g.isEmpty()) return false;
					if (g instanceof Point) return false; else if (g instanceof MultiPoint) return false; else if (g instanceof LineString) return this.hasRepeatedPoint(g.getCoordinates()); else if (g instanceof Polygon) return this.hasRepeatedPoint(g); else if (g instanceof GeometryCollection) return this.hasRepeatedPoint(g); else throw new UnsupportedOperationException(g.getClass().getName());
				})(...args);
			} else if (args[0] instanceof Array) {
				return ((...args) => {
					let [coord] = args;
					for (var i = 1; i < coord.length; i++) {
						if (coord[i - 1].equals(coord[i])) {
							this.repeatedCoord = coord[i];
							return true;
						}
					}
					return false;
				})(...args);
			} else if (args[0] instanceof Polygon) {
				return ((...args) => {
					let [p] = args;
					if (this.hasRepeatedPoint(p.getExteriorRing().getCoordinates())) return true;
					for (var i = 0; i < p.getNumInteriorRing(); i++) {
						if (this.hasRepeatedPoint(p.getInteriorRingN(i).getCoordinates())) return true;
					}
					return false;
				})(...args);
			} else if (args[0] instanceof GeometryCollection) {
				return ((...args) => {
					let [gc] = args;
					for (var i = 0; i < gc.getNumGeometries(); i++) {
						var g = gc.getGeometryN(i);
						if (this.hasRepeatedPoint(g)) return true;
					}
					return false;
				})(...args);
			}
	}
};

