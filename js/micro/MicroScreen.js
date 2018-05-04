// Copyright 2015-2018, University of Colorado Boulder

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
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/MicroModel' );
  var MicroScreenView = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/MicroScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var SugarAndSaltSolutionsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsConstants' );
  var SugarAndSaltSolutionsSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsSharedProperties' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

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

    var layoutBounds = SugarAndSaltSolutionsConstants.LAYOUT_BOUNDS;
    var aspectRatio = layoutBounds.width / layoutBounds.height;
    SugarAndSaltSolutionsSharedProperties.sizeScaleProperty.set( 0.35 );

    Screen.call( this,
      function() { return new MicroModel( aspectRatio ); },
      function( model ) { return new MicroScreenView( model ); },
      options
    );
  }

  sugarAndSaltSolutions.register( 'MicroScreen', MicroScreen );
  return inherit( Screen, MicroScreen );
} );