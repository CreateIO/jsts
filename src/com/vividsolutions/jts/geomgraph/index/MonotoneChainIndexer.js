function MonotoneChainIndexer() {
	if (arguments.length === 0) return;
}
module.exports = MonotoneChainIndexer
var ArrayList = require('java/util/ArrayList');
var Quadrant = require('com/vividsolutions/jts/geomgraph/Quadrant');
MonotoneChainIndexer.prototype.getChainStartIndices = function (pts) {
	var start = 0;
	var startIndexList = new ArrayList();
	startIndexList.add(new Integer(start));
	do {
		var last = this.findChainEnd(pts, start);
		startIndexList.add(new Integer(last));
		start = last;
	} while (start < pts.length - 1);
	var startIndex = MonotoneChainIndexer.toIntArray(startIndexList);
	return startIndex;
};
MonotoneChainIndexer.prototype.findChainEnd = function (pts, start) {
	var chainQuad = Quadrant.quadrant(pts[start], pts[start + 1]);
	var last = start + 1;
	while (last < pts.length) {
		var quad = Quadrant.quadrant(pts[last - 1], pts[last]);
		if (quad !== chainQuad) break;
		last++;
	}
	return last - 1;
};
MonotoneChainIndexer.toIntArray = function (list) {
	var array = [];
	for (var i = 0; i < array.length; i++) {
		array[i] = list.get(i).intValue();
	}
	return array;
};
