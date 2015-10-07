import CoordinateList from '../geom/CoordinateList';
import Geometry from '../geom/Geometry';
import Arrays from 'java/util/Arrays';
import Collection from 'java/util/Collection';
import IncrementalDelaunayTriangulator from './IncrementalDelaunayTriangulator';
import QuadEdgeSubdivision from './quadedge/QuadEdgeSubdivision';
import Vertex from './quadedge/Vertex';
import CoordinateArrays from '../geom/CoordinateArrays';
import ArrayList from 'java/util/ArrayList';
import Envelope from '../geom/Envelope';
export default class DelaunayTriangulationBuilder {
	constructor(...args) {
		(() => {
			this.siteCoords = null;
			this.tolerance = 0.0;
			this.subdiv = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static extractUniqueCoordinates(geom) {
		if (geom === null) return new CoordinateList();
		var coords = geom.getCoordinates();
		return DelaunayTriangulationBuilder.unique(coords);
	}
	static envelope(coords) {
		var env = new Envelope();
		for (var i = coords.iterator(); i.hasNext(); ) {
			var coord = i.next();
			env.expandToInclude(coord);
		}
		return env;
	}
	static unique(coords) {
		var coordsCopy = CoordinateArrays.copyDeep(coords);
		Arrays.sort(coordsCopy);
		var coordList = new CoordinateList(coordsCopy, false);
		return coordList;
	}
	static toVertices(coords) {
		var verts = new ArrayList();
		for (var i = coords.iterator(); i.hasNext(); ) {
			var coord = i.next();
			verts.add(new Vertex(coord));
		}
		return verts;
	}
	create() {
		if (this.subdiv !== null) return null;
		var siteEnv = DelaunayTriangulationBuilder.envelope(this.siteCoords);
		var vertices = DelaunayTriangulationBuilder.toVertices(this.siteCoords);
		this.subdiv = new QuadEdgeSubdivision(siteEnv, this.tolerance);
		var triangulator = new IncrementalDelaunayTriangulator(this.subdiv);
		triangulator.insertSites(vertices);
	}
	setTolerance(tolerance) {
		this.tolerance = tolerance;
	}
	setSites(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Geometry) {
						return ((...args) => {
							let [geom] = args;
							this.siteCoords = DelaunayTriangulationBuilder.extractUniqueCoordinates(geom);
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(Collection) > -1) {
						return ((...args) => {
							let [coords] = args;
							this.siteCoords = DelaunayTriangulationBuilder.unique(CoordinateArrays.toCoordinateArray(coords));
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getEdges(geomFact) {
		this.create();
		return this.subdiv.getEdges(geomFact);
	}
	getSubdivision() {
		this.create();
		return this.subdiv;
	}
	getTriangles(geomFact) {
		this.create();
		return this.subdiv.getTriangles(geomFact);
	}
	getClass() {
		return DelaunayTriangulationBuilder;
	}
}

