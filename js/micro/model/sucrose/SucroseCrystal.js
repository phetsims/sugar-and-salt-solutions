//  Copyright 2002-2014, University of Colorado Boulder
/**
 * This crystal for sugar updates the positions of the molecules to ensure they move together
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Crystal' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Formula' );
  var Units = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Units' );
  var SugarAndSaltSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSharedProperties' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sucrose/Sucrose' );

  /**
   *
   * @param {Vector2} position
   * @param {number} angle
   * @constructor
   */
  function SucroseCrystal( position, angle ) {
    //Sugar size is actually about 1 nm, but we need to make them closer together or the sucrose lattices look disjoint
    //Also, scale everything by the model sizeScale, including distances between atoms
    Crystal.call( this, Formula.SUCROSE, position,

      //Spacing between adjacent sucrose molecules, in meters
      Units.nanometersToMeters( 0.5 ) * SugarAndSaltSharedProperties.sizeScale.get(),

      angle );
  }


  return inherit( Crystal, SucroseCrystal, {

    /**
     * @override
     * Create a new Sucrose to be added to the crystal
     * @param {Sucrose} original
     * @returns {Sucrose}
     */
    createPartner: function( original ) {
      return new Sucrose();
    },


    /**
     * @override
     * Create a single sucrose molecule to begin the crystal
     * @param type
     * @returns {Sucrose}
     */
    createConstituentParticle: function( type ) {
      return new Sucrose();
    }

  } );
} );