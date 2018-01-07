// Copyright 2014-2017, University of Colorado Boulder
/**
 * This crystal for sugar updates the positions of the molecules to ensure they move together
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Crystal' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Formula' );
  var Glucose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/glucose/Glucose' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SugarAndSaltSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSharedProperties' );
  var Units = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Units' );

  /**
   *
   * @param {Vector2} position
   * @param {number} angle
   * @constructor
   */
  function GlucoseCrystal( position, angle ) {
    //Glucose is about half as big as sucrose and hence should be half as far away on the lattice
    Crystal.call( this, Formula.GLUCOSE, position,

      //Spacing between adjacent sucrose molecules, in meters
      Units.nanometersToMeters( 0.5 ) * SugarAndSaltSharedProperties.sizeScale.get() / 2,

      angle );
  }

  return inherit( Crystal, GlucoseCrystal, {

    /**
     * @override
     * Create a new Glucose to be added to the crystal
     * @param {Glucose} original
     * @returns {Glucose}
     */
    createPartner: function( original ) {
      return new Glucose();
    },

    /**
     * Create a single Glucose molecule to begin the crystal
     * @protected
     * @override
     * @param type
     * @returns {Glucose}
     */
    createConstituentParticle: function( type ) {
      return new Glucose();
    }
  } );
} );

