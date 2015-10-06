import PointLocator from 'com/vividsolutions/jts/algorithm/PointLocator';
import Location from 'com/vividsolutions/jts/geom/Location';
import IntersectionMatrix from 'com/vividsolutions/jts/geom/IntersectionMatrix';
import EdgeEndBuilder from 'com/vividsolutions/jts/operation/relate/EdgeEndBuilder';
import NodeMap from 'com/vividsolutions/jts/geomgraph/NodeMap';
import RelateNodeFactory from 'com/vividsolutions/jts/operation/relate/RelateNodeFactory';
import ArrayList from 'java/util/ArrayList';
import RobustLineIntersector from 'com/vividsolutions/jts/algorithm/RobustLineIntersector';
import Assert from 'com/vividsolutions/jts/util/Assert';
export default class RelateComputer {
	constructor(...args) {
		(() => {
			this.li = new RobustLineIntersector();
			this.ptLocator = new PointLocator();
			this.arg = null;
			this.nodes = new NodeMap(new RelateNodeFactory());
			this.im = null;
			this.isolatedEdges = new ArrayList();
			this.invalidPoint = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [arg] = args;
						this.arg = arg;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	insertEdgeEnds(ee) {
		for (var i = ee.iterator(); i.hasNext(); ) {
			var e = i.next();
			this.nodes.add(e);
		}
	}
	computeProperIntersectionIM(intersector, im) {
		var dimA = this.arg[0].getGeometry().getDimension();
		var dimB = this.arg[1].getGeometry().getDimension();
		var hasProper = intersector.hasProperIntersection();
		var hasProperInterior = intersector.hasProperInteriorIntersection();
		if (dimA === 2 && dimB === 2) {
			if (hasProper) im.setAtLeast("212101212");
		} else if (dimA === 2 && dimB === 1) {
			if (hasProper) im.setAtLeast("FFF0FFFF2");
			if (hasProperInterior) im.setAtLeast("1FFFFF1FF");
		} else if (dimA === 1 && dimB === 2) {
			if (hasProper) im.setAtLeast("F0FFFFFF2");
			if (hasProperInterior) im.setAtLeast("1F1FFFFFF");
		} else if (dimA === 1 && dimB === 1) {
			if (hasProperInterior) im.setAtLeast("0FFFFFFFF");
		}
	}
	labelIsolatedEdges(thisIndex, targetIndex) {
		for (var ei = this.arg[thisIndex].getEdgeIterator(); ei.hasNext(); ) {
			var e = ei.next();
			if (e.isIsolated()) {
				this.labelIsolatedEdge(e, targetIndex, this.arg[targetIndex].getGeometry());
				this.isolatedEdges.add(e);
			}
		}
	}
	labelIsolatedEdge(e, targetIndex, target) {
		if (target.getDimension() > 0) {
			var loc = this.ptLocator.locate(e.getCoordinate(), target);
			e.getLabel().setAllLocations(targetIndex, loc);
		} else {
			e.getLabel().setAllLocations(targetIndex, Location.EXTERIOR);
		}
	}
	computeIM() {
		var im = new IntersectionMatrix();
		im.set(Location.EXTERIOR, Location.EXTERIOR, 2);
		if (!this.arg[0].getGeometry().getEnvelopeInternal().intersects(this.arg[1].getGeometry().getEnvelopeInternal())) {
			this.computeDisjointIM(im);
			return im;
		}
		this.arg[0].computeSelfNodes(this.li, false);
		this.arg[1].computeSelfNodes(this.li, false);
		var intersector = this.arg[0].computeEdgeIntersections(this.arg[1], this.li, false);
		this.computeIntersectionNodes(0);
		this.computeIntersectionNodes(1);
		this.copyNodesAndLabels(0);
		this.copyNodesAndLabels(1);
		this.labelIsolatedNodes();
		this.computeProperIntersectionIM(intersector, im);
		var eeBuilder = new EdgeEndBuilder();
		var ee0 = eeBuilder.computeEdgeEnds(this.arg[0].getEdgeIterator());
		this.insertEdgeEnds(ee0);
		var ee1 = eeBuilder.computeEdgeEnds(this.arg[1].getEdgeIterator());
		this.insertEdgeEnds(ee1);
		this.labelNodeEdges();
		this.labelIsolatedEdges(0, 1);
		this.labelIsolatedEdges(1, 0);
		this.updateIM(im);
		return im;
	}
	labelNodeEdges() {
		for (var ni = this.nodes.iterator(); ni.hasNext(); ) {
			var node = ni.next();
			node.getEdges().computeLabelling(this.arg);
		}
	}
	copyNodesAndLabels(argIndex) {
		for (var i = this.arg[argIndex].getNodeIterator(); i.hasNext(); ) {
			var graphNode = i.next();
			var newNode = this.nodes.addNode(graphNode.getCoordinate());
			newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
		}
	}
	labelIntersectionNodes(argIndex) {
		for (var i = this.arg[argIndex].getEdgeIterator(); i.hasNext(); ) {
			var e = i.next();
			var eLoc = e.getLabel().getLocation(argIndex);
			for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext(); ) {
				var ei = eiIt.next();
				var n = this.nodes.find(ei.coord);
				if (n.getLabel().isNull(argIndex)) {
					if (eLoc === Location.BOUNDARY) n.setLabelBoundary(argIndex); else n.setLabel(argIndex, Location.INTERIOR);
				}
			}
		}
	}
	labelIsolatedNode(n, targetIndex) {
		var loc = this.ptLocator.locate(n.getCoordinate(), this.arg[targetIndex].getGeometry());
		n.getLabel().setAllLocations(targetIndex, loc);
	}
	computeIntersectionNodes(argIndex) {
		for (var i = this.arg[argIndex].getEdgeIterator(); i.hasNext(); ) {
			var e = i.next();
			var eLoc = e.getLabel().getLocation(argIndex);
			for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext(); ) {
				var ei = eiIt.next();
				var n = this.nodes.addNode(ei.coord);
				if (eLoc === Location.BOUNDARY) n.setLabelBoundary(argIndex); else {
					if (n.getLabel().isNull(argIndex)) n.setLabel(argIndex, Location.INTERIOR);
				}
			}
		}
	}
	labelIsolatedNodes() {
		for (var ni = this.nodes.iterator(); ni.hasNext(); ) {
			var n = ni.next();
			var label = n.getLabel();
			Assert.isTrue(label.getGeometryCount() > 0, "node with empty label found");
			if (n.isIsolated()) {
				if (label.isNull(0)) this.labelIsolatedNode(n, 0); else this.labelIsolatedNode(n, 1);
			}
		}
	}
	updateIM(im) {
		for (var ei = this.isolatedEdges.iterator(); ei.hasNext(); ) {
			var e = ei.next();
			e.updateIM(im);
		}
		for (var ni = this.nodes.iterator(); ni.hasNext(); ) {
			var node = ni.next();
			node.updateIM(im);
			node.updateIMFromEdges(im);
		}
	}
	computeDisjointIM(im) {
		var ga = this.arg[0].getGeometry();
		if (!ga.isEmpty()) {
			im.set(Location.INTERIOR, Location.EXTERIOR, ga.getDimension());
			im.set(Location.BOUNDARY, Location.EXTERIOR, ga.getBoundaryDimension());
		}
		var gb = this.arg[1].getGeometry();
		if (!gb.isEmpty()) {
			im.set(Location.EXTERIOR, Location.INTERIOR, gb.getDimension());
			im.set(Location.EXTERIOR, Location.BOUNDARY, gb.getBoundaryDimension());
		}
	}
}

