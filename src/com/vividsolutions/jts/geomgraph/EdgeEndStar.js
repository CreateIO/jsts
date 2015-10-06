import Location from 'com/vividsolutions/jts/geom/Location';
import Position from 'com/vividsolutions/jts/geomgraph/Position';
import TopologyException from 'com/vividsolutions/jts/geom/TopologyException';
import SimplePointInAreaLocator from 'com/vividsolutions/jts/algorithm/locate/SimplePointInAreaLocator';
import ArrayList from 'java/util/ArrayList';
import Assert from 'com/vividsolutions/jts/util/Assert';
import TreeMap from 'java/util/TreeMap';
export default class EdgeEndStar {
	constructor(...args) {
		(() => {
			this.edgeMap = new TreeMap();
			this.edgeList = null;
			this.ptInAreaLocation = [Location.NONE, Location.NONE];
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getNextCW(ee) {
		this.getEdges();
		var i = this.edgeList.indexOf(ee);
		var iNextCW = i - 1;
		if (i === 0) iNextCW = this.edgeList.size() - 1;
		return this.edgeList.get(iNextCW);
	}
	propagateSideLabels(geomIndex) {
		var startLoc = Location.NONE;
		for (var it = this.iterator(); it.hasNext(); ) {
			var e = it.next();
			var label = e.getLabel();
			if (label.isArea(geomIndex) && label.getLocation(geomIndex, Position.LEFT) !== Location.NONE) startLoc = label.getLocation(geomIndex, Position.LEFT);
		}
		if (startLoc === Location.NONE) return null;
		var currLoc = startLoc;
		for (var it = this.iterator(); it.hasNext(); ) {
			var e = it.next();
			var label = e.getLabel();
			if (label.getLocation(geomIndex, Position.ON) === Location.NONE) label.setLocation(geomIndex, Position.ON, currLoc);
			if (label.isArea(geomIndex)) {
				var leftLoc = label.getLocation(geomIndex, Position.LEFT);
				var rightLoc = label.getLocation(geomIndex, Position.RIGHT);
				if (rightLoc !== Location.NONE) {
					if (rightLoc !== currLoc) throw new TopologyException("side location conflict", e.getCoordinate());
					if (leftLoc === Location.NONE) {
						Assert.shouldNeverReachHere("found single null side (at " + e.getCoordinate() + ")");
					}
					currLoc = leftLoc;
				} else {
					Assert.isTrue(label.getLocation(geomIndex, Position.LEFT) === Location.NONE, "found single null side");
					label.setLocation(geomIndex, Position.RIGHT, currLoc);
					label.setLocation(geomIndex, Position.LEFT, currLoc);
				}
			}
		}
	}
	getCoordinate() {
		var it = this.iterator();
		if (!it.hasNext()) return null;
		var e = it.next();
		return e.getCoordinate();
	}
	print(out) {
		System.out.println("EdgeEndStar:   " + this.getCoordinate());
		for (var it = this.iterator(); it.hasNext(); ) {
			var e = it.next();
			e.print(out);
		}
	}
	isAreaLabelsConsistent(geomGraph) {
		this.computeEdgeEndLabels(geomGraph.getBoundaryNodeRule());
		return this.checkAreaLabelsConsistent(0);
	}
	checkAreaLabelsConsistent(geomIndex) {
		var edges = this.getEdges();
		if (edges.size() <= 0) return true;
		var lastEdgeIndex = edges.size() - 1;
		var startLabel = edges.get(lastEdgeIndex).getLabel();
		var startLoc = startLabel.getLocation(geomIndex, Position.LEFT);
		Assert.isTrue(startLoc !== Location.NONE, "Found unlabelled area edge");
		var currLoc = startLoc;
		for (var it = this.iterator(); it.hasNext(); ) {
			var e = it.next();
			var label = e.getLabel();
			Assert.isTrue(label.isArea(geomIndex), "Found non-area edge");
			var leftLoc = label.getLocation(geomIndex, Position.LEFT);
			var rightLoc = label.getLocation(geomIndex, Position.RIGHT);
			if (leftLoc === rightLoc) {
				return false;
			}
			if (rightLoc !== currLoc) {
				return false;
			}
			currLoc = leftLoc;
		}
		return true;
	}
	findIndex(eSearch) {
		this.iterator();
		for (var i = 0; i < this.edgeList.size(); i++) {
			var e = this.edgeList.get(i);
			if (e === eSearch) return i;
		}
		return -1;
	}
	iterator() {
		return this.getEdges().iterator();
	}
	getEdges() {
		if (this.edgeList === null) {
			this.edgeList = new ArrayList(this.edgeMap.values());
		}
		return this.edgeList;
	}
	getLocation(geomIndex, p, geom) {
		if (this.ptInAreaLocation[geomIndex] === Location.NONE) {
			this.ptInAreaLocation[geomIndex] = SimplePointInAreaLocator.locate(p, geom[geomIndex].getGeometry());
		}
		return this.ptInAreaLocation[geomIndex];
	}
	toString() {
		var buf = new StringBuffer();
		buf.append("EdgeEndStar:   " + this.getCoordinate());
		buf.append("\n");
		for (var it = this.iterator(); it.hasNext(); ) {
			var e = it.next();
			buf.append(e);
			buf.append("\n");
		}
		return buf.toString();
	}
	computeEdgeEndLabels(boundaryNodeRule) {
		for (var it = this.iterator(); it.hasNext(); ) {
			var ee = it.next();
			ee.computeLabel(boundaryNodeRule);
		}
	}
	computeLabelling(geomGraph) {
		this.computeEdgeEndLabels(geomGraph[0].getBoundaryNodeRule());
		this.propagateSideLabels(0);
		this.propagateSideLabels(1);
		var hasDimensionalCollapseEdge = [false, false];
		for (var it = this.iterator(); it.hasNext(); ) {
			var e = it.next();
			var label = e.getLabel();
			for (var geomi = 0; geomi < 2; geomi++) {
				if (label.isLine(geomi) && label.getLocation(geomi) === Location.BOUNDARY) hasDimensionalCollapseEdge[geomi] = true;
			}
		}
		for (var it = this.iterator(); it.hasNext(); ) {
			var e = it.next();
			var label = e.getLabel();
			for (var geomi = 0; geomi < 2; geomi++) {
				if (label.isAnyNull(geomi)) {
					var loc = Location.NONE;
					if (hasDimensionalCollapseEdge[geomi]) {
						loc = Location.EXTERIOR;
					} else {
						var p = e.getCoordinate();
						loc = this.getLocation(geomi, p, geomGraph);
					}
					label.setAllLocationsIfNull(geomi, loc);
				}
			}
		}
	}
	getDegree() {
		return this.edgeMap.size();
	}
	insertEdgeEnd(e, obj) {
		this.edgeMap.put(e, obj);
		this.edgeList = null;
	}
}

