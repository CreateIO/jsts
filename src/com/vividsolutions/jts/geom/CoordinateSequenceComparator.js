import Double from 'java/lang/Double';
import Comparator from 'java/util/Comparator';
export default class CoordinateSequenceComparator {
	constructor(...args) {
		(() => {
			this.dimensionLimit = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						this.dimensionLimit = Integer.MAX_VALUE;
					})(...args);
				case 1:
					return ((...args) => {
						let [dimensionLimit] = args;
						this.dimensionLimit = dimensionLimit;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Comparator];
	}
	static compare(a, b) {
		if (a < b) return -1;
		if (a > b) return 1;
		if (Double.isNaN(a)) {
			if (Double.isNaN(b)) return 0;
			return -1;
		}
		if (Double.isNaN(b)) return 1;
		return 0;
	}
	compare(o1, o2) {
		var s1 = o1;
		var s2 = o2;
		var size1 = s1.size();
		var size2 = s2.size();
		var dim1 = s1.getDimension();
		var dim2 = s2.getDimension();
		var minDim = dim1;
		if (dim2 < minDim) minDim = dim2;
		var dimLimited = false;
		if (this.dimensionLimit <= minDim) {
			minDim = this.dimensionLimit;
			dimLimited = true;
		}
		if (!dimLimited) {
			if (dim1 < dim2) return -1;
			if (dim1 > dim2) return 1;
		}
		var i = 0;
		while (i < size1 && i < size2) {
			var ptComp = this.compareCoordinate(s1, s2, i, minDim);
			if (ptComp !== 0) return ptComp;
			i++;
		}
		if (i < size1) return 1;
		if (i < size2) return -1;
		return 0;
	}
	compareCoordinate(s1, s2, i, dimension) {
		for (var d = 0; d < dimension; d++) {
			var ord1 = s1.getOrdinate(i, d);
			var ord2 = s2.getOrdinate(i, d);
			var comp = CoordinateSequenceComparator.compare(ord1, ord2);
			if (comp !== 0) return comp;
		}
		return 0;
	}
}

