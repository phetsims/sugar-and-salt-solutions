//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Node that draws a shaded sphere in the location of the spherical particle.
 * It switches between showing color for the atomic identity or color for the
 * charge (blue = negative, red = positive, yellow = neutral)
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var AtomImageCache = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/AtomImageCache' );
  var SimpleSphereNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SimpleSphereNode' );

  /**
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @param {SphericalParticle} particle
   * @param {Property<boolean>} showChargeColorProperty   //Flag to show the color based on charge, or based on atom identity
   * @constructor
   */
  function SphericalParticleNode( modelViewTransform, particle, showChargeColorProperty ) {
    var thisNode = this;
    Node.call( thisNode );
    var chargeColorSphereNode = null;
    var atomColorSphereNode = null;
    var nodesAdded = false;

    //Use a cached image to improve performance for large molecules such as sucrose
    AtomImageCache.getAtomImage( modelViewTransform.modelToViewDeltaX( particle.radius * 2 ),
      particle.chargeColor, function( imageNode ) {
        chargeColorSphereNode = new SimpleSphereNode( modelViewTransform, particle.positionProperty, imageNode );
        if ( !nodesAdded && atomColorSphereNode ) {
          addSphereNodes();
        }
      } );

    AtomImageCache.getAtomImage( modelViewTransform.modelToViewDeltaX( particle.radius * 2 ),
      particle.color, function( imageNode ) {
        atomColorSphereNode = new SimpleSphereNode( modelViewTransform, particle.positionProperty, imageNode );
        if ( !nodesAdded && chargeColorSphereNode ) {
          addSphereNodes();
        }
      } );

    // add charge and atom nodes when both are asynchronously loaded
    function addSphereNodes() {
      nodesAdded = true;

      //Show the charge color, if user selected
      thisNode.addChild( chargeColorSphereNode );
      showChargeColorProperty.link( function( showChargeColor ) {
        chargeColorSphereNode.visible = showChargeColor;
      } );

      //Show the atom color, if user selected
      thisNode.addChild( atomColorSphereNode );
      showChargeColorProperty.link( function( showChargeColor ) {
        chargeColorSphereNode.visible = !showChargeColor;
      } );
    }
  }

  return inherit( Node, SphericalParticleNode );
} );
