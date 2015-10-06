// Copyright 2002-2014, University of Colorado Boulder
/**
 * Data structure for a nitrate (NO3) including references to the particles and
 * the locations relative to the central nitrogen.
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Compound' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Constituent' );
  var FreeOxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/FreeOxygen' );
  var Nitrogen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Nitrogen' );
  var Vector2 = require( 'DOT/Vector2' );
  var SodiumNitrateConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/SodiumNitrateConstants' );

  /**
   *
   * @param {number} angle
   * @param {Vector2} relativePosition
   * @constructor
   */
  function Nitrate( angle, relativePosition ) {
    angle = angle || 0;
    relativePosition = relativePosition || new Vector2();

    Compound.call( this, relativePosition, angle );
    this.constituents.add( new Constituent( new FreeOxygen(), Vector2.createPolar( SodiumNitrateConstants.NITROGEN_OXYGEN_SPACING, Math.PI * 2 * 0 / 3.0 + angle ) ) );
    this.constituents.add( new Constituent( new FreeOxygen(), Vector2.createPolar( SodiumNitrateConstants.NITROGEN_OXYGEN_SPACING, Math.PI * 2 * 1 / 3.0 + angle ) ) );
    this.constituents.add( new Constituent( new FreeOxygen(), Vector2.createPolar( SodiumNitrateConstants.NITROGEN_OXYGEN_SPACING, Math.PI * 2 * 2 / 3.0 + angle ) ) );
    this.constituents.add( new Constituent( new Nitrogen(), Vector2.ZERO ) );

  }

  return inherit( Compound, Nitrate );
} );
// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Compound;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Constituent;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.FreeOxygen;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Nitrogen;
//
//import static edu.colorado.phet.common.phetcommon.math.vector.Vector2D.ZERO;
//import static edu.colorado.phet.common.phetcommon.math.vector.Vector2D.createPolar;
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate.SodiumNitrateCrystal.NITROGEN_OXYGEN_SPACING;
//
///**
// * Data structure for a nitrate (NO3) including references to the particles and the locations relative to the central nitrogen.
// *
// * @author Sam Reid
// */
//public class Nitrate extends Compound<Particle> {
//    public Nitrate() {
//        this( 0, ZERO );
//    }
//
//    public Nitrate( double angle, Vector2D relativePosition ) {
//        super( relativePosition, angle );
//        constituents.add( new Constituent<Particle>( new FreeOxygen(), createPolar( NITROGEN_OXYGEN_SPACING, Math.PI * 2 * 0 / 3.0 + angle ) ) );
//        constituents.add( new Constituent<Particle>( new FreeOxygen(), createPolar( NITROGEN_OXYGEN_SPACING, Math.PI * 2 * 1 / 3.0 + angle ) ) );
//        constituents.add( new Constituent<Particle>( new FreeOxygen(), createPolar( NITROGEN_OXYGEN_SPACING, Math.PI * 2 * 2 / 3.0 + angle ) ) );
//        constituents.add( new Constituent<Particle>( new Nitrogen(), ZERO ) );
//    }
//}
