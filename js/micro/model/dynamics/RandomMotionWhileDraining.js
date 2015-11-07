// Copyright 2014-2015, University of Colorado Boulder
/**
 * Move all particles toward the drain with a random walk, with nearer particles moving
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DynamicsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DynamicsConstants' );
  var FlowToDrainStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/FlowToDrainStrategy' );

  /**
   *
   * @param {MicroModel} model
   * @constructor
   */
  function RandomMotionWhileDraining( model ) {
    this.model = model;
  }

  return inherit( Object, RandomMotionWhileDraining, {

    apply: function() {
      var self = this;
      var drain = this.model.getDrainFaucetMetrics().getInputPoint();
      _.each( this.model.freeParticles.getArray(), function( particle ) {
        //Get the velocity for the particle
        var velocity = drain.minus( particle.getPosition() ).
          withMagnitude( DynamicsConstants.FREE_PARTICLE_SPEED ).times( self.getRelativeSpeed( drain, particle ) );
        particle.setUpdateStrategy( new FlowToDrainStrategy( self.model, velocity, true ) );
      } );
    },

    /**
     * Gets the relative speed at which a particle should move toward the drain.  This is a function
     * that moves nearby particles closer to the drain faster
     *
     * @param {Vector2} drain
     * @param {Particle} particle
     * @returns {number}
     */
    getRelativeSpeed: function( drain, particle ) {
      //Only use this heuristic when further than 25% of beaker width away from the drain, otherwise particles close to
      //the drain move too fast and end up waiting at the drain
      var numberBeakerWidthsToDrain = Math.max( 0.25,
        particle.getPosition().distance( drain ) / this.model.beaker.getWidth() );
      return 1 / numberBeakerWidthsToDrain / numberBeakerWidthsToDrain * this.model.outputFlowRate.get() / 2;
    }


  } );
} );

// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics;
//
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroModel;
//
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.UpdateStrategy.FREE_PARTICLE_SPEED;
//
///**
// * Move all particles toward the drain with a random walk, with nearer particles moving faster
// *
// * @author Sam Reid
// */
//public class RandomMotionWhileDraining {
//    private final MicroModel model;
//
//    public RandomMotionWhileDraining( MicroModel model ) {
//        this.model = model;
//    }
//
//    public void apply() {
//        final Vector2D drain = model.getDrainFaucetMetrics().getInputPoint();
//        for ( Particle particle : model.freeParticles ) {
//
//            //Get the velocity for the particle
//            Vector2D velocity = new Vector2D( particle.getPosition(), drain ).getInstanceOfMagnitude( FREE_PARTICLE_SPEED ).times( getRelativeSpeed( drain, particle ) );
//
//            particle.setUpdateStrategy( new FlowToDrainStrategy( model, velocity, true ) );
//        }
//    }
//
//    //Gets the relative speed at which a particle should move toward the drain.  This is a function that moves nearby particles closer to the drain faster
//    private double getRelativeSpeed( Vector2D drain, Particle particle ) {
//
//        //Only use this heuristic when further than 25% of beaker width away from the drain, otherwise particles close to the drain move too fast and end up waiting at the drain
//        double numberBeakerWidthsToDrain = Math.max( 0.25, particle.getPosition().distance( drain ) / model.beaker.getWidth() );
//
//        return 1 / numberBeakerWidthsToDrain / numberBeakerWidthsToDrain * model.outputFlowRate.get() / 2;
//    }
//}
