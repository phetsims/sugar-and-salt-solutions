// Copyright 2002-2012, University of Colorado
/**
 * This strategy moves particles toward the drain at the indicated velocity.  When they reach the drain, they flow out through the drain faucet.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static

  function FlowToDrainStrategy( model, velocity, randomWalk ) {
    //The velocity at which the particle should flow toward the drain

    //private
    this.velocity;
    //Flag to indicate whether the particle should also use some randomness as it moves toward the drain.  Particles that are closest to the drain should move directly toward the drain
    //So they can reach it in the desired amount of time to keep the concentration as steady as possible

    //private
    this.randomWalk;
    UpdateStrategy.call( this, model );
    this.velocity = velocity;
    this.randomWalk = randomWalk;
  }

  return inherit( UpdateStrategy, FlowToDrainStrategy, {
    stepInTime: function( particle, dt ) {
      //If the user released the drain slider, then switch back to purely random motion
      if ( model.outputFlowRate.get() == 0 ) {
        particle.setUpdateStrategy( new FreeParticleStrategy( model ) );
      }
      else //Otherwise, move the particle with the pre-specified velocity and possible some random walk mixed in
      {
        //If closest to the drain, move directly toward the drain so it can reach it in the desired amount of time to keep the concentration as steady as possible
        if ( randomWalk ) {
          var initVelocity = particle.velocity.get().magnitude();
          //Mix in more of the original velocity to keep more of the random walk component
          var newVelocity = particle.velocity.get().times( 3 ).plus( velocity ).getInstanceOfMagnitude( initVelocity );
          particle.velocity.set( newVelocity );
          new FreeParticleStrategy( model ).randomWalk( particle, dt );
        }
        else {
          particle.velocity.set( velocity );
          particle.stepInTime( ZERO, dt );
        }
        //Make sure the particles move down with the water level so they don't hang in the air where the water was
        if ( !model.solution.shape.get().getBounds2D().contains( particle.getShape().getBounds2D() ) ) {
          model.preventFromLeavingBeaker( particle );
        }
      }
    }
  } );
} );

