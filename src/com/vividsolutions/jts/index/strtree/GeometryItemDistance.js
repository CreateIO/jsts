import DistanceOp from '../../operation/distance/DistanceOp';
import ItemDistance from './ItemDistance';
export default class GeometryItemDistance {
	get interfaces_() {
		return [ItemDistance];
	}
	distance(item1, item2) {
		var g1 = item1.getItem();
		var g2 = item2.getItem();
		return DistanceOp.distance(g1, g2);
	}
	getClass() {
		return GeometryItemDistance;
	}
}

