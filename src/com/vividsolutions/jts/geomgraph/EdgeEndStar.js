function EdgeEndStar() {
	this.edgeMap = new TreeMap();
	this.edgeList = null;
	this.ptInAreaLocation = [Location.NONE, Location.NONE];
	if (arguments.length === 0) return;
}
module.exports = EdgeEndStar
var Location = require('com/vividsolutions/jts/geom/Location');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var TopologyException = require('com/vividsolutions/jts/geom/TopologyException');
var SimplePointInAreaLocator = require('com/vividsolutions/jts/algorithm/locate/SimplePointInAreaLocator');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
var TreeMap = require('java/util/TreeMap');
EdgeEndStar.prototype.getNextCW = function (ee) {
	this.getEdges();
	var i = this.edgeList.indexOf(ee);
	var iNextCW = i - 1;
	if (i === 0) iNextCW = this.edgeList.size() - 1;
	return this.edgeList.get(iNextCW);
};
EdgeEndStar.prototype.propagateSideLabels = function (geomIndex) {
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
};
EdgeEndStar.prototype.getCoordinate = function () {
	var it = this.iterator();
	if (!it.hasNext()) return null;
	var e = it.next();
	return e.getCoordinate();
};
EdgeEndStar.prototype.print = function (out) {
	System.out.println("EdgeEndStar:   " + this.getCoordinate());
	for (var it = this.iterator(); it.hasNext(); ) {
		var e = it.next();
		e.print(out);
	}
};
EdgeEndStar.prototype.isAreaLabelsConsistent = function (geomGraph) {
	this.computeEdgeEndLabels(geomGraph.getBoundaryNodeRule());
	return this.checkAreaLabelsConsistent(0);
};
EdgeEndStar.prototype.checkAreaLabelsConsistent = function (geomIndex) {
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
};
EdgeEndStar.prototype.findIndex = function (eSearch) {
	this.iterator();
	for (var i = 0; i < this.edgeList.size(); i++) {
		var e = this.edgeList.get(i);
		if (e === eSearch) return i;
	}
	return -1;
};
EdgeEndStar.prototype.iterator = function () {
	return this.getEdges().iterator();
};
EdgeEndStar.prototype.getEdges = function () {
	if (this.edgeList === null) {
		this.edgeList = new ArrayList(this.edgeMap.values());
	}
	return this.edgeList;
};
EdgeEndStar.prototype.getLocation = function (geomIndex, p, geom) {
	if (this.ptInAreaLocation[geomIndex] === Location.NONE) {
		this.ptInAreaLocation[geomIndex] = SimplePointInAreaLocator.locate(p, geom[geomIndex].getGeometry());
	}
	return this.ptInAreaLocation[geomIndex];
};
EdgeEndStar.prototype.toString = function () {
	var buf = new StringBuffer();
	buf.append("EdgeEndStar:   " + this.getCoordinate());
	buf.append("\n");
	for (var it = this.iterator(); it.hasNext(); ) {
		var e = it.next();
		buf.append(e);
		buf.append("\n");
	}
	return buf.toString();
};
EdgeEndStar.prototype.computeEdgeEndLabels = function (boundaryNodeRule) {
	for (var it = this.iterator(); it.hasNext(); ) {
		var ee = it.next();
		ee.computeLabel(boundaryNodeRule);
	}
};
EdgeEndStar.prototype.computeLabelling = function (geomGraph) {
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
};
EdgeEndStar.prototype.getDegree = function () {
	return this.edgeMap.size();
};
EdgeEndStar.prototype.insertEdgeEnd = function (e, obj) {
	this.edgeMap.put(e, obj);
	this.edgeList = null;
};
