import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import IsValidOp from 'com/vividsolutions/jts/operation/valid/IsValidOp';
import ArrayList from 'java/util/ArrayList';
import Assert from 'com/vividsolutions/jts/util/Assert';
export default class SimpleNestedRingTester {
	constructor(...args) {
		(() => {
			this.graph = null;
			this.rings = new ArrayList();
			this.nestedPt = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [graph] = args;
						this.graph = graph;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getNestedPoint() {
		return this.nestedPt;
	}
	isNonNested() {
		for (var i = 0; i < this.rings.size(); i++) {
			var innerRing = this.rings.get(i);
			var innerRingPts = innerRing.getCoordinates();
			for (var j = 0; j < this.rings.size(); j++) {
				var searchRing = this.rings.get(j);
				var searchRingPts = searchRing.getCoordinates();
				if (innerRing === searchRing) continue;
				if (!innerRing.getEnvelopeInternal().intersects(searchRing.getEnvelopeInternal())) continue;
				var innerRingPt = IsValidOp.findPtNotNode(innerRingPts, searchRing, this.graph);
				Assert.isTrue(innerRingPt !== null, "Unable to find a ring point not a node of the search ring");
				var isInside = CGAlgorithms.isPointInRing(innerRingPt, searchRingPts);
				if (isInside) {
					this.nestedPt = innerRingPt;
					return false;
				}
			}
		}
		return true;
	}
	add(ring) {
		this.rings.add(ring);
	}
	getClass() {
		return SimpleNestedRingTester;
	}
}

