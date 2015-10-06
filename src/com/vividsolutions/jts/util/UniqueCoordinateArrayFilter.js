import TreeSet from 'java/util/TreeSet';
import CoordinateFilter from 'com/vividsolutions/jts/geom/CoordinateFilter';
import ArrayList from 'java/util/ArrayList';
export default class UniqueCoordinateArrayFilter {
	constructor(...args) {
		(() => {
			this.treeSet = new TreeSet();
			this.list = new ArrayList();
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
		return [CoordinateFilter];
	}
	static filterCoordinates(coords) {
		var filter = new UniqueCoordinateArrayFilter();
		for (var i = 0; i < coords.length; i++) {
			filter.filter(coords[i]);
		}
		return filter.getCoordinates();
	}
	filter(coord) {
		if (!this.treeSet.contains(coord)) {
			this.list.add(coord);
			this.treeSet.add(coord);
		}
	}
	getCoordinates() {
		var coordinates = [];
		return this.list.toArray(coordinates);
	}
}

