// Copyright 2014-2018, University of Colorado Boulder
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
  var SugarAndSaltSolutionsSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsSharedProperties' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
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
      Units.nanometersToMeters( 0.5 ) * SugarAndSaltSolutionsSharedProperties.sizeScale.get() / 2,

      angle );
  }

  sugarAndSaltSolutions.register( 'GlucoseCrystal', GlucoseCrystal );
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

