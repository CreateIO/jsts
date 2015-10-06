export default class NumberUtil {
	get interfaces_() {
		return [];
	}
	static equalsWithTolerance(x1, x2, tolerance) {
		return Math.abs(x1 - x2) <= tolerance;
	}
	getClass() {
		return NumberUtil;
	}
}

