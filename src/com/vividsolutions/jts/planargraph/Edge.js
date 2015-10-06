import Node from 'com/vividsolutions/jts/planargraph/Node';
import GraphComponent from 'com/vividsolutions/jts/planargraph/GraphComponent';
export default class Edge extends GraphComponent {
	constructor(...args) {
		super();
		(() => {
			this.dirEdge = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 2:
					return ((...args) => {
						let [de0, de1] = args;
						this.setDirectedEdges(de0, de1);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	isRemoved() {
		return this.dirEdge === null;
	}
	setDirectedEdges(de0, de1) {
		this.dirEdge = [de0, de1];
		de0.setEdge(this);
		de1.setEdge(this);
		de0.setSym(de1);
		de1.setSym(de0);
		de0.getFromNode().addOutEdge(de0);
		de1.getFromNode().addOutEdge(de1);
	}
	getDirEdge(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Node) {
						return ((...args) => {
							let [fromNode] = args;
							if (this.dirEdge[0].getFromNode() === fromNode) return this.dirEdge[0];
							if (this.dirEdge[1].getFromNode() === fromNode) return this.dirEdge[1];
							return null;
						})(...args);
					} else if (Number.isInteger(args[0])) {
						return ((...args) => {
							let [i] = args;
							return this.dirEdge[i];
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	remove() {
		this.dirEdge = null;
	}
	getOppositeNode(node) {
		if (this.dirEdge[0].getFromNode() === node) return this.dirEdge[0].getToNode();
		if (this.dirEdge[1].getFromNode() === node) return this.dirEdge[1].getToNode();
		return null;
	}
}

