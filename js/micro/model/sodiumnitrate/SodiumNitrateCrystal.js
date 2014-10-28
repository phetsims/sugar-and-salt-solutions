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
  var FreeOxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/FreeOxygen' );
  var Nitrogen = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Nitrogen' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Sodium' );

//The distance between nitrogen and oxygen should be the sum of their radii, but the blue background makes it hard to tell that N and O are bonded.
//Therefore we bring the outer O's closer to the N so there is some overlap.
  var NITROGEN_OXYGEN_SPACING = (new Nitrogen().radius + new FreeOxygen().radius) * 0.85;

  function SodiumNitrateCrystal( position, angle ) {
    Crystal.call( this, Formula.SODIUM_NITRATE, position, new Sodium().radius * 2 + NITROGEN_OXYGEN_SPACING, angle );
  }

  return inherit( Crystal, SodiumNitrateCrystal, {
//Create the bonding partner for growing the crystal
      createPartner: function( original ) {
        return original instanceof Sodium ? new Nitrate() : new Sodium();
      },
//Randomly choose an initial particle for the crystal lattice
      createConstituentParticle: function( type ) {
        return type == Sodium.class ? new Sodium() : new Nitrate();
      }
    },
//statics
    {
      NITROGEN_OXYGEN_SPACING: NITROGEN_OXYGEN_SPACING
    } );
} );

