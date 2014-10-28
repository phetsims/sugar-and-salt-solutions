// Copyright 2002-2012, University of Colorado
/**
 * Moves the particles toward the drain when the user drains the water out, constraining the number of formula units for each solute type to be integral
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Collections = require( 'java.util.Collections' );
  var Comparator = require( 'java.util.Comparator' );
  var Logger = require( 'java.util.logging.Logger' );
  var Vector2 = require( 'DOT/Vector2' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var LoggingUtils = require( 'edu.colorado.phet.common.phetcommon.util.logging.LoggingUtils' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Formula' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );


  //private
  var LOGGER = LoggingUtils.getLogger( Draining.class.getCanonicalName() );

  function Draining( model ) {

    //private
    this.model;
    //The Draining algorithm keeps track of which formula unit each particle is assigned to so that a particle is not double counted
    //It has to be cleared in each iteration since groupings are reassigned at each sim step

    //private
    this.usedParticles = [];
    this.model = model;
  }

  return inherit( Object, Draining, {
//Reset assignments to each group so they can be reassigned in each clock tick based on distance from the drain
    clearParticleGroupings: function() {
      usedParticles.clear();
    },
    getTimeToError: function( drainData, dt ) {
      //flow rate in volume / time
      var currentDrainFlowRate_VolumePerSecond = model.outputFlowRate.get() * model.faucetFlowRate;
      // number of free formula units
      var freeFormulaUnitCount = model.countFreeFormulaUnits( drainData.formula );
      //Determine the current concentration in particles per meter cubed
      var currentConcentration = freeFormulaUnitCount / model.solution.volume.get();
      //Half a particle is used so the solution will center on the target concentration (rather than upper or lower bounded)
      var errorConcentration = (drainData.initialNumberFormulaUnits + 0.5) / drainData.initialVolume;
      //Determine the concentration in the next time step, and subsequently how much it is changing over time and how long until the next error occurs
      var nextConcentration = freeFormulaUnitCount / (model.solution.volume.get() - currentDrainFlowRate_VolumePerSecond * dt);
      var deltaConcentration = (nextConcentration - currentConcentration);
      var numberDeltasToError = (errorConcentration - currentConcentration) / deltaConcentration;
      //We will speed up the nearest particle so that it flows out in this time
      return numberDeltasToError * dt;
    },
//Move the particles toward the drain and try to keep a constant concentration
//all particles should exit when fluid is gone, move nearby particles
//For simplicity and regularity (to minimize deviation from the target concentration level), plan to have particles exit at regular intervals
    updateParticlesFlowingToDrain: function( drainData, dt ) {
      //Nothing to do if no formula units for this formula
      if ( model.countFreeFormulaUnits( drainData.formula ) == 0 ) {
        return;
      }
      //We will speed up the nearest particle so that it flows out in this time
      var timeToError = getTimeToError( drainData, dt );
      //In any case, shouldn't propagate toward the drain with a negative delta, because that causes a negative speed and motion away from the drain
      if ( timeToError < 0 ) {
        LOGGER.fine( getClass().getName() + ": timeToError = " + timeToError + ", recomputing initial concentration and postponing drain" );
        model.checkStartDrain( drainData );
        return;
      }
      //Pre-compute the drain faucet input point since it is used throughout this method, and many times in the sort method
      var drain = model.getDrainFaucetMetrics().getInputPoint();
      //Find the closest particles and move them toward the drain at a rate so they will reach at the same time
      var closestFormulaUnit = getParticlesToDrain( drainData.formula );
      for ( var particle in closestFormulaUnit ) {
        LOGGER.fine( particle.getClass() + " #" + particle.hashCode() + " x: " + particle.getPosition().getX() );
        //Compute the target time, distance, speed and velocity, and apply to the particle so they will reach the drain at evenly spaced temporal intervals
        var distanceToTarget = particle.getPosition().distance( drain );
        // compute the speed/velocity to make this particle arrive at the drain at the same time as the other particles in the formula unit
        var speed = distanceToTarget / timeToError;
        var velocity = new Vector2( particle.getPosition(), drain ).getInstanceOfMagnitude( speed );
        //Set the update strategy of the particle, it will be updated when the strategies are invoked in MicroModel
        particle.setUpdateStrategy( new FlowToDrainStrategy( model, velocity, false ) );
        LOGGER.fine( "i = " + 0 + ", target time = " + model.getTime() + ", velocity = " + speed + " nominal velocity = " + UpdateStrategy.FREE_PARTICLE_SPEED );
      }
      if ( !closestFormulaUnit.isEmpty() ) {
        var particle = closestFormulaUnit.get( 0 );
        //center of the drain because they are prevented from leaving the bounds of the water
        var dist = particle.getPosition().distance( model.getDrainFaucetMetrics().getInputPoint() );
        if ( dist <= particle.velocity.get().magnitude() * dt + particle.getShape().getBounds2D().getWidth() / 2 ) {
          // drain out all of the particles within the formula unit
          for ( var unitParticle in closestFormulaUnit ) {
            unitParticle.setUpdateStrategy( new FlowOutOfDrainStrategy( model ) );
            //Move it from the list of free particles to the list of drained particles so it won't be counted for drain scheduling or for concentration
            model.freeParticles.remove( unitParticle );
            model.drainedParticles.add( unitParticle );
            //Okay to reschedule now since one particle just left, so there will be no phase problem
            unitParticle.setPosition( model.getDrainFaucetMetrics().outputPoint );
            unitParticle.velocity.set( new Vector2( 0, -UpdateStrategy.FREE_PARTICLE_SPEED / 2 ) );
          }
        }
      }
    },
//Determine which particles to drain, accounting for the groups to which particles have been assigned
    getParticlesToDrain: function( formula ) {
      var list = [];
      for ( var type in formula.getFormulaUnit() ) {
        //Find the closest particle that hasn't already been assigned to another formula
        var closestUnused = getClosestUnused( type );
        //If no particle as requested then bail out, roll back changes to the used particle list and return an empty list to signify nothing to drain
        if ( closestUnused == null ) {
          break;
        }
        else {
          usedParticles.add( closestUnused );
          list.add( closestUnused );
        }
      }
      //If we couldn't find a particle for every element in the formula unit, then roll back changes to the used particle list and signify nothing to drain
      if ( list.size() != formula.getFormulaUnit().size() ) {
        for ( var particle in list ) {
          usedParticles.remove( particle );
        }
        return new ItemList();
      }
      return new ItemList( list );
    },
//Find the particle that is closest to the drain that hasn't already been assigned to another formula group

    //private
    getClosestUnused: function( type ) {
      var list = model.freeParticles.filter( type ).filter( new Function1().withAnonymousClassBody( {
        apply: function( particle ) {
          return !usedParticles.contains( particle );
        }
      } ) ).toList();
      var drain = model.getDrainFaucetMetrics().getInputPoint();
      Collections.sort( list, new Comparator().withAnonymousClassBody( {
        compare: function( o1, o2 ) {
          return Number.compare( o1.getPosition().distance( drain ), o2.getPosition().distance( drain ) );
        }
      } ) );
      if ( list.size() > 0 ) {
        return list.get( 0 );
      }
      else {
        return null;
      }
    }
  } );
} );

