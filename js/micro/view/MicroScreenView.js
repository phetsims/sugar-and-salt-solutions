// Copyright 2002-2014, University of Colorado Boulder

/**
 * Canvas for the "micro" tab of the sugar and salt solutions sim.  This shares
 * lots of functionality with the first tab, so much of that code is reused by extending BeakerAndShakerCanvas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BeakerAndShakerView = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/BeakerAndShakerView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var SphericalParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SphericalParticleNode' );

  /**
   *
   * @param {MicroModel} microModel
   * @constructor
   */
  function MicroScreenView( microModel ) {
    var layoutBounds = SugarAndSaltConstants.LAYOUT_BOUNDS;
    var modelScale = 0.70;
    var modelBounds = microModel.visibleRegion;
    var viewMinX = 45;
    var viewMinY = 155;
    var viewPortBounds = new Bounds2( viewMinX, viewMinY, viewMinX + layoutBounds.width * modelScale,
        viewMinY + (layoutBounds.height * modelScale) );

    var thisView = this;
    thisView.model = microModel;

    // Manually tuned so that the model part shows up in the left side of the canvas,
    // leaving enough room for controls, labels, and positioning it so it appears near the bottom
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelBounds, viewPortBounds );
    BeakerAndShakerView.call( thisView, microModel, layoutBounds, modelViewTransform );

    // TODO - All periodic table, kit selection,


    //When any spherical particle is added in the model, add graphics for them in the view
    thisView.model.sphericalParticles.addItemAddedListener( function( addedParticle ) {
       var  sphericalParticleNode = new SphericalParticleNode( modelViewTransform, addedParticle,
          thisView.model.showChargeColor );
        thisView.addChild( sphericalParticleNode );

      //Create the Node for the particle, and wire it up to be removed when the particle leaves the model
        thisView.model.sphericalParticles.addItemRemovedListener( function removalListener( removedParticle ) {
          if ( removedParticle === addedParticle ) {
            thisView.removeChild( sphericalParticleNode );
            thisView.model.sphericalParticles.removeItemRemovedListener( removalListener );
          }
        } );

    } );

  }

  return inherit( BeakerAndShakerView, MicroScreenView, {
    step: function( dt ) {
      // Handle view animation here.
    }
  } );

} );