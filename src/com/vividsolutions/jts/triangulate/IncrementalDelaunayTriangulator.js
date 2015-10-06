import QuadEdge from 'com/vividsolutions/jts/triangulate/quadedge/QuadEdge';
export default class IncrementalDelaunayTriangulator {
	constructor(...args) {
		(() => {
			this.subdiv = null;
			this.isUsingTolerance = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [subdiv] = args;
						this.subdiv = subdiv;
						this.isUsingTolerance = subdiv.getTolerance() > 0.0;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	insertSite(v) {
		var e = this.subdiv.locate(v);
		if (this.subdiv.isVertexOfEdge(e, v)) {
			return e;
		} else if (this.subdiv.isOnEdge(e, v.getCoordinate())) {
			e = e.oPrev();
			this.subdiv.delete(e.oNext());
		}
		var base = this.subdiv.makeEdge(e.orig(), v);
		QuadEdge.splice(base, e);
		var startEdge = base;
		do {
			base = this.subdiv.connect(e, base.sym());
			e = base.oPrev();
		} while (e.lNext() !== startEdge);
		do {
			var t = e.oPrev();
			if (t.dest().rightOf(e) && v.isInCircle(e.orig(), t.dest(), e.dest())) {
				QuadEdge.swap(e);
				e = e.oPrev();
			} else if (e.oNext() === startEdge) {
				return base;
			} else {
				e = e.oNext().lPrev();
			}
		} while (true);
	}
	insertSites(vertices) {
		for (var i = vertices.iterator(); i.hasNext(); ) {
			var v = i.next();
			this.insertSite(v);
		}
	}
}

