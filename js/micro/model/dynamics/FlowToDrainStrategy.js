// Copyright 2002-2014, University of Colorado Boulder
/**
 * This strategy moves particles toward the drain at the indicated velocity.  When they reach the drain,
 * they flow out through the drain faucet.
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var UpdateStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/UpdateStrategy' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {MicroModel} model
   * @param {Vector2} velocity
   * @param {boolean} randomWalk
   * @constructor
   */
  function FlowToDrainStrategy( model, velocity, randomWalk ) {
    UpdateStrategy.call( this, model );

    //@private The velocity at which the particle should flow toward the drain
    this.velocity = velocity;

    // Flag to indicate whether the particle should also use some randomness as it moves toward the drain.
    // Particles that are closest to the drain should move directly toward the drain
    // So they can reach it in the desired amount of time to keep the concentration as steady as possible
    this.randomWalk = randomWalk;
  }

  return inherit( UpdateStrategy, FlowToDrainStrategy, {

    /**
     *
     * @param {Particle} particle
     * @param {number} dt
     */
    stepInTime: function( particle, dt ) {
      if ( !this.FreeParticleStrategy ) {
        // There is a cyclic dependency between FreeParticleStrategy and FlowToDrainStrategy so loading FreeParticleStrategy
        // inside the  function here
        this.FreeParticleStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/FreeParticleStrategy' );
      }

      //If the user released the drain slider, then switch back to purely random motion
      if ( this.model.outputFlowRate.get() === 0 ) {
        particle.setUpdateStrategy( new this.FreeParticleStrategy( this.model ) );
      }

      //Otherwise, move the particle with the pre-specified velocity and possible some random walk mixed in
      else {

        //If not closest to the drain, follow some random walk motion to look more natural, but still move toward the drain a little bit
        //If closest to the drain, move directly toward the drain so it can reach it in the desired amount of time to keep the
        //concentration as steady as possible
        if ( this.randomWalk ) {
          var initVelocity = particle.velocity.magnitude();

          //Mix in more of the original velocity to keep more of the random walk component
          var newVelocity = particle.velocity.times( 3 ).plus( this.velocity ).withMagnitude( initVelocity );
          particle.velocity.set( newVelocity );
          new this.FreeParticleStrategy( this.model ).randomWalk( particle, dt );
        }
        else {
          particle.velocity.set( this.velocity );
          particle.stepInTime( Vector2.ZERO, dt );
        }

        //Make sure the particles move down with the water level so they don't hang in the air where the water was
        if ( !this.model.solution.shape.get().bounds.containsBounds( particle.getShape().bounds ) ) {
          this.model.preventFromLeavingBeaker( particle );
        }
      }
    }
  } );
} );

