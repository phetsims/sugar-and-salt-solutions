//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Introductory (macro) module for sugar and salt solutions
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MacroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroModel' );
  var MacroScreenView = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/view/MacroScreenView' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SugarAndSaltSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSharedProperties' );

  // strings
  var macroScreenTitle = require( 'string!SUGAR_AND_SALT_SOLUTIONS/macro' );

  /**
   * Creates the icon for this screen.
   * @returns {Node}
   */
  var createScreenIcon = function() {

    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;

    //TODO Macro Icon
    var background = new Rectangle( 0, 0, width, height, { fill: 'blue' } );
    return new Node( { children: [ background] } );

  };

  /**
   * @constructor
   */
  function MacroScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.

    //Color recommendation from KL so that white sugar and salt will show against it.
    // Same color as geometric optics background
    var backgroundColor = new Color( 0, 51, 153 );
    var layoutBounds = SugarAndSaltConstants.LAYOUT_BOUNDS;
    var aspectRatio = layoutBounds.width / layoutBounds.height;
    SugarAndSaltSharedProperties.sizeScale.set( 1 );
    Screen.call( this, macroScreenTitle, createScreenIcon(),
      function() { return new MacroModel( aspectRatio ); },
      function( model ) { return new MacroScreenView( model ); },
      { backgroundColor: backgroundColor }
    );
  }

  return inherit( Screen, MacroScreen );
} );