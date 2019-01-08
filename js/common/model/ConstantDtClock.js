// Copyright 2014-2018, University of Colorado Boulder
/**
 * The clock for this simulation.
 * The simulation time change (dt) on each clock tick is constant,
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 */

define( function( require ) {
  'use strict';

  // modules
  var EventTimer = require( 'PHET_CORE/EventTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {number} framesPerSecond
   * @param eventCallBack // a single argument function receiving "elapsed time"
   * @constructor
   */
  function ConstantDtClock( framesPerSecond, eventCallBack ) {

    var self = this;
    self.simulationTimeChange = 1 / framesPerSecond;
    self.lastSimulationTime = 0.0;
    self.simulationTime = 0.0;
    self.eventCallBack = eventCallBack;
    // The clock for this simulation.
    // The simulation time change (dt) on each clock tick is constant,
    var constantEventModel = new EventTimer.ConstantEventModel( framesPerSecond );
    this.eventTimer = new EventTimer( constantEventModel, function( timeElapsed ) {
      self.constantStep( timeElapsed );
    } );

  }

  sugarAndSaltSolutions.register( 'ConstantDtClock', ConstantDtClock );

  return inherit( Object, ConstantDtClock, {
    //called from AbstractSugarAndSaltSolutionsModel
    step: function( dt ) {
      // step one frame, assuming 60fps
      this.eventTimer.step( 1 / 60 );
    },

    constantStep: function( timeElapsed ) {
      this.tick( this.simulationTimeChange );

    },
    reset: function() {
      this.lastSimulationTime = 0.0;
      this.simulationTime = 0.0;
      this.speed = 1;

      //fire reset event callback
      for ( var i = 0; i < this.resetCallBacks.length; i++ ) {
        this.resetCallBacks[ i ]();
      }
      this.model.reset();
    },

    /**
     * Update the clock, updating the wall time and possibly simulation time.
     */
    tick: function( simulationTimeChange ) {
      this.setSimulationTimeNoUpdate( this.simulationTime + simulationTimeChange );
      //fire step event callback
      this.eventCallBack( this.getSimulationTimeChange() );
    },
    /**
     * Gets the constant simulation time change (dt) between ticks.
     * @returns {number} dt
     */
    getDt: function() {
      this.getSimulationTimeChange();
    },
    getSimulationTimeChange: function() {
      return this.simulationTime - this.lastSimulationTime;
    },

    /**
     * Determine how much simulation time should pass if the clock is paused, and the user presses 'frame advance'
     * @returns {number} the simulation time.
     */
    getSimulationTimeChangeForPausedClock: function() {
      return this.simulationTimeChange;
    },
    setSimulationTimeNoUpdate: function( simulationTime ) {
      this.lastSimulationTime = this.simulationTime;
      this.simulationTime = simulationTime;
    }


  } );

} );