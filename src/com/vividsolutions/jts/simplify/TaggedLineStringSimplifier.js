import LineSegment from 'com/vividsolutions/jts/geom/LineSegment';
import LineSegmentIndex from 'com/vividsolutions/jts/simplify/LineSegmentIndex';
import RobustLineIntersector from 'com/vividsolutions/jts/algorithm/RobustLineIntersector';
export default class TaggedLineStringSimplifier {
	constructor(...args) {
		(() => {
			this.li = new RobustLineIntersector();
			this.inputIndex = new LineSegmentIndex();
			this.outputIndex = new LineSegmentIndex();
			this.line = null;
			this.linePts = null;
			this.distanceTolerance = 0.0;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [inputIndex, outputIndex] = args;
						this.inputIndex = inputIndex;
						this.outputIndex = outputIndex;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static isInLineSection(line, sectionIndex, seg) {
		if (seg.getParent() !== line.getParent()) return false;
		var segIndex = seg.getIndex();
		if (segIndex >= sectionIndex[0] && segIndex < sectionIndex[1]) return true;
		return false;
	}
	flatten(start, end) {
		var p0 = this.linePts[start];
		var p1 = this.linePts[end];
		var newSeg = new LineSegment(p0, p1);
		this.remove(this.line, start, end);
		this.outputIndex.add(newSeg);
		return newSeg;
	}
	hasBadIntersection(parentLine, sectionIndex, candidateSeg) {
		if (this.hasBadOutputIntersection(candidateSeg)) return true;
		if (this.hasBadInputIntersection(parentLine, sectionIndex, candidateSeg)) return true;
		return false;
	}
	setDistanceTolerance(distanceTolerance) {
		this.distanceTolerance = distanceTolerance;
	}
	simplifySection(i, j, depth) {
		depth += 1;
		var sectionIndex = new Array(2);
		if (i + 1 === j) {
			var newSeg = this.line.getSegment(i);
			this.line.addToResult(newSeg);
			return null;
		}
		var isValidToSimplify = true;
		if (this.line.getResultSize() < this.line.getMinimumSize()) {
			var worstCaseSize = depth + 1;
			if (worstCaseSize < this.line.getMinimumSize()) isValidToSimplify = false;
		}
		var distance = new Array(1);
		var furthestPtIndex = this.findFurthestPoint(this.linePts, i, j, distance);
		if (distance[0] > this.distanceTolerance) isValidToSimplify = false;
		var candidateSeg = new LineSegment();
		candidateSeg.p0 = this.linePts[i];
		candidateSeg.p1 = this.linePts[j];
		sectionIndex[0] = i;
		sectionIndex[1] = j;
		if (this.hasBadIntersection(this.line, sectionIndex, candidateSeg)) isValidToSimplify = false;
		if (isValidToSimplify) {
			var newSeg = this.flatten(i, j);
			this.line.addToResult(newSeg);
			return null;
		}
		this.simplifySection(i, furthestPtIndex, depth);
		this.simplifySection(furthestPtIndex, j, depth);
	}
	hasBadOutputIntersection(candidateSeg) {
		var querySegs = this.outputIndex.query(candidateSeg);
		for (var i = querySegs.iterator(); i.hasNext(); ) {
			var querySeg = i.next();
			if (this.hasInteriorIntersection(querySeg, candidateSeg)) {
				return true;
			}
		}
		return false;
	}
	findFurthestPoint(pts, i, j, maxDistance) {
		var seg = new LineSegment();
		seg.p0 = pts[i];
		seg.p1 = pts[j];
		var maxDist = -1.0;
		var maxIndex = i;
		for (var k = i + 1; k < j; k++) {
			var midPt = pts[k];
			var distance = seg.distance(midPt);
			if (distance > maxDist) {
				maxDist = distance;
				maxIndex = k;
			}
		}
		maxDistance[0] = maxDist;
		return maxIndex;
	}
	simplify(line) {
		this.line = line;
		this.linePts = line.getParentCoordinates();
		this.simplifySection(0, this.linePts.length - 1, 0);
	}
	remove(line, start, end) {
		for (var i = start; i < end; i++) {
			var seg = line.getSegment(i);
			this.inputIndex.remove(seg);
		}
	}
	hasInteriorIntersection(seg0, seg1) {
		this.li.computeIntersection(seg0.p0, seg0.p1, seg1.p0, seg1.p1);
		return this.li.isInteriorIntersection();
	}
	hasBadInputIntersection(parentLine, sectionIndex, candidateSeg) {
		var querySegs = this.inputIndex.query(candidateSeg);
		for (var i = querySegs.iterator(); i.hasNext(); ) {
			var querySeg = i.next();
			if (this.hasInteriorIntersection(querySeg, candidateSeg)) {
				if (TaggedLineStringSimplifier.isInLineSection(parentLine, sectionIndex, querySeg)) continue;
				return true;
			}
		}
		return false;
	}
	getClass() {
		return TaggedLineStringSimplifier;
	}
}

