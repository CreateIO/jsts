import Collection from 'java/util/Collection';
import Noder from './Noder';
import Coordinate from '../geom/Coordinate';
import NodedSegmentString from './NodedSegmentString';
import System from 'java/lang/System';
import CoordinateArrays from '../geom/CoordinateArrays';
import CollectionUtil from '../util/CollectionUtil';
export default class ScaledNoder {
	constructor(...args) {
		(() => {
			this.noder = null;
			this.scaleFactor = null;
			this.offsetX = null;
			this.offsetY = null;
			this.isScaled = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [noder, scaleFactor] = args;
						overloads.call(this, noder, scaleFactor, 0, 0);
					})(...args);
				case 4:
					return ((...args) => {
						let [noder, scaleFactor, offsetX, offsetY] = args;
						this.noder = noder;
						this.scaleFactor = scaleFactor;
						this.isScaled = !this.isIntegerPrecision();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Noder];
	}
	rescale(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0].interfaces_ && args[0].interfaces_.indexOf(Collection) > -1) {
						return ((...args) => {
							let [segStrings] = args;
							CollectionUtil.apply(segStrings, new (class {
								execute(obj) {
									var ss = obj;
									this.rescale(ss.getCoordinates());
									return null;
								}
							})());
						})(...args);
					} else if (args[0] instanceof Array) {
						return ((...args) => {
							let [pts] = args;
							var p0 = null;
							var p1 = null;
							if (pts.length === 2) {
								p0 = new Coordinate(pts[0]);
								p1 = new Coordinate(pts[1]);
							}
							for (var i = 0; i < pts.length; i++) {
								pts[i].x = pts[i].x / this.scaleFactor + this.offsetX;
								pts[i].y = pts[i].y / this.scaleFactor + this.offsetY;
							}
							if (pts.length === 2 && pts[0].equals2D(pts[1])) {
								System.out.println(pts);
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	scale(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0].interfaces_ && args[0].interfaces_.indexOf(Collection) > -1) {
						return ((...args) => {
							let [segStrings] = args;
							return CollectionUtil.transform(segStrings, new (class {
								execute(obj) {
									var ss = obj;
									return new NodedSegmentString(this.scale(ss.getCoordinates()), ss.getData());
								}
							})());
						})(...args);
					} else if (args[0] instanceof Array) {
						return ((...args) => {
							let [pts] = args;
							var roundPts = new Array(pts.length);
							for (var i = 0; i < pts.length; i++) {
								roundPts[i] = new Coordinate(Math.round((pts[i].x - this.offsetX) * this.scaleFactor), Math.round((pts[i].y - this.offsetY) * this.scaleFactor), pts[i].z);
							}
							var roundPtsNoDup = CoordinateArrays.removeRepeatedPoints(roundPts);
							return roundPtsNoDup;
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	isIntegerPrecision() {
		return this.scaleFactor === 1.0;
	}
	getNodedSubstrings() {
		var splitSS = this.noder.getNodedSubstrings();
		if (this.isScaled) this.rescale(splitSS);
		return splitSS;
	}
	computeNodes(inputSegStrings) {
		var intSegStrings = inputSegStrings;
		if (this.isScaled) intSegStrings = this.scale(inputSegStrings);
		this.noder.computeNodes(intSegStrings);
	}
	getClass() {
		return ScaledNoder;
	}
}

