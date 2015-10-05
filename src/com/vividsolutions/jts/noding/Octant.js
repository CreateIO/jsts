function Octant() {
	if (arguments.length === 0) return;
}
module.exports = Octant
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
Octant.octant = function (...args) {
	switch (args.length) {
		case 2:
			if (!Number.isInteger(args[0]) && !Number.isInteger(args[1])) {
				return ((...args) => {
					let [dx, dy] = args;
					if (dx === 0.0 && dy === 0.0) throw new IllegalArgumentException("Cannot compute the octant for point ( " + dx + ", " + dy + " )");
					var adx = Math.abs(dx);
					var ady = Math.abs(dy);
					if (dx >= 0) {
						if (dy >= 0) {
							if (adx >= ady) return 0; else return 1;
						} else {
							if (adx >= ady) return 7; else return 6;
						}
					} else {
						if (dy >= 0) {
							if (adx >= ady) return 3; else return 2;
						} else {
							if (adx >= ady) return 4; else return 5;
						}
					}
				})(...args);
			} else if (args[0] instanceof Coordinate && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [p0, p1] = args;
					var dx = p1.x - p0.x;
					var dy = p1.y - p0.y;
					if (dx === 0.0 && dy === 0.0) throw new IllegalArgumentException("Cannot compute the octant for two identical points " + p0);
					return Octant.octant(dx, dy);
				})(...args);
			}
	}
};
