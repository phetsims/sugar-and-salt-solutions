// Copyright 2014-2018, University of Colorado Boulder

/**
 * One formula unit of particles to be used as a seed for creating a crystal that starts with 3 elements, such as CaCl2.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var DynamicsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DynamicsConstants' );
  var FormulaUnit = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/FormulaUnit' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {Particle} a
   * @param {Particle} b
   * @param {Particle} c
   * @constructor
   */
  function ThreeParticleFormulaUnit( a, b, c ) {
    // @private
    this.a = a;

    // @private
    this.b = b;

    // @private
    this.c = c;
  }

  sugarAndSaltSolutions.register( 'ThreeParticleFormulaUnit', ThreeParticleFormulaUnit );
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
      particle.velocityProperty.set( velocity );
      particle.stepInTime( Vector2.ZERO, dt );
    },

    /**
     * Get the three particles in the unit
     * @returns {Array<Particles>}
     */
    getParticles: function() {
      return [ this.a, this.b, this.c ];
    }
  } );
} );
