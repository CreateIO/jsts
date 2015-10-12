/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

import GeometryFactory from '../geom/GeometryFactory'
import PrecisionModel from '../geom/PrecisionModel'
import WKTParser from './WKTParser'

/**
 * Converts a geometry in Well-Known Text format to a {@link Geometry}.
 * <p>
 * <code>WKTReader</code> supports extracting <code>Geometry</code> objects
 * from either {@link Reader}s or {@link String}s. This allows it to function
 * as a parser to read <code>Geometry</code> objects from text blocks embedded
 * in other data formats (e.g. XML).
 */
export default class WKTReader {
  /*
   * A <code>WKTReader</code> is parameterized by a <code>GeometryFactory</code>,
   * to allow it to create <code>Geometry</code> objects of the appropriate
   * implementation. In particular, the <code>GeometryFactory</code> determines
   * the <code>PrecisionModel</code> and <code>SRID</code> that is used.
   * <P>
   *
   * @constructor
   */
  constructor(geometryFactory) {
    this.geometryFactory = geometryFactory || new GeometryFactory();
    this.precisionModel = this.geometryFactory.getPrecisionModel();
    this.parser = new WKTParser(this.geometryFactory);
  };
  
  /**
   * Reads a Well-Known Text representation of a {@link Geometry}
   *
   * @param {string}
   *          wkt a <Geometry Tagged Text> string (see the OpenGIS Simple Features
   *          Specification).
   * @return {jsts.geom.Geometry} a <code>Geometry</code> read from
   *         <code>string.</code>
   */
  read(wkt) {
    var geometry = this.parser.read(wkt);

    // TODO: port and use GeometryPrecisionReducer, this is a hack
    if (this.precisionModel.getType() === PrecisionModel.FIXED) {
      this.reducePrecision(geometry);
    }
    
    //console.log(geometry);

    return geometry;
  };

  reducePrecision(geometry) {
    var i, len;

    if (geometry.coordinate) {
      this.precisionModel.makePrecise(geometry.coordinate);
    } else if (geometry.points) {
      for (i = 0, len = geometry.points.coordinates.length; i < len; i++) {
        this.precisionModel.makePrecise(geometry.points.coordinates[i]);
      }
    } else if (geometry.geometries) {
      for (i = 0, len = geometry.geometries.length; i < len; i++) {
        this.reducePrecision(geometry.geometries[i]);
      }
    }
  };
}
