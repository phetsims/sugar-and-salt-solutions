// Copyright 2002-2012, University of Colorado
/**
 * This crystal for Sodium Chloride salt updates the positions of the molecules to ensure they move as a crystal
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Formula' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Chloride' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Sodium' );

  function SodiumChlorideCrystal( position, angle ) {
    Crystal.call( this, Formula.SODIUM_CHLORIDE, position, new Chloride().radius + new Sodium().radius, angle );
  }

  return inherit( Crystal, SodiumChlorideCrystal, {
//Randomly choose an initial particle for the crystal lattice
    createConstituentParticle: function( type ) {
      return type == Sodium.class ? new Sodium() : new Chloride();
    },
//Create the bonding partner for growing the crystal
    createPartner: function( original ) {
      return original instanceof Sodium ? new Chloride() : new Sodium();
    }
  } );
} );

