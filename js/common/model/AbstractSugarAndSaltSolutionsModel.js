// Copyright 2014-2017, University of Colorado Boulder
/**
 * Abstract base class in sugar and salt solution models, which provides clock and reset functions.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantDtClock = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ConstantDtClock' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @param {number} framesPerSecond
   * @constructor
   */
  function AbstractSugarAndSaltSolutionsModel( framesPerSecond ) {

    //Wire up to the clock so we can update when it ticks
    var stepEventCallBack = this.updateModel.bind( this );
    this.clock = new ConstantDtClock( framesPerSecond, stepEventCallBack );

    //Settable property that indicates whether the clock is running or paused.
    //The clock is never turned off in the first tab, since there are no dynamics and hence no pause button
    this.clockRunning = new Property( true );
  }

  sugarAndSaltSolutions.register( 'AbstractSugarAndSaltSolutionsModel', AbstractSugarAndSaltSolutionsModel );

  return inherit( Object, AbstractSugarAndSaltSolutionsModel, {
    step: function( dt ) {
      // step one frame, assuming 60fps
      if ( this.clockRunning ) {
        this.clock.step( dt );
      }
    },

    /**
     * called from Constant Clock's callback
     * @param {number} dt
     * @returns {number}
     */
    updateModel: function( dt ) {
      throw new Error( 'updateModel should be implemented in descendant classes of AbstractSugarAndSaltSolutionsModel .' );
    }
  } );

} );

// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.model.ResetModel;
//import edu.colorado.phet.common.phetcommon.model.clock.ClockAdapter;
//import edu.colorado.phet.common.phetcommon.model.clock.ClockEvent;
//import edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock;
//import edu.colorado.phet.common.phetcommon.model.property.And;
//import edu.colorado.phet.common.phetcommon.model.property.BooleanProperty;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction0;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//
///**
// * Abstract base class in sugar and salt solution models, which provides clock and reset functions.
// *
// * @author Sam Reid
// */
//public abstract class AbstractSugarAndSaltSolutionsModel implements ResetModel {
//
//    //Listeners which are notified when the sim is reset.
//    private final ArrayList<VoidFunction0> resetListeners = new ArrayList<VoidFunction0>();
//
//    //Model clock
//    public final ConstantDtClock clock;
//
//    //Settable property that indicates whether the clock is running or paused.
//    //The clock is never turned off in the first tab, since there are no dynamics and hence no pause button
//    public final BooleanProperty clockRunning = new BooleanProperty( true );
//
//    //Boolean flag to indicate whether the module is running, for purposes of starting and pausing the clock
//    public final BooleanProperty moduleActive = new BooleanProperty( false );
//
//    public AbstractSugarAndSaltSolutionsModel( final ConstantDtClock clock ) {
//        this.clock = clock;
//
//        //Wire up to the clock so we can update when it ticks
//        clock.addClockListener( new ClockAdapter() {
//            @Override public void simulationTimeChanged( ClockEvent clockEvent ) {
//                updateModel( clockEvent.getSimulationTimeChange() );
//            }
//        } );
//
//        //Make the clock run if "play" is selected with the user controls and if the module is active
//        //This code is not necessary for starting/stopping the clock, but for updating the floating play/pause button
//        final And clockRunning = this.clockRunning.and( moduleActive );
//        clockRunning.addObserver( new VoidFunction1<Boolean>() {
//            public void apply( Boolean clockRunning ) {
//                if ( clockRunning ) {
//                    clock.start();
//                }
//                else {
//                    clock.pause();
//                }
//            }
//        } );
//    }
//
//    //Reset the the model when "reset all" is pressed
//    public abstract void reset();
//
//    protected abstract double updateModel( double dt );
//
//    //Adds a listener that will be notified when the model is reset
//    public void addResetListener( VoidFunction0 listener ) {
//        resetListeners.add( listener );
//    }
//
//    protected void notifyReset() {
//        //Notify listeners that registered for a reset message
//        for ( VoidFunction0 resetListener : resetListeners ) {
//            resetListener.apply();
//        }
//    }
//}
