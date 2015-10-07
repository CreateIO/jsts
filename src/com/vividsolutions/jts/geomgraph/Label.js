import Location from '../geom/Location';
import Position from './Position';
import TopologyLocation from './TopologyLocation';
export default class Label {
	constructor(...args) {
		(() => {
			this.elt = new Array(2);
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Label) {
						return ((...args) => {
							let [lbl] = args;
							this.elt[0] = new TopologyLocation(lbl.elt[0]);
							this.elt[1] = new TopologyLocation(lbl.elt[1]);
						})(...args);
					} else if (Number.isInteger(args[0])) {
						return ((...args) => {
							let [onLoc] = args;
							this.elt[0] = new TopologyLocation(onLoc);
							this.elt[1] = new TopologyLocation(onLoc);
						})(...args);
					}
				case 2:
					return ((...args) => {
						let [geomIndex, onLoc] = args;
						this.elt[0] = new TopologyLocation(Location.NONE);
						this.elt[1] = new TopologyLocation(Location.NONE);
						this.elt[geomIndex].setLocation(onLoc);
					})(...args);
				case 3:
					return ((...args) => {
						let [onLoc, leftLoc, rightLoc] = args;
						this.elt[0] = new TopologyLocation(onLoc, leftLoc, rightLoc);
						this.elt[1] = new TopologyLocation(onLoc, leftLoc, rightLoc);
					})(...args);
				case 4:
					return ((...args) => {
						let [geomIndex, onLoc, leftLoc, rightLoc] = args;
						this.elt[0] = new TopologyLocation(Location.NONE, Location.NONE, Location.NONE);
						this.elt[1] = new TopologyLocation(Location.NONE, Location.NONE, Location.NONE);
						this.elt[geomIndex].setLocations(onLoc, leftLoc, rightLoc);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static toLineLabel(label) {
		var lineLabel = new Label(Location.NONE);
		for (var i = 0; i < 2; i++) {
			lineLabel.setLocation(i, label.getLocation(i));
		}
		return lineLabel;
	}
	getGeometryCount() {
		var count = 0;
		if (!this.elt[0].isNull()) count++;
		if (!this.elt[1].isNull()) count++;
		return count;
	}
	setAllLocations(geomIndex, location) {
		this.elt[geomIndex].setAllLocations(location);
	}
	isNull(geomIndex) {
		return this.elt[geomIndex].isNull();
	}
	setAllLocationsIfNull(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [location] = args;
						this.setAllLocationsIfNull(0, location);
						this.setAllLocationsIfNull(1, location);
					})(...args);
				case 2:
					return ((...args) => {
						let [geomIndex, location] = args;
						this.elt[geomIndex].setAllLocationsIfNull(location);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	isLine(geomIndex) {
		return this.elt[geomIndex].isLine();
	}
	merge(lbl) {
		for (var i = 0; i < 2; i++) {
			if (this.elt[i] === null && lbl.elt[i] !== null) {
				this.elt[i] = new TopologyLocation(lbl.elt[i]);
			} else {
				this.elt[i].merge(lbl.elt[i]);
			}
		}
	}
	flip() {
		this.elt[0].flip();
		this.elt[1].flip();
	}
	getLocation(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geomIndex] = args;
						return this.elt[geomIndex].get(Position.ON);
					})(...args);
				case 2:
					return ((...args) => {
						let [geomIndex, posIndex] = args;
						return this.elt[geomIndex].get(posIndex);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	toString() {
		var buf = new StringBuffer();
		if (this.elt[0] !== null) {
			buf.append("A:");
			buf.append(this.elt[0].toString());
		}
		if (this.elt[1] !== null) {
			buf.append(" B:");
			buf.append(this.elt[1].toString());
		}
		return buf.toString();
	}
	isArea(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						return this.elt[0].isArea() || this.elt[1].isArea();
					})(...args);
				case 1:
					return ((...args) => {
						let [geomIndex] = args;
						return this.elt[geomIndex].isArea();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	isAnyNull(geomIndex) {
		return this.elt[geomIndex].isAnyNull();
	}
	setLocation(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [geomIndex, location] = args;
						this.elt[geomIndex].setLocation(Position.ON, location);
					})(...args);
				case 3:
					return ((...args) => {
						let [geomIndex, posIndex, location] = args;
						this.elt[geomIndex].setLocation(posIndex, location);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	isEqualOnSide(lbl, side) {
		return this.elt[0].isEqualOnSide(lbl.elt[0], side) && this.elt[1].isEqualOnSide(lbl.elt[1], side);
	}
	allPositionsEqual(geomIndex, loc) {
		return this.elt[geomIndex].allPositionsEqual(loc);
	}
	toLine(geomIndex) {
		if (this.elt[geomIndex].isArea()) this.elt[geomIndex] = new TopologyLocation(this.elt[geomIndex].location[0]);
	}
	getClass() {
		return Label;
	}
}

