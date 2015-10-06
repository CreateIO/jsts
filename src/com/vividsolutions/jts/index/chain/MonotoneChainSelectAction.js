import LineSegment from 'com/vividsolutions/jts/geom/LineSegment';
import Envelope from 'com/vividsolutions/jts/geom/Envelope';
export default class MonotoneChainSelectAction {
	constructor(...args) {
		(() => {
			this.tempEnv1 = new Envelope();
			this.selectedSegment = new LineSegment();
		})();
	}
	get interfaces_() {
		return [];
	}
	select(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [seg] = args;
					})(...args);
				case 2:
					return ((...args) => {
						let [mc, startIndex] = args;
						mc.getLineSegment(startIndex, this.selectedSegment);
						this.select(this.selectedSegment);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return MonotoneChainSelectAction;
	}
}

