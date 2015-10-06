import Location from 'com/vividsolutions/jts/geom/Location';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import AxisPlaneCoordinateSequence from 'com/vividsolutions/jts/operation/distance3d/AxisPlaneCoordinateSequence';
import Vector3D from 'com/vividsolutions/jts/math/Vector3D';
import CoordinateSequence from 'com/vividsolutions/jts/geom/CoordinateSequence';
import Plane3D from 'com/vividsolutions/jts/math/Plane3D';
import RayCrossingCounter from 'com/vividsolutions/jts/algorithm/RayCrossingCounter';
export default class PlanarPolygon3D {
	constructor(...args) {
		(() => {
			this.plane = null;
			this.poly = null;
			this.facingPlane = -1;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [poly] = args;
						this.poly = poly;
						this.plane = this.findBestFitPlane(poly);
						this.facingPlane = this.plane.closestAxisPlane();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static project(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					if (args[0] instanceof Coordinate && Number.isInteger(args[1])) {
						return ((...args) => {
							let [p, facingPlane] = args;
							switch (facingPlane) {
								case Plane3D.XY_PLANE:
									return new Coordinate(p.x, p.y);
								case Plane3D.XZ_PLANE:
									return new Coordinate(p.x, p.z);
								default:
									return new Coordinate(p.y, p.z);
							}
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequence) > -1 && Number.isInteger(args[1])) {
						return ((...args) => {
							let [seq, facingPlane] = args;
							switch (facingPlane) {
								case Plane3D.XY_PLANE:
									return AxisPlaneCoordinateSequence.projectToXY(seq);
								case Plane3D.XZ_PLANE:
									return AxisPlaneCoordinateSequence.projectToXZ(seq);
								default:
									return AxisPlaneCoordinateSequence.projectToYZ(seq);
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	intersects(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [intPt] = args;
						if (Location.EXTERIOR === this.locate(intPt, this.poly.getExteriorRing())) return false;
						for (var i = 0; i < this.poly.getNumInteriorRing(); i++) {
							if (Location.INTERIOR === this.locate(intPt, this.poly.getInteriorRingN(i))) return false;
						}
						return true;
					})(...args);
				case 2:
					return ((...args) => {
						let [pt, ring] = args;
						var seq = ring.getCoordinateSequence();
						var seqProj = PlanarPolygon3D.project(seq, this.facingPlane);
						var ptProj = PlanarPolygon3D.project(pt, this.facingPlane);
						return Location.EXTERIOR !== RayCrossingCounter.locatePointInRing(ptProj, seqProj);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	averagePoint(seq) {
		var a = new Coordinate(0, 0, 0);
		var n = seq.size();
		for (var i = 0; i < n; i++) {
			a.x += seq.getOrdinate(i, CoordinateSequence.X);
			a.y += seq.getOrdinate(i, CoordinateSequence.Y);
			a.z += seq.getOrdinate(i, CoordinateSequence.Z);
		}
		a.x /= n;
		a.y /= n;
		a.z /= n;
		return a;
	}
	getPolygon() {
		return this.poly;
	}
	getPlane() {
		return this.plane;
	}
	findBestFitPlane(poly) {
		var seq = poly.getExteriorRing().getCoordinateSequence();
		var basePt = this.averagePoint(seq);
		var normal = this.averageNormal(seq);
		return new Plane3D(normal, basePt);
	}
	averageNormal(seq) {
		var n = seq.size();
		var sum = new Coordinate(0, 0, 0);
		var p1 = new Coordinate(0, 0, 0);
		var p2 = new Coordinate(0, 0, 0);
		for (var i = 0; i < n - 1; i++) {
			seq.getCoordinate(i, p1);
			seq.getCoordinate(i + 1, p2);
			sum.x += (p1.y - p2.y) * (p1.z + p2.z);
			sum.y += (p1.z - p2.z) * (p1.x + p2.x);
			sum.z += (p1.x - p2.x) * (p1.y + p2.y);
		}
		sum.x /= n;
		sum.y /= n;
		sum.z /= n;
		var norm = Vector3D.create(sum).normalize();
		return norm;
	}
	locate(pt, ring) {
		var seq = ring.getCoordinateSequence();
		var seqProj = PlanarPolygon3D.project(seq, this.facingPlane);
		var ptProj = PlanarPolygon3D.project(pt, this.facingPlane);
		return RayCrossingCounter.locatePointInRing(ptProj, seqProj);
	}
}

