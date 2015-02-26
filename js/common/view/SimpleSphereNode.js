//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Sphere node used by both charge color and atom identity color
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property<Vector2>} positionProperty
   * @param {Node} image
   * @constructor
   */
  function SimpleSphereNode( modelViewTransform, positionProperty, imageNode ) {
    var thisNode = this;
    Node.call( thisNode, {
      children: [ imageNode ]
    } );
    positionProperty.link( function( position ) {
      var viewPoint = modelViewTransform.modelToViewPosition( position );
      thisNode.x = viewPoint.x - thisNode.bounds.width / 2;
      thisNode.y = viewPoint.y - thisNode.bounds.height / 2;
    } );
  }

  return inherit( Node, SimpleSphereNode );
} );