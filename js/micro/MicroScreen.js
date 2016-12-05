// Copyright 2015, University of Colorado Boulder

// Copyright 2002-2014, University of Colorado Boulder

/**
 * Micro tab that shows the NaCl ions and Sucrose molecules.
 * In order to efficiently re-use pre existing code from the Soluble Salts (AKA Salts and Solubility) project, we make the
 * following inaccurate encodings:
 * 1. Sugar is a subclass of Salt
 * 2. Sugar has two constituents, a "positive" sugar molecule and a "negative" sugar molecule
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/MicroModel' );
  var MicroScreenView = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/MicroScreenView' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Color = require( 'SCENERY/util/Color' );
  var SugarAndSaltSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSharedProperties' );
  var Property = require( 'AXON/Property' );

  // strings
  var microString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/micro' );

  /**
   * @constructor
   */
  function MicroScreen() {

    var options = {
      name: microString,
      backgroundColorProperty: new Property( new Color( 0, 51, 153 ) )
      //TODO add homeScreenIcon
    };

    var layoutBounds = SugarAndSaltConstants.LAYOUT_BOUNDS;
    var aspectRatio = layoutBounds.width / layoutBounds.height;
    SugarAndSaltSharedProperties.sizeScale.set( 0.35 );

    Screen.call( this,
      function() { return new MicroModel( aspectRatio ); },
      function( model ) { return new MicroScreenView( model ); },
      options
    );
  }

  return inherit( Screen, MicroScreen );
} );