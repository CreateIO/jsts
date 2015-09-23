function EdgeGraph() {
	this.vertexMap = new HashMap();
	if (arguments.length === 0) return;
}
module.exports = EdgeGraph
var HashMap = require('java/util/HashMap');
var HalfEdge = require('com/vividsolutions/jts/edgegraph/HalfEdge');
EdgeGraph.prototype.insert = function (orig, dest, eAdj) {
	var e = this.create(orig, dest);
	if (eAdj !== null) {
		eAdj.insert(e);
	} else {
		this.vertexMap.put(orig, e);
	}
	var eAdjDest = this.vertexMap.get(dest);
	if (eAdjDest !== null) {
		eAdjDest.insert(e.sym());
	} else {
		this.vertexMap.put(dest, e.sym());
	}
	return e;
};
EdgeGraph.prototype.create = function (p0, p1) {
	var e0 = this.createEdge(p0);
	var e1 = this.createEdge(p1);
	HalfEdge.init(e0, e1);
	return e0;
};
EdgeGraph.prototype.createEdge = function (orig) {
	return new HalfEdge(orig);
};
EdgeGraph.prototype.addEdge = function (orig, dest) {
	var cmp = dest.compareTo(orig);
	if (cmp === 0) return null;
	var eAdj = this.vertexMap.get(orig);
	var eSame = null;
	if (eAdj !== null) {
		eSame = eAdj.find(dest);
	}
	if (eSame !== null) {
		return eSame;
	}
	var e = this.insert(orig, dest, eAdj);
	return e;
};
EdgeGraph.prototype.getVertexEdges = function () {
	return this.vertexMap.values();
};
EdgeGraph.prototype.findEdge = function (orig, dest) {
	var e = this.vertexMap.get(orig);
	if (e === null) return null;
	return e.find(dest);
};

