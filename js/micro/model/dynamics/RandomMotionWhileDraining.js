// Copyright 2002-2012, University of Colorado
/**
 * Move all particles toward the drain with a random walk, with nearer particles moving faster
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
  var FREE_PARTICLE_SPEED = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/UpdateStrategy/FREE_PARTICLE_SPEED' );//static

  function RandomMotionWhileDraining( model ) {

    //private
    this.model;
    this.model = model;
  }

  return inherit( Object, RandomMotionWhileDraining, {
    apply: function() {
      var drain = model.getDrainFaucetMetrics().getInputPoint();
      for ( var particle in model.freeParticles ) {
        //Get the velocity for the particle
        var velocity = new Vector2( particle.getPosition(), drain ).getInstanceOfMagnitude( FREE_PARTICLE_SPEED ).times( getRelativeSpeed( drain, particle ) );
        particle.setUpdateStrategy( new FlowToDrainStrategy( model, velocity, true ) );
      }
    },
//Gets the relative speed at which a particle should move toward the drain.  This is a function that moves nearby particles closer to the drain faster

    //private
    getRelativeSpeed: function( drain, particle ) {
      //Only use this heuristic when further than 25% of beaker width away from the drain, otherwise particles close to the drain move too fast and end up waiting at the drain
      var numberBeakerWidthsToDrain = Math.max( 0.25, particle.getPosition().distance( drain ) / model.beaker.getWidth() );
      return 1 / numberBeakerWidthsToDrain / numberBeakerWidthsToDrain * model.outputFlowRate.get() / 2;
    }
  } );
} );

