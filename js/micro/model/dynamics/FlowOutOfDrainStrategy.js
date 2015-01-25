//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Update the particles that flowed out the drain
 *
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var UpdateStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/dynamics/UpdateStrategy' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Compound' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalParticle/SphericalParticle' );

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
      particle.stepInTime( this.model.getExternalForce( false ).times( 1.0 / SugarAndSaltConstants.PARTICLE_MASS ), dt );

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
          var err = new Error( "No match found" );
          console.log( err );
        }

        //Remove the reference from the list of drained particles
        this.model.drainedParticles.remove( particle );
      }
    }
  } );

} );


//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics;
//
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Compound;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroModel;
//
///**
// * Update the particles that flowed out the drain
// *
// * @author Sam Reid
// */
//public class FlowOutOfDrainStrategy extends UpdateStrategy {
//    public FlowOutOfDrainStrategy( MicroModel model ) {
//        super( model );
//    }
//
//    public void stepInTime( Particle particle, double dt ) {
//
//        //Accelerate the particle due to gravity and perform an euler integration step
//        particle.stepInTime( model.getExternalForce( false ).times( 1.0 / PARTICLE_MASS ), dt );
//
//        //If the particle has fallen too far (say 3 beaker heights), remove it from the model completely
//        if ( particle.getPosition().getY() < -3 * model.beaker.getHeight() ) {
//
//            //Remove the graphics from the model
//            if ( particle instanceof Compound<?> ) {
//                model.removeComponents( (Compound<?>) particle );
//            }
//            else if ( particle instanceof SphericalParticle ) {
//                model.sphericalParticles.remove( particle );
//            }
//            else {
//                new RuntimeException( "No match found" ).printStackTrace();
//            }
//
//            //Remove the reference from the list of drained particles
//            model.drainedParticles.remove( particle );
//        }
//    }
//}
