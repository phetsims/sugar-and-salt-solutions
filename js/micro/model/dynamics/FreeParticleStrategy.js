// Copyright 2014-2018, University of Colorado Boulder
/**
 *
 * Move the particles about with a random walk, but making sure they remain within the solution (if they started within it)
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DynamicsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DynamicsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var UpdateStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/UpdateStrategy' );
  var Vector2 = require( 'DOT/Vector2' );

  var toRadians = function( degree ) {
    return degree * ( Math.PI / 180 );
  };

  /**
   *
   * @param {MicroModel} model
   * @constructor
   */
  function FreeParticleStrategy( model ) {
    UpdateStrategy.call( this, model );
  }

  sugarAndSaltSolutions.register( 'FreeParticleStrategy', FreeParticleStrategy );
  return inherit( UpdateStrategy, FreeParticleStrategy, {

    /**
     * Updates the particle in time, moving it randomly or changing its motion strategy based on user input
     * @param {Particle} particle
     * @param {number} dt
     */
    stepInTime: function( particle, dt ) {

      if ( !this.FlowToDrainStrategy ) {
        // There is a cyclic dependency between FreeParticleStrategy and FlowToDrainStrategy so loading FlowToDrainStrategy
        // inside the  function here
        this.FlowToDrainStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/FlowToDrainStrategy' );
      }

      //Switch strategies if necessary
      //Note, this check prevents random motion during draining since the strategy is switched before random walk can take place
      if ( this.model.outputFlowRateProperty.get() > 0 ) {
        particle.setUpdateStrategy( new this.FlowToDrainStrategy( this.model, new Vector2( 0, 0 ), false ) );
        particle.stepInTime( dt );
      }
      else {
        this.randomWalk( particle, dt );
      }
    },

    /**
     * Apply a random walk update to the particle.  This is also reused in FlowToDrainStrategy so that the particle will have somewhat
     * random motion as it progresses toward the drain
     * @param {Particle} particle
     * @param {number} dt
     */
    randomWalk: function( particle, dt ) {
      var initiallyUnderwater = this.solution.shape.get().bounds.containsBounds( particle.getShape().bounds );

      //If the crystal has ever gone underwater, set a flag so that it can be kept from leaving the top of the water
      if ( this.solution.shape.get().bounds.containsBounds( particle.getShape().bounds ) ) {
        particle.setSubmerged();
      }

      var initialPosition = particle.getPosition();
      var initialVelocity = particle.velocityProperty.value;

      //If the particle is underwater and there is any water, move the particle about at the free particle speed
      if ( particle.hasSubmerged() && this.waterVolume.get() > 0 ) {

        //If the particle velocity was set to zero (from a zero water volume, restore it to non-zero so it can be scaled
        if ( particle.velocityProperty.value.magnitude === 0 ) {
          particle.velocityProperty.set( Vector2.createPolar( 1, RandomUtil.randomAngle() ) );
        }
        particle.velocityProperty.set( particle.velocityProperty.value.withMagnitude( DynamicsConstants.FREE_PARTICLE_SPEED ) );
      }

      //If the particle was stopped by the water completely evaporating, start it moving again
      //Must be done before particle.stepInTime so that the particle doesn't pick up a small velocity in that method, since this assumes particle velocity of zero implies evaporated to the bottom
      if ( particle.velocityProperty.value.magnitude === 0 ) {
        this.model.collideWithWater( particle );
      }

      //Accelerate the particle due to gravity and perform an euler integration step
      particle.stepInTime( this.model.getExternalForce( this.model.isAnyPartUnderwater( particle ) ).times(
        1.0 / DynamicsConstants.PARTICLE_MASS ), dt );

      var underwater = this.solution.shape.get().bounds.containsBounds( particle.getShape().bounds );

      //If the particle entered the water on this step, slow it down to simulate hitting the water
      if ( !initiallyUnderwater && underwater && particle.getPosition().y >
                                                 this.model.beaker.getHeightForVolume( this.waterVolume.get() ) / 2 ) {
        this.model.collideWithWater( particle );
      }

      //Random Walk, implementation taken from edu.colorado.phet.solublesalts.model.RandomWalk
      if ( underwater ) {
        var theta = phet.joist.random.nextDouble() * toRadians( 30.0 ) * RandomUtil.nextRandomSign();
        particle.velocityProperty.set( particle.velocityProperty.value.rotated( theta ) );
      }

      //Prevent the particles from leaving the solution, but only if they started in the solution
      //And randomize the velocity so it will hopefully move away from the wall soon, and won't get stuck in the corner
      if ( initiallyUnderwater && !underwater ) {
        particle.setPosition( initialPosition );
        particle.velocityProperty.set( Vector2.createPolar( initialVelocity.magnitude, RandomUtil.randomAngle() ) );
      }

      //Keep the particle within the beaker solution bounds
      this.model.preventFromLeavingBeaker( particle );

      //If the particle is on the floor of the beaker, and only partly submerged due to a very low water level, then make sure
      // its velocity gets randomized too
      //Without this fix, it would just move constantly until hitting a wall and stopping
      //nearTheBottomFlag was necessary since without it particles would skip and jump on the top of the water
      //Note that this must be computed after clamping the particle to remain within beaker bounds so that the check for near the
      //bottom is correct
      var shapeIntersectsWater = particle.getShape().intersectsBounds( this.model.solution.shape.get().bounds );
      var partiallySubmerged = particle.getShape().bounds.getMinY() < this.model.solution.shape.get().bounds.getMaxY();
      var nearTheBottom = particle.getShape().bounds.getMinY() <= this.model.solution.shape.get().bounds.getMinY() + 1E-12;
      if ( !initiallyUnderwater && !underwater && shapeIntersectsWater && partiallySubmerged && nearTheBottom ) {
        particle.velocityProperty.set( Vector2.createPolar( initialVelocity.magnitude, RandomUtil.randomAngle() ) );
      }

      //Stop the particle completely if there is no water to move within, though it should probably find another
      //particle to crystallize with (if partner is required)
      if ( this.waterVolume.get() <= 0 ) {
        particle.velocityProperty.set( new Vector2( 0, 0 ) );
      }
    }

  } );
} );
