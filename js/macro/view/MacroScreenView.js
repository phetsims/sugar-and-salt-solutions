//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var HSlider = require( 'SUN/HSlider' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var BeakerAndShakerView = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/BeakerAndShakerView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );

  // images
  var mockupImage = require( 'image!SUGAR_AND_SALT_SOLUTIONS/mockup-macro.png' );

  /**
   * @param {MacroModel} macroModel
   * @constructor
   */
  function MacroScreenView( macroModel ) {

    var layoutBounds = ScreenView.UPDATED_LAYOUT_BOUNDS.copy();
    var modelScale = 0.75;
    var modelRefPoint = new Vector2( -macroModel.modelWidth / 2, -macroModel.inset );
    var viewPortPosition = new Vector2( layoutBounds.width * 0.40, layoutBounds.height - 255 );

    // Manually tuned so that the model part shows up in the left side of the canvas,
    // leaving enough room for controls, labels, and positioning it so it appears near the bottom

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( modelRefPoint, viewPortPosition, modelScale );

    //null to be removed TODO
    BeakerAndShakerView.call( this, macroModel, ScreenView.UPDATED_LAYOUT_BOUNDS.copy(), null, modelViewTransform );

    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.2 );
    var image = new Image( mockupImage, {pickable: false} );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, {min: 0, max: 1}, {top: 10, left: 10} ) );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        macroModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( BeakerAndShakerView, MacroScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );