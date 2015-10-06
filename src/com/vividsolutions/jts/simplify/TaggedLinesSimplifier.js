import TaggedLineStringSimplifier from 'com/vividsolutions/jts/simplify/TaggedLineStringSimplifier';
import LineSegmentIndex from 'com/vividsolutions/jts/simplify/LineSegmentIndex';
export default class TaggedLinesSimplifier {
	constructor(...args) {
		(() => {
			this.inputIndex = new LineSegmentIndex();
			this.outputIndex = new LineSegmentIndex();
			this.distanceTolerance = 0.0;
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
	setDistanceTolerance(distanceTolerance) {
		this.distanceTolerance = distanceTolerance;
	}
	simplify(taggedLines) {
		for (var i = taggedLines.iterator(); i.hasNext(); ) {
			this.inputIndex.add(i.next());
		}
		for (var i = taggedLines.iterator(); i.hasNext(); ) {
			var tlss = new TaggedLineStringSimplifier(this.inputIndex, this.outputIndex);
			tlss.setDistanceTolerance(this.distanceTolerance);
			tlss.simplify(i.next());
		}
	}
}

