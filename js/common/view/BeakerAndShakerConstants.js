// Copyright 2014-2018, University of Colorado Boulder
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
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  var BeakerAndShakerConstants = Object.freeze( {
    WATER_COLOR: new Color( 179, 239, 243 ),
    CONTROL_FONT: new PhetFont( 16 )
  } );
  sugarAndSaltSolutions.register( 'BeakerAndShakerConstants', BeakerAndShakerConstants );

  return BeakerAndShakerConstants;

} )
;
