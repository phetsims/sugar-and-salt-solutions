//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Property = require( 'AXON/Property' );
  var HSlider = require( 'SUN/HSlider' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var mockupImage = require( 'image!SUGAR_AND_SALT_SOLUTIONS/mockup-macro.png' );

  /**
   * @param {SugarAndSaltSolutionsModel} sugarAndSaltSolutionsModel
   * @constructor
   */
  function SugarAndSaltSolutionsScreenView( sugarAndSaltSolutionsModel ) {

    ScreenView.call( this, {layoutBounds: ScreenView.UPDATED_LAYOUT_BOUNDS.copy()} );

    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.2 );
    var image = new Image( mockupImage, {pickable: false} );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, {min: 0, max: 1}, {top: 10, left: 10} ) );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        sugarAndSaltSolutionsModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, SugarAndSaltSolutionsScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );