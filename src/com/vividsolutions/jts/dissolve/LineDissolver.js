function LineDissolver() {
	this.result = null;
	this.factory = null;
	this.graph = null;
	this.lines = new ArrayList();
	this.nodeEdgeStack = new Stack();
	this.ringStartEdge = null;
	if (arguments.length === 0) return;
	this.graph = new DissolveEdgeGraph();
}
module.exports = LineDissolver
var LineString = require('com/vividsolutions/jts/geom/LineString');
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Collection = require('java/util/Collection');
var Stack = require('java/util/Stack');
var MarkHalfEdge = require('com/vividsolutions/jts/edgegraph/MarkHalfEdge');
var DissolveEdgeGraph = require('com/vividsolutions/jts/dissolve/DissolveEdgeGraph');
var GeometryComponentFilter = require('com/vividsolutions/jts/geom/GeometryComponentFilter');
var ArrayList = require('java/util/ArrayList');
LineDissolver.prototype.addLine = function (line) {
	this.lines.add(this.factory.createLineString(line.toCoordinateArray()));
};
LineDissolver.prototype.updateRingStartEdge = function (e) {
	if (!e.isStart()) {
		e = e.sym();
		if (!e.isStart()) return null;
	}
	if (this.ringStartEdge === null) {
		this.ringStartEdge = e;
		return null;
	}
	if (e.orig().compareTo(this.ringStartEdge.orig()) < 0) {
		this.ringStartEdge = e;
	}
};
LineDissolver.prototype.getResult = function () {
	if (this.result === null) this.computeResult();
	return this.result;
};
LineDissolver.prototype.process = function (e) {
	var eNode = e.prevNode();
	if (eNode === null) eNode = e;
	this.stackEdges(eNode);
	this.buildLines();
};
LineDissolver.prototype.buildRing = function (eStartRing) {
	var line = new CoordinateList();
	var e = eStartRing;
	line.add(e.orig().clone(), false);
	while (e.sym().degree() === 2) {
		var eNext = e.next();
		if (eNext === eStartRing) break;
		line.add(eNext.orig().clone(), false);
		e = eNext;
	}
	line.add(e.dest().clone(), false);
	this.addLine(line);
};
LineDissolver.prototype.buildLine = function (eStart) {
	var line = new CoordinateList();
	var e = eStart;
	this.ringStartEdge = null;
	MarkHalfEdge.markBoth(e);
	line.add(e.orig().clone(), false);
	while (e.sym().degree() === 2) {
		this.updateRingStartEdge(e);
		var eNext = e.next();
		if (eNext === eStart) {
			this.buildRing(this.ringStartEdge);
			return null;
		}
		line.add(eNext.orig().clone(), false);
		e = eNext;
		MarkHalfEdge.markBoth(e);
	}
	line.add(e.dest().clone(), false);
	this.stackEdges(e.sym());
	this.addLine(line);
};
LineDissolver.prototype.stackEdges = function (node) {
	var e = node;
	do {
		if (!MarkHalfEdge.isMarked(e)) this.nodeEdgeStack.add(e);
		e = e.oNext();
	} while (e !== node);
};
LineDissolver.prototype.computeResult = function () {
	var edges = this.graph.getVertexEdges();
	for (var i = edges.iterator(); i.hasNext(); ) {
		var e = i.next();
		if (MarkHalfEdge.isMarked(e)) continue;
		this.process(e);
	}
	this.result = this.factory.buildGeometry(this.lines);
};
LineDissolver.prototype.buildLines = function () {
	while (!this.nodeEdgeStack.empty()) {
		var e = this.nodeEdgeStack.pop();
		if (MarkHalfEdge.isMarked(e)) continue;
		this.buildLine(e);
	}
};
LineDissolver.prototype.add = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geometry] = args;
					geometry.apply(new GeometryComponentFilter());
				})(...args);
			} else if (args[0] instanceof Collection) {
				return ((...args) => {
					let [geometries] = args;
					for (var i = geometries.iterator(); i.hasNext(); ) {
						var geometry = i.next();
						this.add(geometry);
					}
				})(...args);
			} else if (args[0] instanceof LineString) {
				return ((...args) => {
					let [lineString] = args;
					if (this.factory === null) {
						this.factory = lineString.getFactory();
					}
					var seq = lineString.getCoordinateSequence();
					for (var i = 1; i < seq.size(); i++) {
						var e = this.graph.addEdge(seq.getCoordinate(i - 1), seq.getCoordinate(i));
						if (i === 1) e.setStart();
					}
				})(...args);
			}
	}
};
LineDissolver.dissolve = function (g) {
	var d = new LineDissolver();
	d.add(g);
	return d.getResult();
};
