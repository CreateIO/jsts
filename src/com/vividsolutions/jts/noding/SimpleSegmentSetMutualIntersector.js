function SimpleSegmentSetMutualIntersector(segStrings) {
	this.baseSegStrings = null;
	if (arguments.length === 0) return;
	this.baseSegStrings = segStrings;
}
module.exports = SimpleSegmentSetMutualIntersector
SimpleSegmentSetMutualIntersector.prototype.intersect = function (ss0, ss1, segInt) {
	var pts0 = ss0.getCoordinates();
	var pts1 = ss1.getCoordinates();
	for (var i0 = 0; i0 < pts0.length - 1; i0++) {
		for (var i1 = 0; i1 < pts1.length - 1; i1++) {
			segInt.processIntersections(ss0, i0, ss1, i1);
			if (segInt.isDone()) return null;
		}
	}
};
SimpleSegmentSetMutualIntersector.prototype.process = function (segStrings, segInt) {
	for (var i = this.baseSegStrings.iterator(); i.hasNext(); ) {
		var baseSS = i.next();
		for (var j = segStrings.iterator(); j.hasNext(); ) {
			var ss = j.next();
			this.intersect(baseSS, ss, segInt);
			if (segInt.isDone()) return null;
		}
	}
};
