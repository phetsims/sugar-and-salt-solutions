// Copyright 2002-2014, University of Colorado Boulder
/**
 * This crystal for Sodium Chloride salt updates the positions of the molecules to ensure they move as a crystal
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
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Chloride' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Sodium' );

  /**
   *
   * @param {Vector2} position
   * @param {number} angle
   * @constructor
   */
  function SodiumChlorideCrystal( position, angle ) {
    Crystal.call( this, Formula.SODIUM_CHLORIDE, position, new Chloride().radius + new Sodium().radius, angle );
  }

  return inherit( Crystal, SodiumChlorideCrystal, {

    /**
     * Randomly choose an initial particle for the crystal lattice
     * @param {prototype.constructor} type
     * @returns {Sodium}
     */
    createConstituentParticle: function( type ) {
      return type === Sodium ? new Sodium() : new Chloride();
    },

    /**
     * @override
     * Create the bonding partner for growing the crystal
     *
     * @param {SphericalParticle} original
     * @returns {Chloride}
     */
    createPartner: function( original ) {
      return original instanceof Sodium ? new Chloride() : new Sodium();
    }

  } );
} );

