// Copyright 2015-2018, University of Colorado Boulder
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
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<Vector2>} positionProperty
   * @param {Node} imageNode
   * @constructor
   */
  function SimpleSphereNode( modelViewTransform, positionProperty, imageNode ) {
    var self = this;
    Node.call( self, {
      children: [ imageNode ]
    } );
    positionProperty.link( function( position ) {
      var viewPoint = modelViewTransform.modelToViewPosition( position );
      self.x = viewPoint.x - self.bounds.width / 2;
      self.y = viewPoint.y - self.bounds.height / 2;
    } );
  }

  sugarAndSaltSolutions.register( 'SimpleSphereNode', SimpleSphereNode );

  return inherit( Node, SimpleSphereNode );
} );