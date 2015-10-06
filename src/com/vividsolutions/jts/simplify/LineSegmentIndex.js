import Quadtree from 'com/vividsolutions/jts/index/quadtree/Quadtree';
import ItemVisitor from 'com/vividsolutions/jts/index/ItemVisitor';
import LineSegment from 'com/vividsolutions/jts/geom/LineSegment';
import ArrayList from 'java/util/ArrayList';
import Envelope from 'com/vividsolutions/jts/geom/Envelope';
import TaggedLineString from 'com/vividsolutions/jts/simplify/TaggedLineString';
export default class LineSegmentIndex {
	constructor(...args) {
		(() => {
			this.index = new Quadtree();
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
	remove(seg) {
		this.index.remove(new Envelope(seg.p0, seg.p1), seg);
	}
	add(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof LineSegment) {
						return ((...args) => {
							let [seg] = args;
							this.index.insert(new Envelope(seg.p0, seg.p1), seg);
						})(...args);
					} else if (args[0] instanceof TaggedLineString) {
						return ((...args) => {
							let [line] = args;
							var segs = line.getSegments();
							for (var i = 0; i < segs.length; i++) {
								var seg = segs[i];
								this.add(seg);
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	query(querySeg) {
		var env = new Envelope(querySeg.p0, querySeg.p1);
		var visitor = new LineSegmentVisitor(querySeg);
		this.index.query(env, visitor);
		var itemsFound = visitor.getItems();
		return itemsFound;
	}
}
class LineSegmentVisitor {
	constructor(...args) {
		(() => {
			this.querySeg = null;
			this.items = new ArrayList();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [querySeg] = args;
						this.querySeg = querySeg;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [ItemVisitor];
	}
	visitItem(item) {
		var seg = item;
		if (Envelope.intersects(seg.p0, seg.p1, this.querySeg.p0, this.querySeg.p1)) this.items.add(item);
	}
	getItems() {
		return this.items;
	}
}

