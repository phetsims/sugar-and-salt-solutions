// Copyright 2002-2011, University of Colorado
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

  return Object.freeze( {
    NEUTRAL_COLOR: Color.YELLOW, //Color to use for neutrally charged objects
    POSITIVE_COLOR: PhetColorScheme.RED_COLORBLIND,
    NEGATIVE_COLOR: Color.BLUE
  } );
} );
