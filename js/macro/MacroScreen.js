// Copyright 2014-2017, University of Colorado Boulder

/**
 * Introductory (macro) module for sugar and salt solutions
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MacroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroModel' );
  var MacroScreenView = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/view/MacroScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var SugarAndSaltSolutionsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsConstants' );
  var SugarAndSaltSolutionsSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsSharedProperties' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

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

    var layoutBounds = SugarAndSaltSolutionsConstants.LAYOUT_BOUNDS;
    var aspectRatio = layoutBounds.width / layoutBounds.height;
    SugarAndSaltSolutionsSharedProperties.sizeScale.set( 1 );

    Screen.call( this,
      function() { return new MacroModel( aspectRatio ); },
      function( model ) { return new MacroScreenView( model ); },
      options
    );
  }

  sugarAndSaltSolutions.register( 'MacroScreen', MacroScreen );

  return inherit( Screen, MacroScreen );
} );