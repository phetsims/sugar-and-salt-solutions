// Copyright 2014-2018, University of Colorado Boulder
/**
 * Base class model for Sugar and Salt Solutions, which keeps track of the physical model as well
 * as the MVC model for view components (such as whether certain components are enabled).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractSugarAndSaltSolutionsModel = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/AbstractSugarAndSaltSolutionsModel' );
  var Beaker = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Beaker' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/DispenserType' );
  var FaucetMetrics = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/FaucetMetrics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Solution = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Solution' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var VerticalRangeContains = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/VerticalRangeContains' );

  /**
   * @param {number} aspectRatio
   * @param {number} framesPerSecond
   * @param {BeakerDimension} beakerDimension
   * @param {number} faucetFlowRate
   * @param {number} drainPipeBottomY
   * @param {number} drainPipeTopY
   * @param {number} distanceScale
   * @constructor
   */
  function SugarAndSaltSolutionsModel( aspectRatio, framesPerSecond, beakerDimension, faucetFlowRate, drainPipeBottomY, drainPipeTopY, distanceScale ) {
    var self = this;
    AbstractSugarAndSaltSolutionsModel.call( self, framesPerSecond );
    //Use the same aspect ratio as the view to minimize insets with blank regions
    self.aspectRatio = aspectRatio;
    self.beakerDimension = beakerDimension;//Dimensions of the beaker
    self.faucetFlowRate = faucetFlowRate; //Flow controls vary between 0 and 1, this scales it down to a good model value
    self.drainPipeBottomY = drainPipeBottomY;
    self.drainPipeTopY = drainPipeTopY;

    //The elapsed running time of the model
    this.time = 0;

    //Scale to help accommodate micro tab, for Macro tab the scale is 1.0
    //The amount to scale model translations so that micro tab emits solute at the appropriate time.  Without
    //this factor, the tiny (1E-9 meters) drag motion in the Micro tab wouldn't be enough to emit solute
    self.distanceScale = distanceScale;

    //Which dispenser the user has selected
    self.dispenserTypeProperty = new Property( DispenserType.SALT );

    //Model for input and output flows
    self.inputFlowRateProperty = new Property( 0.0 );//rate that water flows into the beaker, between 0 and 1
    self.outputFlowRateProperty = new Property( 0.0 );//rate that water flows out of the beaker, between 0 and 1

    //Rate at which liquid evaporates
    //Scaled down since the evaporation control rate  is 100 times bigger than flow scales
    self.evaporationRateScale = faucetFlowRate / 300.0;

    //volume in SI (m^3).  Start at 1 L (halfway up the 2L beaker).  Note that 0.001 cubic meters = 1L
    self.waterVolumeProperty = new Property( beakerDimension.getVolume() / 2 ); //Start the water halfway up the beaker

    //Inset so the beaker doesn't touch the edge of the model bounds
    self.inset = beakerDimension.width * 0.1;
    self.modelWidth = beakerDimension.width + this.inset * 2;

    //Beaker model
    self.beaker = new Beaker( beakerDimension.x, 0, beakerDimension.width, beakerDimension.height,
      beakerDimension.depth, beakerDimension.wallThickness );

    //Part of the model that must be visible within the view
    //Visible model region: a bit bigger than the beaker, used to set the stage aspect ratio in the canvas
    self.visibleRegion = Shape.rectangle( -self.modelWidth / 2, -self.inset,
      self.modelWidth, self.modelWidth / self.aspectRatio ).bounds;

    //Create the region within which the user can drag the shakers, must remove some of the visible
    //region--otherwise the shakers can be dragged too far to the left of the beaker
    var insetForDragRegion = self.visibleRegion.width / 6;

    //The region within which the user can drag the shakers, smaller than the visible region to make sure
    //the shakers can't be moved too far past the left edge of the beaker
    self.dragRegion = Shape.rectangle( self.visibleRegion.x + insetForDragRegion, self.visibleRegion.y,
      self.visibleRegion.width - insetForDragRegion, self.visibleRegion.height ).bounds;

    //Max amount of water before the beaker overflows
    self.maxWater = self.beaker.getMaxFluidVolume();//Set a max amount of water that the user can add to the system so they can't overflow it

    //User setting: whether the concentration bar chart should be shown
    self.showConcentrationBarChartProperty = new Property( true );

    //Models for dispensers that can be used to add solute to the beaker solution
    self.dispensers = [];//Create the list of dispensers

    //Rate at which liquid (but no solutes) leaves the model
    this.evaporationRateProperty = new Property( 0.0 );//Between 0 and 100

    //@private Model location (in meters) of where water will flow out the drain (both toward and away
    //from drain faucet), set by the view since view locations are chosen first for consistency across tabs
    self.drainFaucetMetrics = new FaucetMetrics( self, Vector2.ZERO, Vector2.ZERO, 0 );

    //@private
    self.inputFaucetMetrics = new FaucetMetrics( self, Vector2.ZERO, Vector2.ZERO, 0 );

    // The shape of the input and output water.  The Shape of the water draining out the output faucet
    // is also needed for purposes of determining whether there is an electrical connection for the conductivity tester
    self.inputWaterProperty = new Property( new Shape() );
    self.outputWaterProperty = new Property( new Shape() );

    //Sets the shape of the water into the beaker
    self.inputFlowRateProperty.link( function( rate ) {
      var width = rate * self.inputFaucetMetrics.faucetWidth;
      var height = self.inputFaucetMetrics.outputPoint.y;//assumes beaker floor is at y=0
      self.inputWaterProperty.set( Shape.rectangle( self.inputFaucetMetrics.outputPoint.x - width / 2,
        self.inputFaucetMetrics.outputPoint.y - height, width, height ) );
    } );

    //Sets the shape of the water flowing out of the beaker, changing the shape updates the brightness of
    //the conductivity tester in the macro tab
    self.outputFlowRateProperty.link( function( rate ) {
      var width = rate * self.drainFaucetMetrics.faucetWidth;
      var height = beakerDimension.height * 2;
      self.outputWaterProperty.set( Shape.rectangle( self.drainFaucetMetrics.outputPoint.x - width / 2,
        self.drainFaucetMetrics.outputPoint.y - height, width, height ) );
    } );

    //Solution model, the fluid + any dissolved solutes. Create the solution, which sits
    //atop the solid precipitate (if any)
    self.solution = new Solution( self.waterVolumeProperty, self.beaker );

    //Observable flag which determines whether the beaker is full of solution, for purposes of preventing overflow
    //Convenience composite properties for determining whether the beaker
    //is full or empty so we can shut off the faucets when necessary
    self.beakerFullProperty = new DerivedProperty( [ self.solution.volume, new Property( self.maxWater ) ], function( volume, maxWater ) {
      return volume >= maxWater;
    } );

    //Flag to indicate whether there is enough solution to flow through the lower drain.
    //Determine if the lower faucet is allowed to let fluid flow out.  It can if any part of the fluid overlaps any part of the pipe range.
    //This logic is used in the model update step to determine if water can flow out, as well as in the user interface to determine if the user can turn on the output faucet
    self.lowerFaucetCanDrain = new VerticalRangeContains( self.solution.shape, drainPipeBottomY, drainPipeTopY );

    //True if the values should be shown in the user interface
    self.showConcentrationValuesProperty = new Property( false );
  }

  sugarAndSaltSolutions.register( 'SugarAndSaltSolutionsModel', SugarAndSaltSolutionsModel );

  return inherit( AbstractSugarAndSaltSolutionsModel, SugarAndSaltSolutionsModel, {
    /**
     * Update the model when the clock ticks, and return the amount of drained water (in meters cubed)
     * so that subclasses like MacroModel can decrease the amount of dissolved solutes
     * @param {number} dt
     * @returns {number}
     */
    updateModel: function( dt ) {
      this.time += dt;

      //Add any new crystals from the salt & sugar dispensers
      _.each( this.dispensers, function( dispenser ) {
        dispenser.updateModel();
      } );

      //Change the water volume based on input and output flow
      var inputWater = dt * this.inputFlowRateProperty.get() * this.faucetFlowRate;
      var drainedWater = dt * this.outputFlowRateProperty.get() * this.faucetFlowRate;
      var evaporatedWater = dt * this.evaporationRateProperty.get() * this.evaporationRateScale;

      //Compute the new water volume, but making sure it doesn't overflow or underflow.
      //If we rewrite the model to account for solute volume displacement, this computation should account for the
      //solution volume, not the water volume
      var newVolume = this.waterVolumeProperty.get() + inputWater - drainedWater - evaporatedWater;
      if ( newVolume > this.maxWater ) {
        inputWater = this.maxWater + drainedWater + evaporatedWater - this.waterVolumeProperty.get();
      }

      //Only allow drain to use up all the water if user is draining the liquid
      else if ( newVolume < 0 && this.outputFlowRateProperty.get() > 0 ) {
        drainedWater = inputWater + this.waterVolumeProperty.get();
      }
      //Conversely, only allow evaporated water to use up all remaining water if the user is evaporating anything
      else if ( newVolume < 0 && this.evaporationRateProperty.get() > 0 ) {
        evaporatedWater = inputWater + this.waterVolumeProperty.get();
      }
      //Note that the user can't be both evaporating and draining fluid at the same time, since the controls
      //are one-at-a-time controls.This simplifies the logic here.
      //Set the true value of the new volume based on clamped inputs and outputs
      newVolume = this.waterVolumeProperty.get() + inputWater - drainedWater - evaporatedWater;

      //Turn off the input flow if the beaker would overflow
      if ( newVolume >= this.maxWater ) {
        this.inputFlowRateProperty.set( 0.0 );
      }

      //Turn off the output flow if no water is adjacent to it
      if ( !this.lowerFaucetCanDrain.get() ) {
        this.outputFlowRateProperty.set( 0.0 );
      }

      //Turn off evaporation if beaker is empty of water
      if ( newVolume <= 0 ) {
        this.evaporationRateProperty.set( 0.0 );
      }

      //Update the water volume
      this.waterVolumeProperty.set( newVolume );

      //Notify subclasses that water evaporated in case they need to update anything
      if ( evaporatedWater > 0 ) {
        this.waterEvaporated( evaporatedWater );
      }

      return drainedWater;
    },

    /**
     * The dragging constraint so that the user cannot drag the shakers outside of the visible region
     * @param {Vector2} point2D
     * @returns {Vector2}
     */
    dragConstraint: function( point2D ) {
      //Use the visible region for constraining the X-value, and a fraction past the beaker value.
      //These values were determined experimentally since we are constraining the center of the shaker
      //(and shakers have different sizes and different angles)
      return new Vector2( this.dragRegion.getClosestPoint( point2D ).x,
        Util.clamp( point2D.y, this.beaker.getTopY() * 1.3, this.beaker.getTopY() * 2 ) );
    },

    /**
     * Callback when water has evaporated from the solution
     * @param {number} evaporatedWater
     */
    waterEvaporated: function( evaporatedWater ) {
      //Nothing to do in the base class
    },

    /**
     * Get the location of the drain where particles will flow
     * toward and out, in absolute coordinates, in meters
     * @returns {FaucetMetrics}
     */
    getDrainFaucetMetrics: function() {
      return this.drainFaucetMetrics;
    },

    /**
     * Set the location where particles will flow out the drain, set by the view
     * since view locations are chosen first for consistency across tabs
     * @param {FaucetMetrics} faucetMetrics
     */
    setDrainFaucetMetrics: function( faucetMetrics ) {
      this.drainFaucetMetrics = faucetMetrics;
    },

    /**
     * Set the location where particles will flow out the drain, set by
     * the view since view locations are chosen first for consistency across tabs
     * @param {FaucetMetrics} faucetMetrics
     */
    setInputFaucetMetrics: function( faucetMetrics ) {
      this.inputFaucetMetrics = faucetMetrics;
    },

    /**
     * Reset the model state
     */
    reset: function() {
      this.resetWater();
      this.dispensers.forEach( function( dispenser ) {

        // TODO: Reset the dispensers
        //dispenser.reset();
      } );

      this.dispenserTypeProperty.reset();
      this.showConcentrationValuesProperty.reset();
      this.showConcentrationBarChartProperty.reset();

      //TODO notifyReset();
    },

    /**
     * @protected
     * Reset the water volume to the initial value and stop the flow rate for input and output faucets
     */
    resetWater: function() {
      this.waterVolumeProperty.reset();
      this.inputFlowRateProperty.reset();
      this.outputFlowRateProperty.reset();
    },

    /**
     * @abstract
     * Determine if any salt can be removed for purposes of displaying a "remove salt" button
     */
    isAnySaltToRemove: function() {
      throw new Error( 'isAnySaltToRemove  must be implemented in the descendant class of SugarAndSaltSolutions Model' );
    },

    /**
     * @abstract
     * Determine if any sugar can be removed for purposes of displaying a "remove sugar" button
     */
    isAnySugarToRemove: function() {
      throw new Error( 'isAnySugarToRemove  must be implemented in the descendant class of SugarAndSaltSolutions Model' );
    },

    /**
     * Gets the elapsed time of the model in seconds
     * @returns {number}
     */
    getTime: function() {
      return this.time;
    }


  } );

} );

// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.awt.Shape;
//import java.awt.geom.Area;
//import java.awt.geom.Point2D;
//import java.awt.geom.Rectangle2D;
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.math.ImmutableRectangle2D;
//import edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.model.property.SettableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.sugarandsaltsolutions.common.view.FaucetMetrics;
//import edu.colorado.phet.sugarandsaltsolutions.common.view.VerticalRangeContains;
//
//import static edu.colorado.phet.common.phetcommon.math.MathUtil.clamp;
//import static edu.colorado.phet.common.phetcommon.math.vector.Vector2D.ZERO;
//import static edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType.SALT;
//import static edu.colorado.phet.sugarandsaltsolutions.common.view.BeakerAndShakerCanvas.canvasSize;
//
///**
// * Base class model for Sugar and Salt Solutions, which keeps track of the physical model as well as the MVC model for view components (such as whether certain components are enabled).
// *
// * @author Sam Reid
// */
//public abstract class SugarAndSaltSolutionsModel extends AbstractSugarAndSaltSolutionsModel {
//

//
//    public final double drainPipeBottomY;
//    public final double drainPipeTopY;
//
//    //The amount to scale model translations so that micro tab emits solute at the appropriate time.  Without this factor, the tiny (1E-9 meters) drag motion in the Micro tab wouldn't be enough to emit solute
//    public final double distanceScale;
//


