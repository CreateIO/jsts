import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import LineSegment from 'com/vividsolutions/jts/geom/LineSegment';
import Envelope from 'com/vividsolutions/jts/geom/Envelope';
export default class GeometricShapeBuilder {
	constructor(...args) {
		(() => {
			this.extent = new Envelope(0, 1, 0, 1);
			this.numPts = 0;
			this.geomFactory = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geomFactory] = args;
						this.geomFactory = geomFactory;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	setNumPoints(numPts) {
		this.numPts = numPts;
	}
	getRadius() {
		return this.getDiameter() / 2;
	}
	getDiameter() {
		return Math.min(this.extent.getHeight(), this.extent.getWidth());
	}
	getSquareBaseLine() {
		var radius = this.getRadius();
		var centre = this.getCentre();
		var p0 = new Coordinate(centre.x - radius, centre.y - radius);
		var p1 = new Coordinate(centre.x + radius, centre.y - radius);
		return new LineSegment(p0, p1);
	}
	setExtent(extent) {
		this.extent = extent;
	}
	getCentre() {
		return this.extent.centre();
	}
	getExtent() {
		return this.extent;
	}
	getSquareExtent() {
		var radius = this.getRadius();
		var centre = this.getCentre();
		return new Envelope(centre.x - radius, centre.x + radius, centre.y - radius, centre.y + radius);
	}
	createCoord(x, y) {
		var pt = new Coordinate(x, y);
		this.geomFactory.getPrecisionModel().makePrecise(pt);
		return pt;
	}
	getClass() {
		return GeometricShapeBuilder;
	}
}

