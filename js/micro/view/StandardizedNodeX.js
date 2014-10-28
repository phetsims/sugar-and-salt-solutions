// Copyright 2002-2011, University of Colorado
/**
 * Node that translates its content so that in the x-direction the origin is at 0, the y direction is unchanged.
 * This is to help with layouts for nodes that don't default to this coordinate frame.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  function StandardizedNodeX( node ) {
    addChild( node );
    node.setOffset( -node.getFullBounds().getX(), node.getYOffset() );
  }

  return inherit( Node, StandardizedNodeX, {
  } );
} );

