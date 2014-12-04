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
  var ColorConstants = require( 'SUN/ColorConstants' );

  /**
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BeakerNode( beaker, modelViewTransform ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.addChild( new Path( modelViewTransform.modelToViewShape( beaker.getWallPath( beaker.topDelta ) ), {
        fill: ColorConstants.LIGHT_GRAY
      }
    ) );
  }

  return inherit( Node, BeakerNode );
} );

