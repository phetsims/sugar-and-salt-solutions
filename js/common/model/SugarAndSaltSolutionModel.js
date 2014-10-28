// Copyright 2002-2012, University of Colorado
/**
 * Base class model for Sugar and Salt Solutions, which keeps track of the physical model as well as the MVC model for view components (such as whether certain components are enabled).
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var Area = require( 'java.awt.geom.Area' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var Rectangle = require( 'KITE/Rectangle' );
  var ArrayList = require( 'java.util.ArrayList' );
  var ImmutableRectangle2D = require( 'edu.colorado.phet.common.phetcommon.math.ImmutableRectangle2D' );
  var ConstantDtClock = require( 'edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var SettableProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.SettableProperty' );
  var DoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var FaucetMetrics = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/FaucetMetrics' );
  var VerticalRangeContains = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/VerticalRangeContains' );
  var clamp = require( 'edu.colorado.phet.common.phetcommon.math.MathUtil.clamp' );//static
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var SALT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/SALT' );//static
  var canvasSize = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/canvasSize' );//static

  function SugarAndSaltSolutionModel( clock, //Dimensions of the beaker
                                      beakerDimension, faucetFlowRate, drainPipeBottomY, drainPipeTopY, //Scale to help accommodate micro tab, for Macro tab the scale is 1.0
                                      distanceScale ) {
    //Use the same aspect ratio as the view to minimize insets with blank regions

    //private
    this.aspectRatio = canvasSize.getWidth() / canvasSize.getHeight();
    //Model for input and output flows
    //rate that water flows into the beaker, between 0 and 1
    this.inputFlowRate = new Property( 0.0 );
    //rate that water flows out of the beaker, between 0 and 1
    this.outputFlowRate = new DoubleProperty( 0.0 );
    //Flow controls vary between 0 and 1, this scales it down to a good model value
    this.faucetFlowRate;
    this.drainPipeBottomY;
    this.drainPipeTopY;
    //The amount to scale model translations so that micro tab emits solute at the appropriate time.  Without this factor, the tiny (1E-9 meters) drag motion in the Micro tab wouldn't be enough to emit solute
    this.distanceScale;
    //Which dispenser the user has selected
    this.dispenserType = new Property( SALT );
    //True if the values should be shown in the user interface
    this.showConcentrationValues = new Property( false );
    //volume in SI (m^3).  Start at 1 L (halfway up the 2L beaker).  Note that 0.001 cubic meters = 1L
    this.waterVolume;
    //Beaker model
    this.beaker;
    //Max amount of water before the beaker overflows
    this.maxWater;
    //Flag to indicate whether there is enough solution to flow through the lower drain.
    this.lowerFaucetCanDrain;
    //User setting: whether the concentration bar chart should be shown
    this.showConcentrationBarChart;
    //Part of the model that must be visible within the view
    this.visibleRegion;
    //The region within which the user can drag the shakers, smaller than the visible region to make sure the shakers can't be moved too far past the left edge of the beaker
    this.dragRegion;
    //Observable flag which determines whether the beaker is full of solution, for purposes of preventing overflow
    this.beakerFull;
    //Model location (in meters) of where water will flow out the drain (both toward and away from drain faucet), set by the view since view locations are chosen first for consistency across tabs

    //private
    this.drainFaucetMetrics = new FaucetMetrics( this, ZERO, ZERO, 0 );

    //private
    this.inputFaucetMetrics = new FaucetMetrics( this, ZERO, ZERO, 0 );
    //The shape of the input and output water.  The Shape of the water draining out the output faucet is also needed for purposes of determining whether there is an electrical connection for the conductivity tester
    this.inputWater = new Property( new Area() );
    this.outputWater = new Property( new Area() );
    //The dragging constraint so that the user cannot drag the shakers outside of the visible region
    this.dragConstraint = new Function1().withAnonymousClassBody( {
      apply: function( point2D ) {
        //These values were determined experimentally since we are constraining the center of the shaker (and shakers have different sizes and different angles)
        return new Vector2( dragRegion.getClosestPoint( point2D ).getX(), clamp( beaker.getTopY() * 1.3, point2D.getY(), beaker.getTopY() * 2 ) );
      }
    } );
    //Models for dispensers that can be used to add solute to the beaker solution
    this.dispensers;
    //Rate at which liquid (but no solutes) leaves the model
    //Between 0 and 100
    this.evaporationRate = new Property( 0.0 );
    //Rate at which liquid evaporates
    this.evaporationRateScale;
    //The elapsed running time of the model
    this.time;
    //Solution model, the fluid + any dissolved solutes
    this.solution;
    AbstractSugarAndSaltSolutionsModel.call( this, clock );
    this.faucetFlowRate = faucetFlowRate;
    this.drainPipeBottomY = drainPipeBottomY;
    this.drainPipeTopY = drainPipeTopY;
    this.distanceScale = distanceScale;
    //Scaled down since the evaporation control rate is 100 times bigger than flow scales
    this.evaporationRateScale = faucetFlowRate / 300.0;
    //Start the water halfway up the beaker
    waterVolume = new DoubleProperty( beakerDimension.getVolume() / 2 );
    //Inset so the beaker doesn't touch the edge of the model bounds
    var inset = beakerDimension.width * 0.1;
    var modelWidth = beakerDimension.width + inset * 2;
    //Beaker model
    beaker = new Beaker( beakerDimension.x, 0, beakerDimension.width, beakerDimension.height, beakerDimension.depth, beakerDimension.wallThickness );
    //Visible model region: a bit bigger than the beaker, used to set the stage aspect ratio in the canvas
    visibleRegion = new ImmutableRectangle2D( -modelWidth / 2, -inset, modelWidth, modelWidth / aspectRatio );
    //Create the region within which the user can drag the shakers, must remove some of the visible region--otherwise the shakers can be dragged too far to the left of the beaker
    var insetForDragRegion = visibleRegion.width / 6;
    dragRegion = new ImmutableRectangle2D( visibleRegion.x + insetForDragRegion, visibleRegion.y, visibleRegion.width - insetForDragRegion, visibleRegion.height );
    //Set a max amount of water that the user can add to the system so they can't overflow it
    maxWater = beaker.getMaxFluidVolume();
    //User setting: whether the concentration bar chart should be shown
    showConcentrationBarChart = new Property( true );
    //Create the list of dispensers
    dispensers = [];
    //Sets the shape of the water into the beaker
    inputFlowRate.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( rate ) {
        var width = rate * inputFaucetMetrics.faucetWidth;
        //assumes beaker floor is at y=0
        var height = inputFaucetMetrics.outputPoint.getY();
        inputWater.set( new Rectangle.Number( inputFaucetMetrics.outputPoint.getX() - width / 2, inputFaucetMetrics.outputPoint.getY() - height, width, height ) );
      }
    } ) );
    //Sets the shape of the water flowing out of the beaker, changing the shape updates the brightness of the conductivity tester in the macro tab
    outputFlowRate.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( rate ) {
        var width = rate * drainFaucetMetrics.faucetWidth;
        var height = beakerDimension.height * 2;
        outputWater.set( new Rectangle.Number( drainFaucetMetrics.outputPoint.getX() - width / 2, drainFaucetMetrics.outputPoint.getY() - height, width, height ) );
      }
    } ) );
    //Create the solution, which sits atop the solid precipitate (if any)
    solution = new Solution( waterVolume, beaker );
    //Convenience composite properties for determining whether the beaker is full or empty so we can shut off the faucets when necessary
    beakerFull = solution.volume.greaterThanOrEqualTo( maxWater );
    //This logic is used in the model update step to determine if water can flow out, as well as in the user interface to determine if the user can turn on the output faucet
    lowerFaucetCanDrain = new VerticalRangeContains( solution.shape, drainPipeBottomY, drainPipeTopY );
  }

  return inherit( AbstractSugarAndSaltSolutionsModel, SugarAndSaltSolutionModel, {
//True if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).  This is used to show/hide the "remove solutes" button
    getAnySolutes: function() {},
//Callback when water has evaporated from the solution
    waterEvaporated: function( evaporatedWater ) {
    },
//Reset the model state
    reset: function() {
      resetWater();
      for ( var dispenser in dispensers ) {
        dispenser.reset();
      }
      dispenserType.reset();
      showConcentrationValues.reset();
      showConcentrationBarChart.reset();
      notifyReset();
    },
//Reset the water volume to the initial value and stop the flow rate for input and output faucets
    resetWater: function() {
      waterVolume.reset();
      inputFlowRate.reset();
      outputFlowRate.reset();
    },
//Determine if any salt can be removed for purposes of displaying a "remove salt" button
    isAnySaltToRemove: function() {},
//Determine if any sugar can be removed for purposes of displaying a "remove sugar" button
    isAnySugarToRemove: function() {},
//Gets the elapsed time of the model in seconds
    getTime: function() {
      return time;
    },
//Get the location of the drain where particles will flow toward and out, in absolute coordinates, in meters
    getDrainFaucetMetrics: function() {
      return drainFaucetMetrics;
    },
//Set the location where particles will flow out the drain, set by the view since view locations are chosen first for consistency across tabs
    setDrainFaucetMetrics: function( faucetMetrics ) {
      this.drainFaucetMetrics = faucetMetrics;
    },
//Set the location where particles will flow out the drain, set by the view since view locations are chosen first for consistency across tabs
    setInputFaucetMetrics: function( faucetMetrics ) {
      this.inputFaucetMetrics = faucetMetrics;
    },
//Update the model when the clock ticks, and return the amount of drained water (in meters cubed) so that subclasses like MacroModel can decrease the amount of dissolved solutes
    updateModel: function( dt ) {
      time += dt;
      //Add any new crystals from the salt & sugar dispensers
      for ( var dispenser in dispensers ) {
        dispenser.updateModel();
      }
      //Change the water volume based on input and output flow
      var inputWater = dt * inputFlowRate.get() * faucetFlowRate;
      var drainedWater = dt * outputFlowRate.get() * faucetFlowRate;
      var evaporatedWater = dt * evaporationRate.get() * evaporationRateScale;
      //If we rewrite the model to account for solute volume displacement, this computation should account for the solution volume, not the water volume
      var newVolume = waterVolume.get() + inputWater - drainedWater - evaporatedWater;
      if ( newVolume > maxWater ) {
        inputWater = maxWater + drainedWater + evaporatedWater - waterVolume.get();
      }
      else //Only allow drain to use up all the water if user is draining the liquid
      if ( newVolume < 0 && outputFlowRate.get() > 0 ) {
        drainedWater = inputWater + waterVolume.get();
      }
      else //Conversely, only allow evaporated water to use up all remaining water if the user is evaporating anything
      if ( newVolume < 0 && evaporationRate.get() > 0 ) {
        evaporatedWater = inputWater + waterVolume.get();
      }
      //Set the true value of the new volume based on clamped inputs and outputs
      newVolume = waterVolume.get() + inputWater - drainedWater - evaporatedWater;
      //Turn off the input flow if the beaker would overflow
      if ( newVolume >= maxWater ) {
        inputFlowRate.set( 0.0 );
      }
      //Turn off the output flow if no water is adjacent to it
      if ( !lowerFaucetCanDrain.get() ) {
        outputFlowRate.set( 0.0 );
      }
      //Turn off evaporation if beaker is empty of water
      if ( newVolume <= 0 ) {
        evaporationRate.set( 0.0 );
      }
      //Update the water volume
      waterVolume.set( newVolume );
      //Notify subclasses that water evaporated in case they need to update anything
      if ( evaporatedWater > 0 ) {
        waterEvaporated( evaporatedWater );
      }
      return drainedWater;
    }
  } );
} );

