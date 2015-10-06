import SimpleMCSweepLineIntersector from 'com/vividsolutions/jts/geomgraph/index/SimpleMCSweepLineIntersector';
import SegmentIntersector from 'com/vividsolutions/jts/geomgraph/index/SegmentIntersector';
import ArrayList from 'java/util/ArrayList';
export default class EdgeSetNoder {
	constructor(...args) {
		(() => {
			this.li = null;
			this.inputEdges = new ArrayList();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [li] = args;
						this.li = li;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	addEdges(edges) {
		this.inputEdges.addAll(edges);
	}
	getNodedEdges() {
		var esi = new SimpleMCSweepLineIntersector();
		var si = new SegmentIntersector(this.li, true, false);
		esi.computeIntersections(this.inputEdges, si, true);
		var splitEdges = new ArrayList();
		for (var i = this.inputEdges.iterator(); i.hasNext(); ) {
			var e = i.next();
			e.getEdgeIntersectionList().addSplitEdges(splitEdges);
		}
		return splitEdges;
	}
	getClass() {
		return EdgeSetNoder;
	}
}

