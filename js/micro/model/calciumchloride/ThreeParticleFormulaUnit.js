// Copyright 2002-2014, University of Colorado Boulder

/**
 * One formula unit of particles to be used as a seed for creating a crystal that starts with 3 elements, such as CaCl2.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FormulaUnit = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/FormulaUnit' );
  var DynamicsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DynamicsConstants' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {Particle} a
   * @param {Particle} b
   * @param {Particle} c
   * @constructor
   */
  function ThreeParticleFormulaUnit( a, b, c ) {
    //@private
    this.a = a;

    //@private
    this.b = b;

    //@private
    this.c = c;
  }

  return inherit( FormulaUnit, ThreeParticleFormulaUnit, {
    /**
     * Determine how far apart all constituents are
     * @returns {number}
     */
    getDistance: function() {
      var ab = this.a.getDistance( this.b );
      var bc = this.b.getDistance( this.c );
      var ac = this.a.getDistance( this.c );
      return ( ab + bc + ac ) / 3;
    },

    /**
     * Move the constituents closer to their centroid so they can form a crystal
     * @param {number} dt
     */
    moveTogether: function( dt ) {
      var centroid = ( this.a.getPosition().plus( this.b.getPosition() ).plus( this.c.getPosition() ) ).times( 1.0 / 3 );
      this.moveToCentroid( this.a, centroid, dt );
      this.moveToCentroid( this.b, centroid, dt );
      this.moveToCentroid( this.c, centroid, dt );
    },

    /**
     * Move a particle to the centroid so the particles can get closer together to form a crystal
     * @param {Particle} particle
     * @param {Vector2} centroid
     * @param {number} dt
     */
    moveToCentroid: function( particle, centroid, dt ) {
      var unitVectorToCentroid = new Vector2( particle.getPosition(), centroid ).normalized();
      var velocity = unitVectorToCentroid.times( DynamicsConstants.FREE_PARTICLE_SPEED );
      particle.velocity.set( velocity );
      particle.stepInTime( Vector2.ZERO, dt );
    },

    /**
     * Get the three particles in the unit
     * @returns {Array<Particles>}
     */
    getParticles: function() {
      return [this.a, this.b, this.c];
    }
  } );
} );


//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.calciumchloride;
//
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.IFormulaUnit;
//
//import static edu.colorado.phet.common.phetcommon.math.vector.Vector2D.ZERO;
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.UpdateStrategy.FREE_PARTICLE_SPEED;
//
///**
// * One formula unit of particles to be used as a seed for creating a crystal that starts with 3 elements, such as CaCl2.
// *
// * @author Sam Reid
// */
//public class ThreeParticleFormulaUnit<T extends Particle> implements IFormulaUnit {
//    private final T a;
//    private final T b;
//    private final T c;
//
//    public ThreeParticleFormulaUnit( T a, T b, T c ) {
//        this.a = a;
//        this.b = b;
//        this.c = c;
//    }
//
//    //Determine how far apart all constituents are
//    public double getDistance() {
//        double ab = a.getDistance( b );
//        double bc = b.getDistance( c );
//        double ac = a.getDistance( c );
//        return ( ab + bc + ac ) / 3;
//    }
//
//    //Move the constituents closer to their centroid so they can form a crystal
//    public void moveTogether( double dt ) {
//        Vector2D centroid = ( a.getPosition().plus( b.getPosition() ).plus( c.getPosition() ) ).times( 1.0 / 3 );
//        moveToCentroid( a, centroid, dt );
//        moveToCentroid( b, centroid, dt );
//        moveToCentroid( c, centroid, dt );
//    }
//
//    //Move a particle to the centroid so the particles can get closer together to form a crystal
//    private void moveToCentroid( Particle particle, Vector2D centroid, double dt ) {
//        Vector2D unitVectorToCentroid = new Vector2D( particle.getPosition(), centroid ).normalized();
//        Vector2D velocity = unitVectorToCentroid.times( FREE_PARTICLE_SPEED );
//        particle.velocity.set( velocity );
//        particle.stepInTime( ZERO, dt );
//    }
//
//    //Get the three particles in the unit
//    public ArrayList<T> getParticles() {
//        return new ArrayList<T>() {{
//            add( a );
//            add( b );
//            add( c );
//        }};
//    }
//}
