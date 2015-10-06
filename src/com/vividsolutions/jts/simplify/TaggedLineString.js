import TaggedLineSegment from 'com/vividsolutions/jts/simplify/TaggedLineSegment';
import ArrayList from 'java/util/ArrayList';
export default class TaggedLineString {
	constructor(...args) {
		(() => {
			this.parentLine = null;
			this.segs = null;
			this.resultSegs = new ArrayList();
			this.minimumSize = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [parentLine] = args;
						overloads.call(this, parentLine, 2);
					})(...args);
				case 2:
					return ((...args) => {
						let [parentLine, minimumSize] = args;
						this.parentLine = parentLine;
						this.minimumSize = minimumSize;
						this.init();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static extractCoordinates(segs) {
		var pts = [];
		var seg = null;
		for (var i = 0; i < segs.size(); i++) {
			seg = segs.get(i);
			pts[i] = seg.p0;
		}
		pts[pts.length - 1] = seg.p1;
		return pts;
	}
	addToResult(seg) {
		this.resultSegs.add(seg);
	}
	asLineString() {
		return this.parentLine.getFactory().createLineString(TaggedLineString.extractCoordinates(this.resultSegs));
	}
	getResultSize() {
		var resultSegsSize = this.resultSegs.size();
		return resultSegsSize === 0 ? 0 : resultSegsSize + 1;
	}
	getParent() {
		return this.parentLine;
	}
	getSegment(i) {
		return this.segs[i];
	}
	getParentCoordinates() {
		return this.parentLine.getCoordinates();
	}
	getMinimumSize() {
		return this.minimumSize;
	}
	asLinearRing() {
		return this.parentLine.getFactory().createLinearRing(TaggedLineString.extractCoordinates(this.resultSegs));
	}
	getSegments() {
		return this.segs;
	}
	init() {
		var pts = this.parentLine.getCoordinates();
		this.segs = [];
		for (var i = 0; i < pts.length - 1; i++) {
			var seg = new TaggedLineSegment(pts[i], pts[i + 1], this.parentLine, i);
			this.segs[i] = seg;
		}
	}
	getResultCoordinates() {
		return TaggedLineString.extractCoordinates(this.resultSegs);
	}
}

