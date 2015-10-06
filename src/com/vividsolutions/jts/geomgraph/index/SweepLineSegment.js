export default class SweepLineSegment {
	constructor(...args) {
		(() => {
			this.edge = null;
			this.pts = null;
			this.ptIndex = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [edge, ptIndex] = args;
						this.edge = edge;
						this.ptIndex = ptIndex;
						this.pts = edge.getCoordinates();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getMaxX() {
		var x1 = this.x;
		var x2 = this.x;
		return x1 > x2 ? x1 : x2;
	}
	getMinX() {
		var x1 = this.x;
		var x2 = this.x;
		return x1 < x2 ? x1 : x2;
	}
	computeIntersections(ss, si) {
		si.addIntersections(this.edge, this.ptIndex, ss.edge, ss.ptIndex);
	}
}

