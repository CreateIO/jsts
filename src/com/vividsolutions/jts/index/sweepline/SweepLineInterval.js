export default class SweepLineInterval {
	constructor(...args) {
		(() => {
			this.min = null;
			this.max = null;
			this.item = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [min, max] = args;
						overloads.call(this, min, max, null);
					})(...args);
				case 3:
					return ((...args) => {
						let [min, max, item] = args;
						this.min = min < max ? min : max;
						this.max = max > min ? max : min;
						this.item = item;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getMin() {
		return this.min;
	}
	getItem() {
		return this.item;
	}
	getMax() {
		return this.max;
	}
	getClass() {
		return SweepLineInterval;
	}
}

