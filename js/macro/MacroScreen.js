//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MacroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroModel' );
  var MacroScreenView = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/view/MacroScreenView' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var sugarAndSaltSolutionsSimString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions.name' );

  /**
   * @constructor
   */
  function SugarAndSaltSolutionsScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.

    //Color recommendation from KL so that white sugar and salt will show against it.
    // Same color as geometric optics background
    var backgroundColor = new Color( 0, 51, 153 );
    var icon = null;
    var layoutBounds = ScreenView.DEFAULT_LAYOUT_BOUNDS.copy();
    var aspectRatio = layoutBounds.width / layoutBounds.height;
    Screen.call( this, sugarAndSaltSolutionsSimString, icon,
      function() { return new MacroModel(aspectRatio); },
      function( model ) { return new MacroScreenView( model ); },
      { backgroundColor: backgroundColor }
    );
  }

  return inherit( Screen, SugarAndSaltSolutionsScreen );
} );