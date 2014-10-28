// Copyright 2002-2011, University of Colorado
/**
 * Abstract base class in sugar and salt solution models, which provides clock and reset functions.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var ResetModel = require( 'edu.colorado.phet.common.phetcommon.model.ResetModel' );
  var ClockAdapter = require( 'edu.colorado.phet.common.phetcommon.model.clock.ClockAdapter' );
  var ClockEvent = require( 'edu.colorado.phet.common.phetcommon.model.clock.ClockEvent' );
  var ConstantDtClock = require( 'edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock' );
  var And = require( 'edu.colorado.phet.common.phetcommon.model.property.And' );
  var Property = require( 'AXON/Property' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );

  function AbstractSugarAndSaltSolutionsModel( clock ) {
    //Listeners which are notified when the sim is reset.

    //private
    this.resetListeners = [];
    //Model clock
    this.clock;
    //Settable property that indicates whether the clock is running or paused.
    //The clock is never turned off in the first tab, since there are no dynamics and hence no pause button
    this.clockRunning = new BooleanProperty( true );
    //Boolean flag to indicate whether the module is running, for purposes of starting and pausing the clock
    this.moduleActive = new BooleanProperty( false );
    this.clock = clock;
    //Wire up to the clock so we can update when it ticks
    clock.addClockListener( new ClockAdapter().withAnonymousClassBody( {
      simulationTimeChanged: function( clockEvent ) {
        updateModel( clockEvent.getSimulationTimeChange() );
      }
    } ) );
    //This code is not necessary for starting/stopping the clock, but for updating the floating play/pause button
    var clockRunning = this.clockRunning.and( moduleActive );
    clockRunning.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( clockRunning ) {
        if ( clockRunning ) {
          clock.start();
        }
        else {
          clock.pause();
        }
      }
    } ) );
  }

  return inherit( Object, AbstractSugarAndSaltSolutionsModel, {
//Reset the the model when "reset all" is pressed
    reset: function() {},
    updateModel: function( dt ) {},
//Adds a listener that will be notified when the model is reset
    addResetListener: function( listener ) {
      resetListeners.add( listener );
    },
    notifyReset: function() {
      //Notify listeners that registered for a reset message
      for ( var resetListener in resetListeners ) {
        resetListener.apply();
      }
    }
  } );
} );

