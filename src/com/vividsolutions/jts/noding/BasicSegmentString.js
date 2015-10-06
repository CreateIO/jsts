import WKTWriter from 'com/vividsolutions/jts/io/WKTWriter';
import CoordinateArraySequence from 'com/vividsolutions/jts/geom/impl/CoordinateArraySequence';
import Octant from 'com/vividsolutions/jts/noding/Octant';
import SegmentString from 'com/vividsolutions/jts/noding/SegmentString';
export default class BasicSegmentString {
	constructor(...args) {
		(() => {
			this.pts = null;
			this.data = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [pts, data] = args;
						this.pts = pts;
						this.data = data;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [SegmentString];
	}
	getCoordinates() {
		return this.pts;
	}
	size() {
		return this.pts.length;
	}
	getCoordinate(i) {
		return this.pts[i];
	}
	isClosed() {
		return this.pts[0].equals(this.pts[this.pts.length - 1]);
	}
	getSegmentOctant(index) {
		if (index === this.pts.length - 1) return -1;
		return Octant.octant(this.getCoordinate(index), this.getCoordinate(index + 1));
	}
	setData(data) {
		this.data = data;
	}
	getData() {
		return this.data;
	}
	toString() {
		return WKTWriter.toLineString(new CoordinateArraySequence(this.pts));
	}
}

