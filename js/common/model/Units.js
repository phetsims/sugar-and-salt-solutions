// Copyright 2002-2011, University of Colorado
/**
 * Utility class for converting units
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );


  return inherit( Object, Units, {
//Convert picometers to meters (SI)
    picometersToMeters: function( picometers ) {
      return picometers * 1E-12;
    },
    nanometersToMeters: function( nanometers ) {
      return nanometers * 1E-9;
    },
    metersCubedToLiters: function( metersCubed ) {
      return metersCubed * 1000.0;
    },
    numberToMoles: function( number ) {
      return number / 6.02214179E23;
    },
    litersToMetersCubed: function( liters ) {
      return liters / 1000.0;
    },
    molesPerLiterToMolesPerMeterCubed: function( molesPerLiter ) {
      return molesPerLiter / litersToMetersCubed( 1.0 );
    }
  } );
} );

