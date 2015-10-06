import BufferParameters from 'com/vividsolutions/jts/operation/buffer/BufferParameters';
import Position from 'com/vividsolutions/jts/geomgraph/Position';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import BufferInputLineSimplifier from 'com/vividsolutions/jts/operation/buffer/BufferInputLineSimplifier';
import CoordinateArrays from 'com/vividsolutions/jts/geom/CoordinateArrays';
import OffsetSegmentGenerator from 'com/vividsolutions/jts/operation/buffer/OffsetSegmentGenerator';
export default class OffsetCurveBuilder {
	constructor(...args) {
		(() => {
			this.distance = 0.0;
			this.precisionModel = null;
			this.bufParams = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [precisionModel, bufParams] = args;
						this.precisionModel = precisionModel;
						this.bufParams = bufParams;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static copyCoordinates(pts) {
		var copy = new Array(pts.length);
		for (var i = 0; i < copy.length; i++) {
			copy[i] = new Coordinate(pts[i]);
		}
		return copy;
	}
	getOffsetCurve(inputPts, distance) {
		this.distance = distance;
		if (distance === 0.0) return null;
		var isRightSide = distance < 0.0;
		var posDistance = Math.abs(distance);
		var segGen = this.getSegGen(posDistance);
		if (inputPts.length <= 1) {
			this.computePointCurve(inputPts[0], segGen);
		} else {
			this.computeOffsetCurve(inputPts, isRightSide, segGen);
		}
		var curvePts = segGen.getCoordinates();
		if (isRightSide) CoordinateArrays.reverse(curvePts);
		return curvePts;
	}
	computeSingleSidedBufferCurve(inputPts, isRightSide, segGen) {
		var distTol = this.simplifyTolerance(this.distance);
		if (isRightSide) {
			segGen.addSegments(inputPts, true);
			var simp2 = BufferInputLineSimplifier.simplify(inputPts, -distTol);
			var n2 = simp2.length - 1;
			segGen.initSideSegments(simp2[n2], simp2[n2 - 1], Position.LEFT);
			segGen.addFirstSegment();
			for (var i = n2 - 2; i >= 0; i--) {
				segGen.addNextSegment(simp2[i], true);
			}
		} else {
			segGen.addSegments(inputPts, false);
			var simp1 = BufferInputLineSimplifier.simplify(inputPts, distTol);
			var n1 = simp1.length - 1;
			segGen.initSideSegments(simp1[0], simp1[1], Position.LEFT);
			segGen.addFirstSegment();
			for (var i = 2; i <= n1; i++) {
				segGen.addNextSegment(simp1[i], true);
			}
		}
		segGen.addLastSegment();
		segGen.closeRing();
	}
	computeRingBufferCurve(inputPts, side, segGen) {
		var distTol = this.simplifyTolerance(this.distance);
		if (side === Position.RIGHT) distTol = -distTol;
		var simp = BufferInputLineSimplifier.simplify(inputPts, distTol);
		var n = simp.length - 1;
		segGen.initSideSegments(simp[n - 1], simp[0], side);
		for (var i = 1; i <= n; i++) {
			var addStartPoint = i !== 1;
			segGen.addNextSegment(simp[i], addStartPoint);
		}
		segGen.closeRing();
	}
	computeLineBufferCurve(inputPts, segGen) {
		var distTol = this.simplifyTolerance(this.distance);
		var simp1 = BufferInputLineSimplifier.simplify(inputPts, distTol);
		var n1 = simp1.length - 1;
		segGen.initSideSegments(simp1[0], simp1[1], Position.LEFT);
		for (var i = 2; i <= n1; i++) {
			segGen.addNextSegment(simp1[i], true);
		}
		segGen.addLastSegment();
		segGen.addLineEndCap(simp1[n1 - 1], simp1[n1]);
		var simp2 = BufferInputLineSimplifier.simplify(inputPts, -distTol);
		var n2 = simp2.length - 1;
		segGen.initSideSegments(simp2[n2], simp2[n2 - 1], Position.LEFT);
		for (var i = n2 - 2; i >= 0; i--) {
			segGen.addNextSegment(simp2[i], true);
		}
		segGen.addLastSegment();
		segGen.addLineEndCap(simp2[1], simp2[0]);
		segGen.closeRing();
	}
	computePointCurve(pt, segGen) {
		switch (this.bufParams.getEndCapStyle()) {
			case BufferParameters.CAP_ROUND:
				segGen.createCircle(pt);
				break;
			case BufferParameters.CAP_SQUARE:
				segGen.createSquare(pt);
				break;
		}
	}
	getLineCurve(inputPts, distance) {
		this.distance = distance;
		if (distance < 0.0 && !this.bufParams.isSingleSided()) return null;
		if (distance === 0.0) return null;
		var posDistance = Math.abs(distance);
		var segGen = this.getSegGen(posDistance);
		if (inputPts.length <= 1) {
			this.computePointCurve(inputPts[0], segGen);
		} else {
			if (this.bufParams.isSingleSided()) {
				var isRightSide = distance < 0.0;
				this.computeSingleSidedBufferCurve(inputPts, isRightSide, segGen);
			} else this.computeLineBufferCurve(inputPts, segGen);
		}
		var lineCoord = segGen.getCoordinates();
		return lineCoord;
	}
	getBufferParameters() {
		return this.bufParams;
	}
	simplifyTolerance(bufDistance) {
		return bufDistance * this.bufParams.getSimplifyFactor();
	}
	getRingCurve(inputPts, side, distance) {
		this.distance = distance;
		if (inputPts.length <= 2) return this.getLineCurve(inputPts, distance);
		if (distance === 0.0) {
			return OffsetCurveBuilder.copyCoordinates(inputPts);
		}
		var segGen = this.getSegGen(distance);
		this.computeRingBufferCurve(inputPts, side, segGen);
		return segGen.getCoordinates();
	}
	computeOffsetCurve(inputPts, isRightSide, segGen) {
		var distTol = this.simplifyTolerance(this.distance);
		if (isRightSide) {
			var simp2 = BufferInputLineSimplifier.simplify(inputPts, -distTol);
			var n2 = simp2.length - 1;
			segGen.initSideSegments(simp2[n2], simp2[n2 - 1], Position.LEFT);
			segGen.addFirstSegment();
			for (var i = n2 - 2; i >= 0; i--) {
				segGen.addNextSegment(simp2[i], true);
			}
		} else {
			var simp1 = BufferInputLineSimplifier.simplify(inputPts, distTol);
			var n1 = simp1.length - 1;
			segGen.initSideSegments(simp1[0], simp1[1], Position.LEFT);
			segGen.addFirstSegment();
			for (var i = 2; i <= n1; i++) {
				segGen.addNextSegment(simp1[i], true);
			}
		}
		segGen.addLastSegment();
	}
	getSegGen(distance) {
		return new OffsetSegmentGenerator(this.precisionModel, this.bufParams, distance);
	}
	getClass() {
		return OffsetCurveBuilder;
	}
}

