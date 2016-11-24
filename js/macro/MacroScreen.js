// Copyright 2014-2015, University of Colorado Boulder

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
  var Node = require( 'SCENERY/nodes/Node' );
  var SugarAndSaltSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSharedProperties' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var macroString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/macro' );

  /**
   * @constructor
   */
  function MacroScreen() {

    var options = {
      name: macroString,

      // Color recommendation from KL so that white sugar and salt will show against it.
      // Same color as geometric optics background.
      backgroundColorProperty: new Property( new Color( 0, 51, 153 ) )

      //TODO add homeScreenIcon
    };

    var layoutBounds = SugarAndSaltConstants.LAYOUT_BOUNDS;
    var aspectRatio = layoutBounds.width / layoutBounds.height;
    SugarAndSaltSharedProperties.sizeScale.set( 1 );

    Screen.call( this,
      function() { return new MacroModel( aspectRatio ); },
      function( model ) { return new MacroScreenView( model ); },
      options
    );
  }

  return inherit( Screen, MacroScreen );
} );