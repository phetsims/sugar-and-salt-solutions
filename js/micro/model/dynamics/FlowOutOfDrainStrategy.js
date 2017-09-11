// Copyright 2014-2015, University of Colorado Boulder
/**
 * Update the particles that flowed out the drain
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Compound' );
  var DynamicsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DynamicsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/SphericalParticle' );
  var UpdateStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/UpdateStrategy' );

  /**
   *
   * @param {MicroModel} model
   * @param {Vector2} velocity
   * @param {boolean} randomWalk
   * @constructor
   */
  function FlowOutOfDrainStrategy( model, velocity, randomWalk ) {
    UpdateStrategy.call( this, model );
  }

  return inherit( UpdateStrategy, FlowOutOfDrainStrategy, {

    /**
     *
     * @param {Particle} particle
     * @param {number} dt
     */
    stepInTime: function( particle, dt ) {

      //Accelerate the particle due to gravity and perform an euler integration step
      particle.stepInTime( this.model.getExternalForce( false ).times( 1.0 / DynamicsConstants.PARTICLE_MASS ), dt );

      //If the particle has fallen too far (say 3 beaker heights), remove it from the model completely
      if ( particle.getPosition().y < -3 * this.model.beaker.getHeight() ) {

        //Remove the graphics from the model
        if ( particle instanceof Compound ) {
          this.model.removeComponents( particle );
        }
        else if ( particle instanceof SphericalParticle ) {
          this.model.sphericalParticles.remove( particle );
        }
        else {
          var err = new Error( 'No match found' );
          console.log( err );
        }

        //Remove the reference from the list of drained particles
        this.model.drainedParticles.remove( particle );
      }
    }
  } );

} );
