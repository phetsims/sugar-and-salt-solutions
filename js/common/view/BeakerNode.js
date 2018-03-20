// Copyright 2014-2018, University of Colorado Boulder

/**
 * This node just shows the walls (sides and bottom) of the beaker
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var ColorConstants = require( 'SUN/ColorConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BeakerNode( beaker, modelViewTransform ) {
    Node.call( this );
    this.addChild( new Path( modelViewTransform.modelToViewShape( beaker.getWallPath( beaker.topDelta ) ), {
        fill: ColorConstants.LIGHT_GRAY
      }
    ) );
  }

  sugarAndSaltSolutions.register( 'BeakerNode', BeakerNode );

  return inherit( Node, BeakerNode );
} );

