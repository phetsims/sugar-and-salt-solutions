// Copyright 2002-2013, University of Colorado Boulder

/**
 * This node just shows the walls (sides and bottom) of the beaker
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var ColorConstants = require( 'SUN/ColorConstants' );

  // constants
  var RIM_OFFSET = 20;


  /**
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BeakerNode( beaker, modelViewTransform ) {

    var thisNode = this;
    Node.call( thisNode );

    // outline of the beaker, starting from upper left
    var beakerWidth = modelViewTransform.modelToViewDeltaX( beaker.width );
    var beakerHeight = modelViewTransform.modelToViewDeltaY( beaker.height );
    var outlineShape = new Shape()
      .moveTo( -(beakerWidth / 2 ) - RIM_OFFSET, -beakerHeight - RIM_OFFSET )
      .lineTo( -(beakerWidth / 2), -beakerHeight )
      .lineTo( -(beakerWidth / 2), 0 )
      .lineTo( beakerWidth / 2, 0 )
      .lineTo( beakerWidth / 2, -beakerHeight )
      .lineTo( (beakerWidth / 2) + RIM_OFFSET, -beakerHeight - RIM_OFFSET );
    thisNode.addChild( new Path( outlineShape,
      {
        stroke: ColorConstants.LIGHT_GRAY,
        lineWidth: 3,
        lineCap: 'round',
        lineJoin: 'round'
      } ) );

    thisNode.translation = modelViewTransform.modelToViewPosition( new Vector2( beaker.x, beaker.y ) );
  }

  return inherit( Node, BeakerNode );
} );


//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.view;
//
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Beaker;
//import edu.umd.cs.piccolo.PNode;
//
//import static java.awt.Color.lightGray;
//
///**
// * This node just shows the walls (sides and bottom) of the beaker
// *
// * @author Sam Reid
// */
//public class BeakerNode extends PNode {
//    public BeakerNode( ModelViewTransform transform, Beaker beaker ) {
//        addChild( new PhetPPath( transform.modelToView( beaker.getWallShape() ), lightGray ) );
//    }
//}
