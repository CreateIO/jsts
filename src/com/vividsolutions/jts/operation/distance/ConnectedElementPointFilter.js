import LineString from 'com/vividsolutions/jts/geom/LineString';
import Point from 'com/vividsolutions/jts/geom/Point';
import Polygon from 'com/vividsolutions/jts/geom/Polygon';
import ArrayList from 'java/util/ArrayList';
import GeometryFilter from 'com/vividsolutions/jts/geom/GeometryFilter';
export default class ConnectedElementPointFilter {
	constructor(...args) {
		(() => {
			this.pts = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [pts] = args;
						this.pts = pts;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [GeometryFilter];
	}
	static getCoordinates(geom) {
		var pts = new ArrayList();
		geom.apply(new ConnectedElementPointFilter(pts));
		return pts;
	}
	filter(geom) {
		if (geom instanceof Point || geom instanceof LineString || geom instanceof Polygon) this.pts.add(geom.getCoordinate());
	}
	getClass() {
		return ConnectedElementPointFilter;
	}
}

