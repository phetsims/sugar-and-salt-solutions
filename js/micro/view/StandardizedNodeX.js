// Copyright 2014-2015, University of Colorado Boulder
/**
 * Node that translates its content so that in the x-direction the origin is at 0, the y direction is unchanged.
 * This is to help with layouts for nodes that don't default to this coordinate frame.
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {Node} node
   * @constructor
   */
  function StandardizedNodeX( node ) {
    Node.call( this );
    this.addChild( node );
    node.x = -node.bounds.x;
    node.y = node.y;
  }

  sugarAndSaltSolutions.register( 'StandardizedNodeX', StandardizedNodeX );
  return inherit( Node, StandardizedNodeX );
} );
