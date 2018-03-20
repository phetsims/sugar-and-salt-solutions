// Copyright 2014-2018, University of Colorado Boulder
/**
 * Color Constants Used by Different Spherical Particles
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (for Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  var ParticleColorConstants = Object.freeze( {
    NEUTRAL_COLOR: Color.YELLOW, //Color to use for neutrally charged objects
    POSITIVE_COLOR: PhetColorScheme.RED_COLORBLIND,
    NEGATIVE_COLOR: Color.BLUE
  } );

  sugarAndSaltSolutions.register( 'ParticleColorConstants', ParticleColorConstants );
  return ParticleColorConstants;
} );
