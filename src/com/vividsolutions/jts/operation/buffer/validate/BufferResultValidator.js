import BufferDistanceValidator from 'com/vividsolutions/jts/operation/buffer/validate/BufferDistanceValidator';
import Polygon from 'com/vividsolutions/jts/geom/Polygon';
import MultiPolygon from 'com/vividsolutions/jts/geom/MultiPolygon';
import Envelope from 'com/vividsolutions/jts/geom/Envelope';
export default class BufferResultValidator {
	constructor(...args) {
		(() => {
			this.input = null;
			this.distance = null;
			this.result = null;
			this.isValid = true;
			this.errorMsg = null;
			this.errorLocation = null;
			this.errorIndicator = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 3:
					return ((...args) => {
						let [input, distance, result] = args;
						this.input = input;
						this.distance = distance;
						this.result = result;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get VERBOSE() {
		return false;
	}
	static get MAX_ENV_DIFF_FRAC() {
		return .012;
	}
	static isValidMsg(g, distance, result) {
		var validator = new BufferResultValidator(g, distance, result);
		if (!validator.isValid()) return validator.getErrorMessage();
		return null;
	}
	static isValid(g, distance, result) {
		var validator = new BufferResultValidator(g, distance, result);
		if (validator.isValid()) return true;
		return false;
	}
	isValid() {
		this.checkPolygonal();
		if (!this.isValid) return this.isValid;
		this.checkExpectedEmpty();
		if (!this.isValid) return this.isValid;
		this.checkEnvelope();
		if (!this.isValid) return this.isValid;
		this.checkArea();
		if (!this.isValid) return this.isValid;
		this.checkDistance();
		return this.isValid;
	}
	checkEnvelope() {
		if (this.distance < 0.0) return null;
		var padding = this.distance * BufferResultValidator.MAX_ENV_DIFF_FRAC;
		if (padding === 0.0) padding = 0.001;
		var expectedEnv = new Envelope(this.input.getEnvelopeInternal());
		expectedEnv.expandBy(this.distance);
		var bufEnv = new Envelope(this.result.getEnvelopeInternal());
		bufEnv.expandBy(padding);
		if (!bufEnv.contains(expectedEnv)) {
			this.isValid = false;
			this.errorMsg = "Buffer envelope is incorrect";
			this.errorIndicator = this.input.getFactory().toGeometry(bufEnv);
		}
		this.report("Envelope");
	}
	checkDistance() {
		var distValid = new BufferDistanceValidator(this.input, this.distance, this.result);
		if (!distValid.isValid()) {
			this.isValid = false;
			this.errorMsg = distValid.getErrorMessage();
			this.errorLocation = distValid.getErrorLocation();
			this.errorIndicator = distValid.getErrorIndicator();
		}
		this.report("Distance");
	}
	checkArea() {
		var inputArea = this.input.getArea();
		var resultArea = this.result.getArea();
		if (this.distance > 0.0 && inputArea > resultArea) {
			this.isValid = false;
			this.errorMsg = "Area of positive buffer is smaller than input";
			this.errorIndicator = this.result;
		}
		if (this.distance < 0.0 && inputArea < resultArea) {
			this.isValid = false;
			this.errorMsg = "Area of negative buffer is larger than input";
			this.errorIndicator = this.result;
		}
		this.report("Area");
	}
	checkPolygonal() {
		if (!(this.result instanceof Polygon || this.result instanceof MultiPolygon)) this.isValid = false;
		this.errorMsg = "Result is not polygonal";
		this.errorIndicator = this.result;
		this.report("Polygonal");
	}
	getErrorIndicator() {
		return this.errorIndicator;
	}
	getErrorLocation() {
		return this.errorLocation;
	}
	checkExpectedEmpty() {
		if (this.input.getDimension() >= 2) return null;
		if (this.distance > 0.0) return null;
		if (!this.result.isEmpty()) {
			this.isValid = false;
			this.errorMsg = "Result is non-empty";
			this.errorIndicator = this.result;
		}
		this.report("ExpectedEmpty");
	}
	report(checkName) {
		if (!BufferResultValidator.VERBOSE) return null;
		System.out.println("Check " + checkName + ": " + (this.isValid ? "passed" : "FAILED"));
	}
	getErrorMessage() {
		return this.errorMsg;
	}
	getClass() {
		return BufferResultValidator;
	}
}

