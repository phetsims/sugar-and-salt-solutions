// Copyright 2002-2011, University of Colorado
/**
 * BeakerAndShakerConstants is a collection of constants that are used across different
 * view nodes that make up BeakerAndShaker components
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  return Object.freeze( {
    WATER_COLOR: new Color( 179, 239, 243 ),
    CONTROL_FONT: new PhetFont( 16 )
  } );

} )
;
