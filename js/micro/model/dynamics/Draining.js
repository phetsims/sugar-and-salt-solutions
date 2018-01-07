// Copyright 2014-2017, University of Colorado Boulder
/**
 * Moves the particles toward the drain when the user drains the water out, constraining
 * the number of formula units for each solute type to be integral
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DynamicsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DynamicsConstants' );
  var FlowOutOfDrainStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/FlowOutOfDrainStrategy' );
  var FlowToDrainStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/FlowToDrainStrategy' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ItemList' );
  var Logger = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/Logger' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Vector2 = require( 'DOT/Vector2' );


  /**
   *
   * @param {MicroModel} model
   * @constructor
   */
  function Draining( model ) {
    this.model = model;

    //The Draining algorithm keeps track of which formula unit each particle is assigned to so that a particle is not double counted
    //It has to be cleared in each iteration since groupings are reassigned at each sim step
    //@private
    this.usedParticles = new ObservableArray();
  }

  return inherit( Object, Draining, {

    /**
     * Reset assignments to each group so they can be reassigned in each clock tick based on distance from the drain
     */
    clearParticleGroupings: function() {
      this.usedParticles.clear();
    },

    /**
     *
     * @param {DrainData} drainData
     * @param {number} dt
     * @returns {number}
     */
    getTimeToError: function( drainData, dt ) {
      //flow rate in volume / time
      var currentDrainFlowRate_VolumePerSecond = this.model.outputFlowRate.get() * this.model.faucetFlowRate;

      // number of free formula units
      var freeFormulaUnitCount = this.model.countFreeFormulaUnits( drainData.formula );

      //Determine the current concentration in particles per meter cubed
      var currentConcentration = freeFormulaUnitCount / this.model.solution.volume.get();

      //Determine the concentration at which we would consider it to be too erroneous, at half a particle over the target concentration
      //Half a particle is used so the solution will center on the target concentration (rather than upper or lower bounded)
      var errorConcentration = ( drainData.initialNumberFormulaUnits + 0.5 ) / drainData.initialVolume;

      //Determine the concentration in the next time step, and subsequently how much it is changing over time and how long until the next error occurs
      var nextConcentration = freeFormulaUnitCount / ( this.model.solution.volume.get() - currentDrainFlowRate_VolumePerSecond * dt );
      var deltaConcentration = ( nextConcentration - currentConcentration );
      var numberDeltasToError = ( errorConcentration - currentConcentration ) / deltaConcentration;

      //Assuming a constant rate of drain flow, compute how long until we would be in the previously determined error scenario
      //We will speed up the nearest particle so that it flows out in this time
      return numberDeltasToError * dt;
    },

    /**
     * Move the particles toward the drain and try to keep a constant concentration all particles should exit when fluid is gone, move nearby particles
     * For simplicity and regularity (to minimize deviation from the target concentration level), plan to have particles exit at regular intervals
     *
     * @param drainData
     * @param {number} dt
     */
    updateParticlesFlowingToDrain: function( drainData, dt ) {
      var self = this;

      //Nothing to do if no formula units for this formula
      if ( this.model.countFreeFormulaUnits( drainData.formula ) === 0 ) {
        return;
      }

      //Assuming a constant rate of drain flow, compute how long until we would be in the previously determined error scenario
      //We will speed up the nearest particle so that it flows out in this time
      var timeToError = this.getTimeToError( drainData, dt );

      //Sanity check on the number of deltas to reach a problem, if this is negative it could indicate some unexpected change in initial concentration
      //In any case, shouldn't propagate toward the drain with a negative delta, because that causes a negative speed and motion away from the drain
      if ( timeToError < 0 ) {
        Logger.fine( ': timeToError = ' + timeToError + ', recomputing initial concentration and postponing drain' );
        this.model.checkStartDrain( drainData );
        return;
      }

      //The closest group is the most important, since its exit will be the next action that causes concentration to drop
      //Time it so the group gets there exactly at the right time to make the concentration value exact again.
      //Pre-compute the drain faucet input point since it is used throughout this method, and many times in the sort method
      var drain = this.model.getDrainFaucetMetrics().getInputPoint();

      //Find the closest particles and move them toward the drain at a rate so they will reach at the same time
      var closestFormulaUnit = this.getParticlesToDrain( drainData.formula );

      _.each( closestFormulaUnit.getArray(), function( particle ) {
        Logger.fine( particle + ' #x: ' + particle.getPosition().x );
        //Compute the target time, distance, speed and velocity, and apply to the particle so they will reach the drain at evenly spaced temporal intervals
        var distanceToTarget = particle.getPosition().distance( drain );

        // compute the speed/velocity to make this particle arrive at the drain at the same time as the other particles in the formula unit
        var speed = distanceToTarget / timeToError;
        var velocity = drain.minus( particle.getPosition() ).withMagnitude( speed );

        //Set the update strategy of the particle, it will be updated when the strategies are invoked in MicroModel
        particle.setUpdateStrategy( new FlowToDrainStrategy( self.model, velocity, false ) );

        Logger.fine( 'i = ' + 0 + ', target time = ' + self.model.
          getTime() + ', velocity = ' + speed + ' nominal velocity = ' + DynamicsConstants.FREE_PARTICLE_SPEED );

      } );

      if ( !closestFormulaUnit.isEmpty() ) {
        var particle = closestFormulaUnit.get( 0 );

        //If the particle reached the drain, change its update strategy and move it into the list of model drained particles
        //Account for the particle width when checking whether it is close enough since wide particles like sucrose won't be
        //able to match their centroid with the center of the drain because they are prevented
        //from leaving the bounds of the water
        var dist = particle.getPosition().distance( self.model.getDrainFaucetMetrics().getInputPoint() );
        if ( dist <= particle.velocityProperty.value.magnitude() * dt + particle.getShape().bounds.getWidth() / 2 ) {

          // drain out all of the particles within the formula unit
          _.each( closestFormulaUnit.getArray(), function( unitParticle ) {
            unitParticle.setUpdateStrategy( new FlowOutOfDrainStrategy( self.model ) );

            //Move it from the list of free particles to the list of drained particles so it won't be counted for drain scheduling or for concentration
            self.model.freeParticles.remove( unitParticle );
            self.model.drainedParticles.add( unitParticle );
            //Okay to reschedule now since one particle just left, so there will be no phase problem
            unitParticle.setPosition( self.model.getDrainFaucetMetrics().outputPoint );
            unitParticle.velocityProperty.set( new Vector2( 0, -DynamicsConstants.FREE_PARTICLE_SPEED / 2 ) );
          } );
        }
      }
    },

    /**
     * Determine which particles to drain, accounting for the groups to which particles have been assigned
     *
     * @param {Formula} formula
     * @returns {boolean}
     */
    getParticlesToDrain: function( formula ) {
      var self = this;
      var list = [];

      var formulaUnits = formula.getFormulaUnit();

      for ( var i = 0; i < formulaUnits.length; i++ ) {
        var type = formulaUnits[ i ];
        //Find the closest particle that hasn't already been assigned to another formula
        var closestUnused = this.getClosestUnused( type );

        //If no particle as requested then bail out, roll back changes to the used particle list and return an empty list to signify nothing to drain
        if ( closestUnused === null ) {
          break;
        }
        else {
          this.usedParticles.add( closestUnused );
          list.push( closestUnused );
        }
      }

      //If we couldn't find a particle for every element in the formula unit, then roll back changes to the used particle list and signify nothing to drain
      if ( list.length !== formula.getFormulaUnit().length ) {
        _.each( list, function( particle ) {
          self.usedParticles.remove( particle );
        } );

      }

      return new ItemList( list );
    },


    /**
     * Find the particle that is closest to the drain that hasn't already been assigned to another formula group
     *
     * @param {prototype.constructor} type
     * @returns {Array<Particle> || null}
     */
    getClosestUnused: function( type ) {
      var self = this;
      var list = this.model.freeParticles.filterByClass( type ).filter( function( particle ) {
        return !self.usedParticles.contains( particle );
      } ).getArray();

      var drain = this.model.getDrainFaucetMetrics().getInputPoint();
      list = _.sortBy( list, function( particle ) {
        return particle.getPosition().distance( drain );
      } );

      if ( list.length > 0 ) {
        return list[ 0 ];
      }
      else {
        return null;
      }
    }

  } );
} );
