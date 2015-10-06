import Location from 'com/vividsolutions/jts/geom/Location';
import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import Node from 'com/vividsolutions/jts/geomgraph/Node';
import NodeMap from 'com/vividsolutions/jts/geomgraph/NodeMap';
import DirectedEdge from 'com/vividsolutions/jts/geomgraph/DirectedEdge';
import ArrayList from 'java/util/ArrayList';
import Quadrant from 'com/vividsolutions/jts/geomgraph/Quadrant';
import NodeFactory from 'com/vividsolutions/jts/geomgraph/NodeFactory';
export default class PlanarGraph {
	constructor(...args) {
		(() => {
			this.edges = new ArrayList();
			this.nodes = null;
			this.edgeEndList = new ArrayList();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						this.nodes = new NodeMap(new NodeFactory());
					})(...args);
				case 1:
					return ((...args) => {
						let [nodeFact] = args;
						this.nodes = new NodeMap(nodeFact);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static linkResultDirectedEdges(nodes) {
		for (var nodeit = nodes.iterator(); nodeit.hasNext(); ) {
			var node = nodeit.next();
			node.getEdges().linkResultDirectedEdges();
		}
	}
	printEdges(out) {
		out.println("Edges:");
		for (var i = 0; i < this.edges.size(); i++) {
			out.println("edge " + i + ":");
			var e = this.edges.get(i);
			e.print(out);
			e.eiList.print(out);
		}
	}
	find(coord) {
		return this.nodes.find(coord);
	}
	addNode(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Coordinate) {
						return ((...args) => {
							let [coord] = args;
							return this.nodes.addNode(coord);
						})(...args);
					} else if (args[0] instanceof Node) {
						return ((...args) => {
							let [node] = args;
							return this.nodes.addNode(node);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getNodeIterator() {
		return this.nodes.iterator();
	}
	linkResultDirectedEdges() {
		for (var nodeit = this.nodes.iterator(); nodeit.hasNext(); ) {
			var node = nodeit.next();
			node.getEdges().linkResultDirectedEdges();
		}
	}
	debugPrintln(o) {
		System.out.println(o);
	}
	isBoundaryNode(geomIndex, coord) {
		var node = this.nodes.find(coord);
		if (node === null) return false;
		var label = node.getLabel();
		if (label !== null && label.getLocation(geomIndex) === Location.BOUNDARY) return true;
		return false;
	}
	linkAllDirectedEdges() {
		for (var nodeit = this.nodes.iterator(); nodeit.hasNext(); ) {
			var node = nodeit.next();
			node.getEdges().linkAllDirectedEdges();
		}
	}
	matchInSameDirection(p0, p1, ep0, ep1) {
		if (!p0.equals(ep0)) return false;
		if (CGAlgorithms.computeOrientation(p0, p1, ep1) === CGAlgorithms.COLLINEAR && Quadrant.quadrant(p0, p1) === Quadrant.quadrant(ep0, ep1)) return true;
		return false;
	}
	getEdgeEnds() {
		return this.edgeEndList;
	}
	debugPrint(o) {
		System.out.print(o);
	}
	getEdgeIterator() {
		return this.edges.iterator();
	}
	findEdgeInSameDirection(p0, p1) {
		for (var i = 0; i < this.edges.size(); i++) {
			var e = this.edges.get(i);
			var eCoord = e.getCoordinates();
			if (this.matchInSameDirection(p0, p1, eCoord[0], eCoord[1])) return e;
			if (this.matchInSameDirection(p0, p1, eCoord[eCoord.length - 1], eCoord[eCoord.length - 2])) return e;
		}
		return null;
	}
	insertEdge(e) {
		this.edges.add(e);
	}
	findEdgeEnd(e) {
		for (var i = this.getEdgeEnds().iterator(); i.hasNext(); ) {
			var ee = i.next();
			if (ee.getEdge() === e) return ee;
		}
		return null;
	}
	addEdges(edgesToAdd) {
		for (var it = edgesToAdd.iterator(); it.hasNext(); ) {
			var e = it.next();
			this.edges.add(e);
			var de1 = new DirectedEdge(e, true);
			var de2 = new DirectedEdge(e, false);
			de1.setSym(de2);
			de2.setSym(de1);
			this.add(de1);
			this.add(de2);
		}
	}
	add(e) {
		this.nodes.add(e);
		this.edgeEndList.add(e);
	}
	getNodes() {
		return this.nodes.values();
	}
	findEdge(p0, p1) {
		for (var i = 0; i < this.edges.size(); i++) {
			var e = this.edges.get(i);
			var eCoord = e.getCoordinates();
			if (p0.equals(eCoord[0]) && p1.equals(eCoord[1])) return e;
		}
		return null;
	}
}

