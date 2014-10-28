// Copyright 2002-2011, University of Colorado
/**
 * Update the particles that flowed out the drain
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Compound' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );

  function FlowOutOfDrainStrategy( model ) {
    UpdateStrategy.call( this, model );
  }

  return inherit( UpdateStrategy, FlowOutOfDrainStrategy, {
    stepInTime: function( particle, dt ) {
      //Accelerate the particle due to gravity and perform an euler integration step
      particle.stepInTime( model.getExternalForce( false ).times( 1.0 / PARTICLE_MASS ), dt );
      //If the particle has fallen too far (say 3 beaker heights), remove it from the model completely
      if ( particle.getPosition().getY() < -3 * model.beaker.getHeight() ) {
        //Remove the graphics from the model
        if ( particle instanceof Compound ) {
          model.removeComponents( particle );
        }
        else if ( particle instanceof SphericalParticle ) {
          model.sphericalParticles.remove( particle );
        }
        else {
          new RuntimeException( "No match found" ).printStackTrace();
        }
        //Remove the reference from the list of drained particles
        model.drainedParticles.remove( particle );
      }
    }
  } );
} );

