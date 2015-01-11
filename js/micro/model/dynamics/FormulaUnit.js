// Copyright 2002-2014, University of Colorado Boulder

/**
 * Pair of matching particles that could potentially form a crystal together,
 * if they are close enough together.  Order within the pair is irrelevant.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Pair = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/Pair' );
  var Vector2 = require( 'DOT/Vector2' );
  var DynamicsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DynamicsConstants' );

  /**
   *
   * @param {Particle} a
   * @param {Particle} b
   * @constructor
   */
  function FormulaUnit( a, b ) {
    Pair.call( this, a, b );
  }

  return inherit( Pair, FormulaUnit, {
    /**
     * Get the distance between the particles
     * @returns {number}
     */
    getDistance: function() {
      return this._1.getPosition().distance( this._2.getPosition() );
    },

    /**
     * Move the particles closer together at the free particle speed
     * @param {number} dt
     */
    moveTogether: function( dt ) {
      var unitVectorFromAToB = new Vector2( this._1.getPosition(), this._2.getPosition() ).normalized();
      var velocity = unitVectorFromAToB.times( DynamicsConstants.FREE_PARTICLE_SPEED );
      this._1.velocity.set( velocity );
      this._2.velocity.set( velocity.times( -1 ) );
      this._1.stepInTime( Vector2.ZERO, dt );
      this._2.stepInTime( Vector2.ZERO, dt );
    },

    /**
     * List all particles for purposes of iteration to add to a crystal
     * @returns {Array<Particle>}
     */
    getParticles: function() {
      return [this._1, this._2];
    }

  } );
} );
