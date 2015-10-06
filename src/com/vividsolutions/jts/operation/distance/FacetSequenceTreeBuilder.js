import LineString from 'com/vividsolutions/jts/geom/LineString';
import FacetSequence from 'com/vividsolutions/jts/operation/distance/FacetSequence';
import STRtree from 'com/vividsolutions/jts/index/strtree/STRtree';
import Point from 'com/vividsolutions/jts/geom/Point';
import ArrayList from 'java/util/ArrayList';
export default class FacetSequenceTreeBuilder {
	get interfaces_() {
		return [];
	}
	static get FACET_SEQUENCE_SIZE() {
		return 6;
	}
	static get STR_TREE_NODE_CAPACITY() {
		return 4;
	}
	static addFacetSequences(pts, sections) {
		var i = 0;
		var size = pts.size();
		while (i <= size - 1) {
			var end = i + FacetSequenceTreeBuilder.FACET_SEQUENCE_SIZE + 1;
			if (end >= size - 1) end = size;
			var sect = new FacetSequence(pts, i, end);
			sections.add(sect);
			i = i + FacetSequenceTreeBuilder.FACET_SEQUENCE_SIZE;
		}
	}
	static computeFacetSequences(g) {
		var sections = new ArrayList();
		g.apply(new (class {
			filter(geom) {
				var seq = null;
				if (geom instanceof LineString) {
					seq = geom.getCoordinateSequence();
					FacetSequenceTreeBuilder.addFacetSequences(seq, sections);
				} else if (geom instanceof Point) {
					seq = geom.getCoordinateSequence();
					FacetSequenceTreeBuilder.addFacetSequences(seq, sections);
				}
			}
		})());
		return sections;
	}
	static build(g) {
		var tree = new STRtree(FacetSequenceTreeBuilder.STR_TREE_NODE_CAPACITY);
		var sections = FacetSequenceTreeBuilder.computeFacetSequences(g);
		for (var i = sections.iterator(); i.hasNext(); ) {
			var section = i.next();
			tree.insert(section.getEnvelope(), section);
		}
		tree.build();
		return tree;
	}
	getClass() {
		return FacetSequenceTreeBuilder;
	}
}

