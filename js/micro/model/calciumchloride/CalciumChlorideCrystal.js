// Copyright 2002-2012, University of Colorado
/**
 * This crystal for Calcium Chloride salt updates the positions of the molecules to ensure they move as a crystal
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Formula' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Calcium' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Chloride' );

  function CalciumChlorideCrystal( position, angle ) {
    Crystal.call( this, Formula.CALCIUM_CHLORIDE, position, new Calcium().radius + new Chloride().radius, angle );
  }

  return inherit( Crystal, CalciumChlorideCrystal, {
//Create the bonding partner for Calcium Chloride
    createPartner: function( original ) {
      return original instanceof Calcium ? new Chloride() : new Calcium();
    },
//Randomly choose an initial particle for the crystal lattice
    createConstituentParticle: function( type ) {
      return type == Calcium.class ? new Calcium() : new Chloride();
    },
    getPossibleDirections: function( constituent ) {
      //This effectively makes it so that so that every other Ca2+ is omitted from the lattice in a regular way
      if ( constituent.particle instanceof Chloride ) {
        if ( isOccupied( constituent.relativePosition.plus( northUnitVector ) ) ) {
          return new Vector2[]
          { southUnitVector }
          ;
        }
        else if ( isOccupied( constituent.relativePosition.plus( southUnitVector ) ) ) {
          return new Vector2[]
          { northUnitVector }
          ;
        }
        else if ( isOccupied( constituent.relativePosition.plus( eastUnitVector ) ) ) {
          return new Vector2[]
          { westUnitVector }
          ;
        }
        else if ( isOccupied( constituent.relativePosition.plus( westUnitVector ) ) ) {
          return new Vector2[]
          { eastUnitVector }
          ;
        }
      }
      return super.getPossibleDirections( constituent );
    }
  } );
} );

