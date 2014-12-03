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

  return Object.freeze( {
    NEUTRAL_COLOR: Color.YELLOW, //Color to use for neutrally charged objects
    POSITIVE_COLOR: new Color( 255, 85, 0 ),
    NEGATIVE_COLOR: Color.BLUE,
    RED_COLORBLIND: new Color( 255, 85, 0 )// RED_COLORBLIND - Reddish color that also looks good in colorblind tests
  } );
} );
