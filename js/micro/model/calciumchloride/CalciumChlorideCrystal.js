// Copyright 2014-2015, University of Colorado Boulder

/**
 * This crystal for Calcium Chloride salt updates the positions of the molecules to ensure they move as a crystal
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Crystal' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Formula' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Chloride' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Calcium' );

  /**
   *
   * @param {Vector2} position
   * @param {number} angle
   * @constructor
   */
  function CalciumChlorideCrystal( position, angle ) {
    Crystal.call( this, Formula.CALCIUM_CHLORIDE, position, new Calcium().radius + new Chloride().radius, angle );
  }

  return inherit( Crystal, CalciumChlorideCrystal, {
    /**
     * @override
     * Create the bonding partner for Calcium Chloride
     * @param {SphericalParticle} original
     * @returns {Chloride}
     */
    createPartner: function( original ) {
      return original instanceof Calcium ? new Chloride() : new Calcium();
    },

    /**
     * @protected
     * Randomly choose an initial particle for the crystal lattice
     * @param {function} type
     * @returns {Particle}
     */
    createConstituentParticle: function( type ) {
      return type === Calcium ? new Calcium() : new Chloride();
    },

    /**
     * @override
     * @param {Constituent} constituent
     * @returns {Array<Vector2>}
     */
    getPossibleDirections: function( constituent ) {
      //If there's something North/South, then do not allow going East/West and vice versa
      //This is to match the design doc spec and Soluble Salts sim to get a 2:1 lattice
      //This effectively makes it so that so that every other Ca2+ is omitted from the lattice in a regular way
      if ( constituent.particle instanceof Chloride ) {
        if ( this.isOccupied( constituent.relativePosition.plus( this.northUnitVector ) ) ) { return [this.southUnitVector ]; }
        else if ( this.isOccupied( constituent.relativePosition.plus( this.southUnitVector ) ) ) { return [ this.northUnitVector ];}
        else if ( this.isOccupied( constituent.relativePosition.plus( this.eastUnitVector ) ) ) { return [ this.westUnitVector ];}
        else if ( this.isOccupied( constituent.relativePosition.plus( this.westUnitVector ) ) ) { return [ this.eastUnitVector ];}

        //If no neighbor site is occupied, then this is the first particle in the lattice, so fall through and allow to
        //go any direction
      }
      return Crystal.prototype.getPossibleDirections.call( this, constituent );
    }
  } );
} );