//
//    //User setting: whether the concentration bar chart should be shown
//    public final Property<Boolean> showConcentrationBarChart;
//
//    //Part of the model that must be visible within the view
//    public final ImmutableRectangle2D visibleRegion;
//
//    //The region within which the user can drag the shakers, smaller than the visible region to make sure the shakers can't be moved too far past the left edge of the beaker
//    public final ImmutableRectangle2D dragRegion;

//
//
//
//    //True if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).  This is used to show/hide the "remove solutes" button
//    public abstract ObservableProperty<Boolean> getAnySolutes();
//
//    //Models for dispensers that can be used to add solute to the beaker solution
//    public final ArrayList<Dispenser> dispensers;
//
//    //Rate at which liquid (but no solutes) leaves the model
//    public final SettableProperty<Double> evaporationRate = new Property<Double>( 0.0 );//Between 0 and 100
//
//    //Rate at which liquid evaporates
//    public final double evaporationRateScale;
//
//    //The elapsed running time of the model
//    protected double time;
//
//    //Solution model, the fluid + any dissolved solutes
//    public final Solution solution;
//
//    public SugarAndSaltSolutionsModel( final ConstantDtClock clock,
//
//                                      //Dimensions of the beaker
//                                      final BeakerDimension beakerDimension,
//                                      double faucetFlowRate,
//                                      final double drainPipeBottomY,
//                                      final double drainPipeTopY,
//
//                                      //Scale to help accommodate micro tab, for Macro tab the scale is 1.0
//                                      double distanceScale ) {
//        super( clock );
//        this.faucetFlowRate = faucetFlowRate;
//        this.drainPipeBottomY = drainPipeBottomY;
//        this.drainPipeTopY = drainPipeTopY;
//        this.distanceScale = distanceScale;
//
//        //Scaled down since the evaporation control rate is 100 times bigger than flow scales
//        this.evaporationRateScale = faucetFlowRate / 300.0;
//
//        //Start the water halfway up the beaker
//        waterVolume = new DoubleProperty( beakerDimension.getVolume() / 2 );
//
//        //Inset so the beaker doesn't touch the edge of the model bounds
//        final double inset = beakerDimension.width * 0.1;
//        final double modelWidth = beakerDimension.width + inset * 2;
//
//        //Beaker model
//        beaker = new Beaker( beakerDimension.x, 0, beakerDimension.width, beakerDimension.height, beakerDimension.depth, beakerDimension.wallThickness );
//
//        //Visible model region: a bit bigger than the beaker, used to set the stage aspect ratio in the canvas
//        visibleRegion = new ImmutableRectangle2D( -modelWidth / 2, -inset, modelWidth, modelWidth / aspectRatio );
//
//        //Create the region within which the user can drag the shakers, must remove some of the visible region--otherwise the shakers can be dragged too far to the left of the beaker
//        final double insetForDragRegion = visibleRegion.width / 6;
//        dragRegion = new ImmutableRectangle2D( visibleRegion.x + insetForDragRegion, visibleRegion.y, visibleRegion.width - insetForDragRegion, visibleRegion.height );
//
//        //Set a max amount of water that the user can add to the system so they can't overflow it
//        maxWater = beaker.getMaxFluidVolume();
//
//        //User setting: whether the concentration bar chart should be shown
//        showConcentrationBarChart = new Property<Boolean>( true );
//
//        //Create the list of dispensers
//        dispensers = new ArrayList<Dispenser>();
//
//        //Sets the shape of the water into the beaker
//        inputFlowRate.addObserver( new VoidFunction1<Double>() {
//            public void apply( Double rate ) {
//                double width = rate * inputFaucetMetrics.faucetWidth;
//                double height = inputFaucetMetrics.outputPoint.getY();//assumes beaker floor is at y=0
//                inputWater.set( new Rectangle2D.Double( inputFaucetMetrics.outputPoint.getX() - width / 2, inputFaucetMetrics.outputPoint.getY() - height, width, height ) );
//            }
//        } );
//
//        //Sets the shape of the water flowing out of the beaker, changing the shape updates the brightness of the conductivity tester in the macro tab
//        outputFlowRate.addObserver( new VoidFunction1<Double>() {
//            public void apply( Double rate ) {
//                double width = rate * drainFaucetMetrics.faucetWidth;
//                double height = beakerDimension.height * 2;
//                outputWater.set( new Rectangle2D.Double( drainFaucetMetrics.outputPoint.getX() - width / 2, drainFaucetMetrics.outputPoint.getY() - height, width, height ) );
//            }
//        } );
//
//        //Create the solution, which sits atop the solid precipitate (if any)
//        solution = new Solution( waterVolume, beaker );
//
//        //Convenience composite properties for determining whether the beaker is full or empty so we can shut off the faucets when necessary
//        beakerFull = solution.volume.greaterThanOrEqualTo( maxWater );
//
//        //Determine if the lower faucet is allowed to let fluid flow out.  It can if any part of the fluid overlaps any part of the pipe range.
//        //This logic is used in the model update step to determine if water can flow out, as well as in the user interface to determine if the user can turn on the output faucet
//        lowerFaucetCanDrain = new VerticalRangeContains( solution.shape, drainPipeBottomY, drainPipeTopY );
//    }
//

//
//    //Reset the model state
//    public void reset() {
//        resetWater();
//        for ( Dispenser dispenser : dispensers ) {
//            dispenser.reset();
//        }
//        dispenserType.reset();
//        showConcentrationValues.reset();
//        showConcentrationBarChart.reset();
//
//        notifyReset();
//    }
//
//    //Reset the water volume to the initial value and stop the flow rate for input and output faucets
//    protected void resetWater() {
//        waterVolume.reset();
//        inputFlowRate.reset();
//        outputFlowRate.reset();
//    }
//
//    //Determine if any salt can be removed for purposes of displaying a "remove salt" button
//    public abstract ObservableProperty<Boolean> isAnySaltToRemove();
//
//    //Determine if any sugar can be removed for purposes of displaying a "remove sugar" button
//    public abstract ObservableProperty<Boolean> isAnySugarToRemove();
//
//    //Gets the elapsed time of the model in seconds
//    public double getTime() {
//        return time;
//    }
//

//

//}
