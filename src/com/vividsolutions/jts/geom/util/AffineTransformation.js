function AffineTransformation(...args) {
	this.m00 = null;
	this.m01 = null;
	this.m02 = null;
	this.m10 = null;
	this.m11 = null;
	this.m12 = null;
	switch (args.length) {
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [matrix] = args;
					this.m00 = matrix[0];
					this.m01 = matrix[1];
					this.m02 = matrix[2];
					this.m10 = matrix[3];
					this.m11 = matrix[4];
					this.m12 = matrix[5];
				})(...args);
			} else if (args[0] instanceof AffineTransformation) {
				return ((...args) => {
					let [trans] = args;
					this.setTransformation(trans);
				})(...args);
			}
		case 6:
			if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [m00, m01, m02, m10, m11, m12] = args;
					this.setTransformation(m00, m01, m02, m10, m11, m12);
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [src0, src1, src2, dest0, dest1, dest2] = args;
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
				this.setToIdentity();
			})(...args);
	}
}
module.exports = AffineTransformation
var NoninvertibleTransformationException = require('com/vividsolutions/jts/geom/util/NoninvertibleTransformationException');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Exception = require('java/lang/Exception');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
var Assert = require('com/vividsolutions/jts/util/Assert');
AffineTransformation.prototype.setToReflectionBasic = function (x0, y0, x1, y1) {
	if (x0 === x1 && y0 === y1) {
		throw new IllegalArgumentException("Reflection line points must be distinct");
	}
	var dx = x1 - x0;
	var dy = y1 - y0;
	var d = Math.sqrt(dx * dx + dy * dy);
	var sin = dy / d;
	var cos = dx / d;
	var cs2 = 2 * sin * cos;
	var c2s2 = cos * cos - sin * sin;
	this.m00 = c2s2;
	this.m01 = cs2;
	this.m02 = 0.0;
	this.m10 = cs2;
	this.m11 = -c2s2;
	this.m12 = 0.0;
	return this;
};
AffineTransformation.prototype.getInverse = function () {
	var det = this.getDeterminant();
	if (det === 0) throw new NoninvertibleTransformationException("Transformation is non-invertible");
	var im00 = this.m11 / det;
	var im10 = -this.m10 / det;
	var im01 = -this.m01 / det;
	var im11 = this.m00 / det;
	var im02 = (this.m01 * this.m12 - this.m02 * this.m11) / det;
	var im12 = (-this.m00 * this.m12 + this.m10 * this.m02) / det;
	return new AffineTransformation(im00, im01, im02, im10, im11, im12);
};
AffineTransformation.prototype.compose = function (trans) {
	var mp00 = trans.m00 * this.m00 + trans.m01 * this.m10;
	var mp01 = trans.m00 * this.m01 + trans.m01 * this.m11;
	var mp02 = trans.m00 * this.m02 + trans.m01 * this.m12 + trans.m02;
	var mp10 = trans.m10 * this.m00 + trans.m11 * this.m10;
	var mp11 = trans.m10 * this.m01 + trans.m11 * this.m11;
	var mp12 = trans.m10 * this.m02 + trans.m11 * this.m12 + trans.m12;
	this.m00 = mp00;
	this.m01 = mp01;
	this.m02 = mp02;
	this.m10 = mp10;
	this.m11 = mp11;
	this.m12 = mp12;
	return this;
};
AffineTransformation.prototype.equals = function (obj) {
	if (obj === null) return false;
	if (!(obj instanceof AffineTransformation)) return false;
	var trans = obj;
	return this.m00 === trans.m00 && this.m01 === trans.m01 && this.m02 === trans.m02 && this.m10 === trans.m10 && this.m11 === trans.m11 && this.m12 === trans.m12;
};
AffineTransformation.prototype.setToScale = function (xScale, yScale) {
	this.m00 = xScale;
	this.m01 = 0.0;
	this.m02 = 0.0;
	this.m10 = 0.0;
	this.m11 = yScale;
	this.m12 = 0.0;
	return this;
};
AffineTransformation.prototype.isIdentity = function () {
	return this.m00 === 1 && this.m01 === 0 && this.m02 === 0 && this.m10 === 0 && this.m11 === 1 && this.m12 === 0;
};
AffineTransformation.prototype.scale = function (xScale, yScale) {
	this.compose(AffineTransformation.scaleInstance(xScale, yScale));
	return this;
};
AffineTransformation.prototype.setToIdentity = function () {
	this.m00 = 1.0;
	this.m01 = 0.0;
	this.m02 = 0.0;
	this.m10 = 0.0;
	this.m11 = 1.0;
	this.m12 = 0.0;
	return this;
};
AffineTransformation.prototype.isGeometryChanged = function () {
	return true;
};
AffineTransformation.prototype.setTransformation = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [trans] = args;
				this.m00 = trans.m00;
				this.m01 = trans.m01;
				this.m02 = trans.m02;
				this.m10 = trans.m10;
				this.m11 = trans.m11;
				this.m12 = trans.m12;
				return this;
			})(...args);
		case 6:
			return ((...args) => {
				let [m00, m01, m02, m10, m11, m12] = args;
				this.m00 = m00;
				this.m01 = m01;
				this.m02 = m02;
				this.m10 = m10;
				this.m11 = m11;
				this.m12 = m12;
				return this;
			})(...args);
	}
};
AffineTransformation.prototype.setToRotation = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [sinTheta, cosTheta] = args;
				this.m00 = cosTheta;
				this.m01 = -sinTheta;
				this.m02 = 0.0;
				this.m10 = sinTheta;
				this.m11 = cosTheta;
				this.m12 = 0.0;
				return this;
			})(...args);
		case 4:
			return ((...args) => {
				let [sinTheta, cosTheta, x, y] = args;
				this.m00 = cosTheta;
				this.m01 = -sinTheta;
				this.m02 = x - x * cosTheta + y * sinTheta;
				this.m10 = sinTheta;
				this.m11 = cosTheta;
				this.m12 = y - x * sinTheta - y * cosTheta;
				return this;
			})(...args);
		case 1:
			return ((...args) => {
				let [theta] = args;
				this.setToRotation(Math.sin(theta), Math.cos(theta));
				return this;
			})(...args);
		case 3:
			return ((...args) => {
				let [theta, x, y] = args;
				this.setToRotation(Math.sin(theta), Math.cos(theta), x, y);
				return this;
			})(...args);
	}
};
AffineTransformation.prototype.getMatrixEntries = function () {
	return [this.m00, this.m01, this.m02, this.m10, this.m11, this.m12];
};
AffineTransformation.prototype.filter = function (seq, i) {
	this.transform(seq, i);
};
AffineTransformation.prototype.rotate = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [sinTheta, cosTheta] = args;
				this.compose(AffineTransformation.rotationInstance(sinTheta, cosTheta));
				return this;
			})(...args);
		case 4:
			return ((...args) => {
				let [sinTheta, cosTheta, x, y] = args;
				this.compose(AffineTransformation.rotationInstance(sinTheta, cosTheta));
				return this;
			})(...args);
		case 1:
			return ((...args) => {
				let [theta] = args;
				this.compose(AffineTransformation.rotationInstance(theta));
				return this;
			})(...args);
		case 3:
			return ((...args) => {
				let [theta, x, y] = args;
				this.compose(AffineTransformation.rotationInstance(theta, x, y));
				return this;
			})(...args);
	}
};
AffineTransformation.prototype.getDeterminant = function () {
	return this.m00 * this.m11 - this.m01 * this.m10;
};
AffineTransformation.prototype.composeBefore = function (trans) {
	var mp00 = this.m00 * trans.m00 + this.m01 * trans.m10;
	var mp01 = this.m00 * trans.m01 + this.m01 * trans.m11;
	var mp02 = this.m00 * trans.m02 + this.m01 * trans.m12 + this.m02;
	var mp10 = this.m10 * trans.m00 + this.m11 * trans.m10;
	var mp11 = this.m10 * trans.m01 + this.m11 * trans.m11;
	var mp12 = this.m10 * trans.m02 + this.m11 * trans.m12 + this.m12;
	this.m00 = mp00;
	this.m01 = mp01;
	this.m02 = mp02;
	this.m10 = mp10;
	this.m11 = mp11;
	this.m12 = mp12;
	return this;
};
AffineTransformation.prototype.setToShear = function (xShear, yShear) {
	this.m00 = 1.0;
	this.m01 = xShear;
	this.m02 = 0.0;
	this.m10 = yShear;
	this.m11 = 1.0;
	this.m12 = 0.0;
	return this;
};
AffineTransformation.prototype.isDone = function () {
	return false;
};
AffineTransformation.prototype.clone = function () {
	try {
		return AffineTransformation.super_.prototype.clone.call(this);
	} catch (e) {
		if (e instanceof Exception) {
			Assert.shouldNeverReachHere();
		}
	} finally {}
	return null;
};
AffineTransformation.prototype.translate = function (x, y) {
	this.compose(AffineTransformation.translationInstance(x, y));
	return this;
};
AffineTransformation.prototype.setToReflection = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				if (x === 0.0 && y === 0.0) {
					throw new IllegalArgumentException("Reflection vector must be non-zero");
				}
				if (x === y) {
					this.m00 = 0.0;
					this.m01 = 1.0;
					this.m02 = 0.0;
					this.m10 = 1.0;
					this.m11 = 0.0;
					this.m12 = 0.0;
					return this;
				}
				var d = Math.sqrt(x * x + y * y);
				var sin = y / d;
				var cos = x / d;
				this.rotate(-sin, cos);
				this.scale(1, -1);
				this.rotate(sin, cos);
				return this;
			})(...args);
		case 4:
			return ((...args) => {
				let [x0, y0, x1, y1] = args;
				if (x0 === x1 && y0 === y1) {
					throw new IllegalArgumentException("Reflection line points must be distinct");
				}
				this.setToTranslation(-x0, -y0);
				var dx = x1 - x0;
				var dy = y1 - y0;
				var d = Math.sqrt(dx * dx + dy * dy);
				var sin = dy / d;
				var cos = dx / d;
				this.rotate(-sin, cos);
				this.scale(1, -1);
				this.rotate(sin, cos);
				this.translate(x0, y0);
				return this;
			})(...args);
	}
};
AffineTransformation.prototype.toString = function () {
	return "AffineTransformation[[" + this.m00 + ", " + this.m01 + ", " + this.m02 + "], [" + this.m10 + ", " + this.m11 + ", " + this.m12 + "]]";
};
AffineTransformation.prototype.setToTranslation = function (dx, dy) {
	this.m00 = 1.0;
	this.m01 = 0.0;
	this.m02 = dx;
	this.m10 = 0.0;
	this.m11 = 1.0;
	this.m12 = dy;
	return this;
};
AffineTransformation.prototype.shear = function (xShear, yShear) {
	this.compose(AffineTransformation.shearInstance(xShear, yShear));
	return this;
};
AffineTransformation.prototype.transform = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof Coordinate && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [src, dest] = args;
					var xp = this.m00 * src.x + this.m01 * src.y + this.m02;
					var yp = this.m10 * src.x + this.m11 * src.y + this.m12;
					dest.x = xp;
					dest.y = yp;
					return dest;
				})(...args);
			} else if (args[0] instanceof CoordinateSequence && Number.isInteger(args[1])) {
				return ((...args) => {
					let [seq, i] = args;
					var xp = this.m00 * seq.getOrdinate(i, 0) + this.m01 * seq.getOrdinate(i, 1) + this.m02;
					var yp = this.m10 * seq.getOrdinate(i, 0) + this.m11 * seq.getOrdinate(i, 1) + this.m12;
					seq.setOrdinate(i, 0, xp);
					seq.setOrdinate(i, 1, yp);
				})(...args);
			}
		case 1:
			return ((...args) => {
				let [g] = args;
				var g2 = g.clone();
				g2.apply(this);
				return g2;
			})(...args);
	}
};
AffineTransformation.prototype.reflect = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				this.compose(AffineTransformation.reflectionInstance(x, y));
				return this;
			})(...args);
		case 4:
			return ((...args) => {
				let [x0, y0, x1, y1] = args;
				this.compose(AffineTransformation.reflectionInstance(x0, y0, x1, y1));
				return this;
			})(...args);
	}
};
AffineTransformation.translationInstance = function (x, y) {
	var trans = new AffineTransformation();
	trans.setToTranslation(x, y);
	return trans;
};
AffineTransformation.shearInstance = function (xShear, yShear) {
	var trans = new AffineTransformation();
	trans.setToShear(xShear, yShear);
	return trans;
};
AffineTransformation.reflectionInstance = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				var trans = new AffineTransformation();
				trans.setToReflection(x, y);
				return trans;
			})(...args);
		case 4:
			return ((...args) => {
				let [x0, y0, x1, y1] = args;
				var trans = new AffineTransformation();
				trans.setToReflection(x0, y0, x1, y1);
				return trans;
			})(...args);
	}
};
AffineTransformation.rotationInstance = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [sinTheta, cosTheta] = args;
				var trans = new AffineTransformation();
				trans.setToRotation(sinTheta, cosTheta);
				return trans;
			})(...args);
		case 4:
			return ((...args) => {
				let [sinTheta, cosTheta, x, y] = args;
				var trans = new AffineTransformation();
				trans.setToRotation(sinTheta, cosTheta, x, y);
				return trans;
			})(...args);
		case 1:
			return ((...args) => {
				let [theta] = args;
				return AffineTransformation.rotationInstance(Math.sin(theta), Math.cos(theta));
			})(...args);
		case 3:
			return ((...args) => {
				let [theta, x, y] = args;
				return AffineTransformation.rotationInstance(Math.sin(theta), Math.cos(theta), x, y);
			})(...args);
	}
};
AffineTransformation.scaleInstance = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [xScale, yScale] = args;
				var trans = new AffineTransformation();
				trans.setToScale(xScale, yScale);
				return trans;
			})(...args);
		case 4:
			return ((...args) => {
				let [xScale, yScale, x, y] = args;
				var trans = new AffineTransformation();
				trans.translate(-x, -y);
				trans.scale(xScale, yScale);
				trans.translate(x, y);
				return trans;
			})(...args);
	}
};

