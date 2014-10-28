// Copyright 2002-2012, University of Colorado
/**
 * Move the particles about with a random walk, but making sure they remain within the solution (if they started within it)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Random = require( 'java.util.Random' );
  var MathUtil = require( 'edu.colorado.phet.common.phetcommon.math.MathUtil' );
  var Vector2 = require( 'DOT/Vector2' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var createPolar = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.createPolar' );//static
  var randomAngle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/RandomUtil/randomAngle' );//static

  function FreeParticleStrategy( model ) {
    //Randomness for random walks

    //private
    this.random = new Random();
    UpdateStrategy.call( this, model );
  }

  return inherit( UpdateStrategy, FreeParticleStrategy, {
//Updates the particle in time, moving it randomly or changing its motion strategy based on user input
    stepInTime: function( particle, dt ) {
      //Note, this check prevents random motion during draining since the strategy is switched before random walk can take place
      if ( model.outputFlowRate.get() > 0 ) {
        particle.setUpdateStrategy( new FlowToDrainStrategy( model, new Vector2(), false ) );
        particle.stepInTime( dt );
      }
      else {
        randomWalk( particle, dt );
      }
    },
//Apply a random walk update to the particle.  This is also reused in FlowToDrainStrategy so that the particle will have somewhat random motion as it progresses toward the drain
    randomWalk: function( particle, dt ) {
      var initiallyUnderwater = solution.shape.get().contains( particle.getShape().getBounds2D() );
      //If the crystal has ever gone underwater, set a flag so that it can be kept from leaving the top of the water
      if ( solution.shape.get().contains( particle.getShape().getBounds2D() ) ) {
        particle.setSubmerged();
      }
      var initialPosition = particle.getPosition();
      var initialVelocity = particle.velocity.get();
      //If the particle is underwater and there is any water, move the particle about at the free particle speed
      if ( particle.hasSubmerged() && waterVolume.get() > 0 ) {
        //If the particle velocity was set to zero (from a zero water volume, restore it to non-zero so it can be scaled
        if ( particle.velocity.get().magnitude() == 0 ) {
          particle.velocity.set( createPolar( 1, randomAngle() ) );
        }
        particle.velocity.set( particle.velocity.get().getInstanceOfMagnitude( FREE_PARTICLE_SPEED ) );
      }
      //Must be done before particle.stepInTime so that the particle doesn't pick up a small velocity in that method, since this assumes particle velocity of zero implies evaporated to the bottom
      if ( particle.velocity.get().magnitude() == 0 ) {
        model.collideWithWater( particle );
      }
      //Accelerate the particle due to gravity and perform an euler integration step
      particle.stepInTime( model.getExternalForce( model.isAnyPartUnderwater( particle ) ).times( 1.0 / PARTICLE_MASS ), dt );
      var underwater = solution.shape.get().contains( particle.getShape().getBounds2D() );
      //If the particle entered the water on this step, slow it down to simulate hitting the water
      if ( !initiallyUnderwater && underwater && particle.getPosition().getY() > model.beaker.getHeightForVolume( waterVolume.get() ) / 2 ) {
        model.collideWithWater( particle );
      }
      //Random Walk, implementation taken from edu.colorado.phet.solublesalts.model.RandomWalk
      if ( underwater ) {
        var theta = random.nextDouble() * Math.toRadians( 30.0 ) * MathUtil.nextRandomSign();
        particle.velocity.set( particle.velocity.get().getRotatedInstance( theta ) );
      }
      //And randomize the velocity so it will hopefully move away from the wall soon, and won't get stuck in the corner
      if ( initiallyUnderwater && !underwater ) {
        particle.setPosition( initialPosition );
        particle.velocity.set( createPolar( initialVelocity.magnitude(), randomAngle() ) );
      }
      //Keep the particle within the beaker solution bounds
      model.preventFromLeavingBeaker( particle );
      //Note that this must be computed after clamping the particle to remain within beaker bounds so that the check for near the bottom is correct
      var shapeIntersectsWater = particle.getShape().getBounds2D().intersects( model.solution.shape.get().getBounds2D() );
      var partiallySubmerged = particle.getShape().getBounds2D().getMinY() < model.solution.shape.get().getBounds2D().getMaxY();
      var nearTheBottom = particle.getShape().getBounds2D().getMinY() <= model.solution.shape.get().getBounds().getMinY() + 1E-12;
      if ( !initiallyUnderwater && !underwater && shapeIntersectsWater && partiallySubmerged && nearTheBottom ) {
        particle.velocity.set( createPolar( initialVelocity.magnitude(), randomAngle() ) );
      }
      //Stop the particle completely if there is no water to move within, though it should probably find another particle to crystallize with (if partner is required)
      if ( waterVolume.get() <= 0 ) {
        particle.velocity.set( new Vector2( 0, 0 ) );
      }
    }
  } );
} );

