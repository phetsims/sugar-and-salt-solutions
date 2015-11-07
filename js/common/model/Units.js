// Copyright 2014-2015, University of Colorado Boulder

/**
 * Utility class for converting units
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function Units() {

  }

  return inherit( Object, Units, {}, {
    //static methods
    /**
     * Convert picometers to meters (SI)
     * @param {number} picometers
     * @return {number}
     */
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
      return molesPerLiter / Units.litersToMetersCubed( 1.0 );
    }

  } );

} );

