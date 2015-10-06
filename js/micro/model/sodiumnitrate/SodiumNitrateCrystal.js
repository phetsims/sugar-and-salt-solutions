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
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Sodium' );
  var Nitrate = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/Nitrate' );
  var SodiumNitrateConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/SodiumNitrateConstants' );


  /**
   * @param {Vector2} position
   * @param {number} angle
   *
   * @constructor
   */
  function SodiumNitrateCrystal( position, angle ) {
    Crystal.call( this, Formula.SODIUM_NITRATE, position, new Sodium().radius * 2 + SodiumNitrateConstants.NITROGEN_OXYGEN_SPACING, angle );
  }

  return inherit( Crystal, SodiumNitrateCrystal, {
      /**
       * Create the bonding partner for growing the crystal
       * @override
       * @param {Particle} original
       * @returns {Nitrate}
       */
      createPartner: function( original ) {
        return original instanceof Sodium ? new Nitrate() : new Sodium();
      },

      /**
       * Randomly choose an initial particle for the crystal lattice
       * @override
       * @protected
       * @param type
       * @returns {Sodium}
       */
      createConstituentParticle: function( type ) {
        return type === Sodium ? new Sodium() : new Nitrate();
      }
    }
  );
} );
// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Crystal;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Formula;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.FreeOxygen;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Nitrogen;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Sodium;
//
///**
// * This crystal for Sodium Chloride salt updates the positions of the molecules to ensure they move as a crystal
// *
// * @author Sam Reid
// */
//public class SodiumNitrateCrystal extends Crystal<Particle> {
//
//    //The distance between nitrogen and oxygen should be the sum of their radii, but the blue background makes it hard to tell that N and O are bonded.
//    //Therefore we bring the outer O's closer to the N so there is some overlap.
//    public static final double NITROGEN_OXYGEN_SPACING = ( new Nitrogen().radius + new FreeOxygen().radius ) * 0.85;
//
//    public SodiumNitrateCrystal( Vector2D position, double angle ) {
//        super( Formula.SODIUM_NITRATE, position, new Sodium().radius * 2 + NITROGEN_OXYGEN_SPACING, angle );
//    }
//
//    //Create the bonding partner for growing the crystal
//    @Override public Particle createPartner( Particle original ) {
//        return original instanceof Sodium ? new Nitrate() : new Sodium();
//    }
//
//    //Randomly choose an initial particle for the crystal lattice
//    @Override protected Particle createConstituentParticle( Class<? extends Particle> type ) {
//        return type == Sodium.class ? new Sodium() : new Nitrate();
//    }
//}
