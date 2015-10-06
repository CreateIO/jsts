import Bintree from 'com/vividsolutions/jts/index/bintree/Bintree';
import Interval from 'com/vividsolutions/jts/index/bintree/Interval';
import Double from 'java/lang/Double';
import MonotoneChainBuilder from 'com/vividsolutions/jts/index/chain/MonotoneChainBuilder';
import CoordinateArrays from 'com/vividsolutions/jts/geom/CoordinateArrays';
import RobustDeterminant from 'com/vividsolutions/jts/algorithm/RobustDeterminant';
import Envelope from 'com/vividsolutions/jts/geom/Envelope';
import PointInRing from 'com/vividsolutions/jts/algorithm/PointInRing';
export default class MCPointInRing {
	constructor(...args) {
		(() => {
			this.ring = null;
			this.tree = null;
			this.crossings = 0;
			this.interval = new Interval();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [ring] = args;
						this.ring = ring;
						this.buildIndex();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [PointInRing];
	}
	testLineSegment(p, seg) {
		var xInt = null;
		var x1 = null;
		var y1 = null;
		var x2 = null;
		var y2 = null;
		var p1 = seg.p0;
		var p2 = seg.p1;
		x1 = p1.x - p.x;
		y1 = p1.y - p.y;
		x2 = p2.x - p.x;
		y2 = p2.y - p.y;
		if (y1 > 0 && y2 <= 0 || y2 > 0 && y1 <= 0) {
			xInt = RobustDeterminant.signOfDet2x2(x1, y1, x2, y2) / (y2 - y1);
			if (0.0 < xInt) {
				this.crossings++;
			}
		}
	}
	buildIndex() {
		this.tree = new Bintree();
		var pts = CoordinateArrays.removeRepeatedPoints(this.ring.getCoordinates());
		var mcList = MonotoneChainBuilder.getChains(pts);
		for (var i = 0; i < mcList.size(); i++) {
			var mc = mcList.get(i);
			var mcEnv = mc.getEnvelope();
			this.interval.min = mcEnv.getMinY();
			this.interval.max = mcEnv.getMaxY();
			this.tree.insert(this.interval, mc);
		}
	}
	testMonotoneChain(rayEnv, mcSelecter, mc) {
		mc.select(rayEnv, mcSelecter);
	}
	isInside(pt) {
		this.crossings = 0;
		var rayEnv = new Envelope(Double.NEGATIVE_INFINITY, Double.POSITIVE_INFINITY, pt.y, pt.y);
		this.interval.min = pt.y;
		this.interval.max = pt.y;
		var segs = this.tree.query(this.interval);
		var mcSelecter = new MCSelecter(pt);
		for (var i = segs.iterator(); i.hasNext(); ) {
			var mc = i.next();
			this.testMonotoneChain(rayEnv, mcSelecter, mc);
		}
		if (this.crossings % 2 === 1) {
			return true;
		}
		return false;
	}
	getClass() {
		return MCPointInRing;
	}
}

