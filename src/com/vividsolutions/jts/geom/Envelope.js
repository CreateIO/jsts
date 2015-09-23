function Envelope(...args) {
	this.minx = null;
	this.maxx = null;
	this.miny = null;
	this.maxy = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p1, p2] = args;
				this.init(p1.x, p2.x, p1.y, p2.y);
			})(...args);
		case 4:
			return ((...args) => {
				let [x1, x2, y1, y2] = args;
				this.init(x1, x2, y1, y2);
			})(...args);
		case 1:
			if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					this.init(p.x, p.x, p.y, p.y);
				})(...args);
			} else if (args[0] instanceof Envelope) {
				return ((...args) => {
					let [env] = args;
					this.init(env);
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
				this.init();
			})(...args);
	}
}
module.exports = Envelope
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
Envelope.prototype.getArea = function () {
	return this.getWidth() * this.getHeight();
};
Envelope.prototype.equals = function (other) {
	if (!(other instanceof Envelope)) {
		return false;
	}
	var otherEnvelope = other;
	if (this.isNull()) {
		return otherEnvelope.isNull();
	}
	return this.maxx === otherEnvelope.getMaxX() && this.maxy === otherEnvelope.getMaxY() && this.minx === otherEnvelope.getMinX() && this.miny === otherEnvelope.getMinY();
};
Envelope.prototype.intersection = function (env) {
	if (this.isNull() || env.isNull() || !this.intersects(env)) return new Envelope();
	var intMinX = this.minx > env.minx ? this.minx : env.minx;
	var intMinY = this.miny > env.miny ? this.miny : env.miny;
	var intMaxX = this.maxx < env.maxx ? this.maxx : env.maxx;
	var intMaxY = this.maxy < env.maxy ? this.maxy : env.maxy;
	return new Envelope(intMinX, intMaxX, intMinY, intMaxY);
};
Envelope.prototype.isNull = function () {
	return this.maxx < this.minx;
};
Envelope.prototype.getMaxX = function () {
	return this.maxx;
};
Envelope.prototype.covers = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				if (this.isNull()) return false;
				return x >= this.minx && x <= this.maxx && y >= this.miny && y <= this.maxy;
			})(...args);
		case 1:
			if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					return this.covers(p.x, p.y);
				})(...args);
			} else if (args[0] instanceof Envelope) {
				return ((...args) => {
					let [other] = args;
					if (this.isNull() || other.isNull()) {
						return false;
					}
					return other.getMinX() >= this.minx && other.getMaxX() <= this.maxx && other.getMinY() >= this.miny && other.getMaxY() <= this.maxy;
				})(...args);
			}
	}
};
Envelope.prototype.intersects = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				if (this.isNull()) return false;
				return !(x > this.maxx || x < this.minx || y > this.maxy || y < this.miny);
			})(...args);
		case 1:
			if (args[0] instanceof Envelope) {
				return ((...args) => {
					let [other] = args;
					if (this.isNull() || other.isNull()) {
						return false;
					}
					return !(other.minx > this.maxx || other.maxx < this.minx || other.miny > this.maxy || other.maxy < this.miny);
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					return this.intersects(p.x, p.y);
				})(...args);
			}
	}
};
Envelope.prototype.getMinY = function () {
	return this.miny;
};
Envelope.prototype.getMinX = function () {
	return this.minx;
};
Envelope.prototype.expandToInclude = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				if (this.isNull()) {
					this.minx = x;
					this.maxx = x;
					this.miny = y;
					this.maxy = y;
				} else {
					if (x < this.minx) {
						this.minx = x;
					}
					if (x > this.maxx) {
						this.maxx = x;
					}
					if (y < this.miny) {
						this.miny = y;
					}
					if (y > this.maxy) {
						this.maxy = y;
					}
				}
			})(...args);
		case 1:
			if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					this.expandToInclude(p.x, p.y);
				})(...args);
			} else if (args[0] instanceof Envelope) {
				return ((...args) => {
					let [other] = args;
					if (other.isNull()) {
						return null;
					}
					if (this.isNull()) {
						this.minx = other.getMinX();
						this.maxx = other.getMaxX();
						this.miny = other.getMinY();
						this.maxy = other.getMaxY();
					} else {
						if (other.minx < this.minx) {
							this.minx = other.minx;
						}
						if (other.maxx > this.maxx) {
							this.maxx = other.maxx;
						}
						if (other.miny < this.miny) {
							this.miny = other.miny;
						}
						if (other.maxy > this.maxy) {
							this.maxy = other.maxy;
						}
					}
				})(...args);
			}
	}
};
Envelope.prototype.minExtent = function () {
	if (this.isNull()) return 0.0;
	var w = this.getWidth();
	var h = this.getHeight();
	if (w < h) return w;
	return h;
};
Envelope.prototype.getWidth = function () {
	if (this.isNull()) {
		return 0;
	}
	return this.maxx - this.minx;
};
Envelope.prototype.compareTo = function (o) {
	var env = o;
	if (this.isNull()) {
		if (env.isNull()) return 0;
		return -1;
	} else {
		if (env.isNull()) return 1;
	}
	if (this.minx < env.minx) return -1;
	if (this.minx > env.minx) return 1;
	if (this.miny < env.miny) return -1;
	if (this.miny > env.miny) return 1;
	if (this.maxx < env.maxx) return -1;
	if (this.maxx > env.maxx) return 1;
	if (this.maxy < env.maxy) return -1;
	if (this.maxy > env.maxy) return 1;
	return 0;
};
Envelope.prototype.overlaps = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				return this.intersects(x, y);
			})(...args);
		case 1:
			if (args[0] instanceof Envelope) {
				return ((...args) => {
					let [other] = args;
					return this.intersects(other);
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					return this.intersects(p);
				})(...args);
			}
	}
};
Envelope.prototype.translate = function (transX, transY) {
	if (this.isNull()) {
		return null;
	}
	this.init(this.getMinX() + transX, this.getMaxX() + transX, this.getMinY() + transY, this.getMaxY() + transY);
};
Envelope.prototype.toString = function () {
	return "Env[" + this.minx + " : " + this.maxx + ", " + this.miny + " : " + this.maxy + "]";
};
Envelope.prototype.setToNull = function () {
	this.minx = 0;
	this.maxx = -1;
	this.miny = 0;
	this.maxy = -1;
};
Envelope.prototype.getHeight = function () {
	if (this.isNull()) {
		return 0;
	}
	return this.maxy - this.miny;
};
Envelope.prototype.maxExtent = function () {
	if (this.isNull()) return 0.0;
	var w = this.getWidth();
	var h = this.getHeight();
	if (w > h) return w;
	return h;
};
Envelope.prototype.expandBy = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [deltaX, deltaY] = args;
				if (this.isNull()) return null;
				this.minx -= deltaX;
				this.maxx += deltaX;
				this.miny -= deltaY;
				this.maxy += deltaY;
				if (this.minx > this.maxx || this.miny > this.maxy) this.setToNull();
			})(...args);
		case 1:
			return ((...args) => {
				let [distance] = args;
				this.expandBy(distance, distance);
			})(...args);
	}
};
Envelope.prototype.contains = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				return this.covers(x, y);
			})(...args);
		case 1:
			if (args[0] instanceof Envelope) {
				return ((...args) => {
					let [other] = args;
					return this.covers(other);
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					return this.covers(p);
				})(...args);
			}
	}
};
Envelope.prototype.centre = function () {
	if (this.isNull()) return null;
	return new Coordinate((this.getMinX() + this.getMaxX()) / 2.0, (this.getMinY() + this.getMaxY()) / 2.0);
};
Envelope.prototype.init = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p1, p2] = args;
				this.init(p1.x, p2.x, p1.y, p2.y);
			})(...args);
		case 4:
			return ((...args) => {
				let [x1, x2, y1, y2] = args;
				if (x1 < x2) {
					this.minx = x1;
					this.maxx = x2;
				} else {
					this.minx = x2;
					this.maxx = x1;
				}
				if (y1 < y2) {
					this.miny = y1;
					this.maxy = y2;
				} else {
					this.miny = y2;
					this.maxy = y1;
				}
			})(...args);
		case 1:
			if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					this.init(p.x, p.x, p.y, p.y);
				})(...args);
			} else if (args[0] instanceof Envelope) {
				return ((...args) => {
					let [env] = args;
					this.minx = env.minx;
					this.maxx = env.maxx;
					this.miny = env.miny;
					this.maxy = env.maxy;
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
				this.setToNull();
			})(...args);
	}
};
Envelope.prototype.getMaxY = function () {
	return this.maxy;
};
Envelope.prototype.distance = function (env) {
	if (this.intersects(env)) return 0;
	var dx = 0.0;
	if (this.maxx < env.minx) dx = env.minx - this.maxx; else if (this.minx > env.maxx) dx = this.minx - env.maxx;
	var dy = 0.0;
	if (this.maxy < env.miny) dy = env.miny - this.maxy; else if (this.miny > env.maxy) dy = this.miny - env.maxy;
	if (dx === 0.0) return dy;
	if (dy === 0.0) return dx;
	return Math.sqrt(dx * dx + dy * dy);
};
Envelope.prototype.hashCode = function () {
	var result = 17;
	result = 37 * result + Coordinate.hashCode(this.minx);
	result = 37 * result + Coordinate.hashCode(this.maxx);
	result = 37 * result + Coordinate.hashCode(this.miny);
	result = 37 * result + Coordinate.hashCode(this.maxy);
	return result;
};
Envelope.intersects = function (...args) {
	switch (args.length) {
		case 4:
			return ((...args) => {
				let [p1, p2, q1, q2] = args;
				var minq = Math.min(q1.x, q2.x);
				var maxq = Math.max(q1.x, q2.x);
				var minp = Math.min(p1.x, p2.x);
				var maxp = Math.max(p1.x, p2.x);
				if (minp > maxq) return false;
				if (maxp < minq) return false;
				minq = Math.min(q1.y, q2.y);
				maxq = Math.max(q1.y, q2.y);
				minp = Math.min(p1.y, p2.y);
				maxp = Math.max(p1.y, p2.y);
				if (minp > maxq) return false;
				if (maxp < minq) return false;
				return true;
			})(...args);
		case 3:
			return ((...args) => {
				let [p1, p2, q] = args;
				if (q.x >= (p1.x < p2.x ? p1.x : p2.x) && q.x <= (p1.x > p2.x ? p1.x : p2.x) && q.y >= (p1.y < p2.y ? p1.y : p2.y) && q.y <= (p1.y > p2.y ? p1.y : p2.y)) {
					return true;
				}
				return false;
			})(...args);
	}
};
Envelope.serialVersionUID = 5873921885273102420;

