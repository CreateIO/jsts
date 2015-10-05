function DistanceToPointFinder() {
	if (arguments.length === 0) return;
}
module.exports = DistanceToPointFinder
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var PointPairDistance = require('com/vividsolutions/jts/operation/buffer/validate/PointPairDistance');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
DistanceToPointFinder.computeDistance = function (...args) {
	switch (args.length) {
		case 3:
			if (args[2] instanceof PointPairDistance && args[0] instanceof Geometry && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [geom, pt, ptDist] = args;
					if (geom instanceof LineString) {
						DistanceToPointFinder.computeDistance(geom, pt, ptDist);
					} else if (geom instanceof Polygon) {
						DistanceToPointFinder.computeDistance(geom, pt, ptDist);
					} else if (geom instanceof GeometryCollection) {
						var gc = geom;
						for (var i = 0; i < gc.getNumGeometries(); i++) {
							var g = gc.getGeometryN(i);
							DistanceToPointFinder.computeDistance(g, pt, ptDist);
						}
					} else {
						ptDist.setMinimum(geom.getCoordinate(), pt);
					}
				})(...args);
			} else if (args[2] instanceof PointPairDistance && args[0] instanceof LineString && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [line, pt, ptDist] = args;
					var coords = line.getCoordinates();
					var tempSegment = new LineSegment();
					for (var i = 0; i < coords.length - 1; i++) {
						tempSegment.setCoordinates(coords[i], coords[i + 1]);
						var closestPt = tempSegment.closestPoint(pt);
						ptDist.setMinimum(closestPt, pt);
					}
				})(...args);
			} else if (args[2] instanceof PointPairDistance && args[0] instanceof LineSegment && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [segment, pt, ptDist] = args;
					var closestPt = segment.closestPoint(pt);
					ptDist.setMinimum(closestPt, pt);
				})(...args);
			} else if (args[2] instanceof PointPairDistance && args[0] instanceof Polygon && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [poly, pt, ptDist] = args;
					DistanceToPointFinder.computeDistance(poly.getExteriorRing(), pt, ptDist);
					for (var i = 0; i < poly.getNumInteriorRing(); i++) {
						DistanceToPointFinder.computeDistance(poly.getInteriorRingN(i), pt, ptDist);
					}
				})(...args);
			}
	}
};
