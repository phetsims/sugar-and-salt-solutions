// Copyright 2002-2012, University of Colorado
/**
 * Introductory (macro) model that keeps track of moles of solute dissolved in the liquid.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line2D = require( 'java.awt.geom.Line2D' );
  var Rectangle = require( 'KITE/Rectangle' );
  var ArrayList = require( 'java.util.ArrayList' );
  var ImmutableRectangle2D = require( 'edu.colorado.phet.common.phetcommon.math.ImmutableRectangle2D' );
  var MathUtil = require( 'edu.colorado.phet.common.phetcommon.math.MathUtil' );
  var Vector2 = require( 'DOT/Vector2' );
  var ConstantDtClock = require( 'edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock' );
  var Notifier = require( 'edu.colorado.phet.common.phetcommon.model.event.Notifier' );
  var Property = require( 'AXON/Property' );
  var SettableProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.SettableProperty' );
  var CompositeDoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.CompositeDoubleProperty' );
  var RichSimpleObserver = require( 'edu.colorado.phet.common.phetcommon.util.RichSimpleObserver' );
  var ConductivityTesterChangeListener = require( 'edu.colorado.phet.common.piccolophet.nodes.conductivitytester.IConductivityTester.ConductivityTesterChangeListener' );
  var Strings = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings' );
  var AirborneCrystalMoles = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/AirborneCrystalMoles' );
  var BeakerDimension = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/BeakerDimension' );
  var ConductivityTester = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ConductivityTester' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var MacroSugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/view/MacroSugarDispenser' );
  var SALT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/SALT' );//static
  var SUGAR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/SUGAR' );//static

//Saturation points for salt and sugar assume 25 degrees C
//6.14 moles per liter, converted to SI

  //private
  var saltSaturationPoint = 6.14 * 1000;
//5.85 moles per liter, converted to SI

  //private
  var sugarSaturationPoint = 5.85 * 1000;

  function MacroModel() {
    //Model for the conductivity tester which is in the macro tab but not other tabs
    this.conductivityTester;
    //Sugar and its listeners
    //The sugar crystals that haven't been dissolved
    this.sugarList = [];
    //Listeners for when sugar crystals are added
    this.sugarAdded = new Notifier();
    //Salt and its listeners
    //The salt crystals that haven't been dissolved
    this.saltList = [];
    //Listeners for when salt crystals are added
    this.saltAdded = new Notifier();
    //Model moles, concentration, amount dissolved, amount precipitated, etc. for salt and sugar
    this.salt;
    this.sugar;
    //Total volume of the water plus any solid precipitate submerged under the water (and hence pushing it up)
    this.solidVolume;
    //The concentration in the liquid in moles / m^3
    this.saltConcentration;
    this.sugarConcentration;
    //Amounts of sugar and salt in crystal form falling from the dispenser
    this.airborneSaltGrams;
    this.airborneSugarGrams;
    //Force due to gravity near the surface of the earth in m/s^2

    //private
    this.gravity = new Vector2( 0, -9.8 );
    //Flag to indicate if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).  This is used to show/hide the "remove solutes" button
    this.anySolutes;
    SugarAndSaltSolutionModel.call( this, new ConstantDtClock( 30 ), new BeakerDimension( 0.2 ), 0.0005, //These values were sampled from the model with debug mode by printing out the model location of the mouse and moving it to a location that looks good
      0.011746031746031754, 0.026349206349206344, //In macro model scales are already tuned so no additional scaling is needed
      1 );
    //The chemistry team informed me that there is 0.2157/1000 meters cubed per mole of solid sugar
    salt = new SoluteModel( waterVolume, saltSaturationPoint, SoluteModel.VOLUME_PER_SOLID_MOLE_SALT, MacroSalt.molarMass );
    sugar = new SoluteModel( waterVolume, sugarSaturationPoint, 0.2157 / 1000.0, MacroSugar.molarMass );
    //Determine if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).  This is used to show/hide the "remove solutes" button
    anySolutes = salt.moles.greaterThan( 0 ).or( sugar.moles.greaterThan( 0 ) );
    //Total volume of the water plus any solid precipitate submerged under the water (and hence pushing it up)
    solidVolume = salt.solidVolume.plus( sugar.solidVolume );
    //When we were accounting for volume effects of dissolved solutes, the concentrations had to be defined here instead of in SoluteModel because they depend on the total volume of the solution (which in turn depends on the amount of solute dissolved in the solvent).
    saltConcentration = salt.molesDissolved.dividedBy( solution.volume );
    sugarConcentration = sugar.molesDissolved.dividedBy( solution.volume );
    //This shuts off salt/sugar when there is salt/sugar in the air that could get added to the solution
    airborneSaltGrams = new AirborneCrystalMoles( saltList ).times( salt.gramsPerMole );
    airborneSugarGrams = new AirborneCrystalMoles( sugarList ).times( sugar.gramsPerMole );
    //Properties to indicate if the user is allowed to add more of the solute.  If not allowed the dispenser is shown as empty.
    var moreSaltAllowed = salt.grams.plus( airborneSaltGrams ).lessThan( 100 );
    var moreSugarAllowed = sugar.grams.plus( airborneSugarGrams ).lessThan( 100 );
    //Add models for the various dispensers: sugar, salt, etc.
    dispensers.add( new MacroSaltShaker( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSaltAllowed, Strings.SALT, distanceScale, dispenserType, SALT, this ) );
    dispensers.add( new MacroSugarDispenser( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSugarAllowed, Strings.SUGAR, distanceScale, dispenserType, SUGAR, this ) );
    //Model for the conductivity tester
    conductivityTester = new ConductivityTester( beaker.getWidth(), beaker.getHeight() );
    //When the conductivity tester probe locations change, also update the conductivity tester brightness since they may come into contact (or leave contact) with the fluid
    conductivityTester.addConductivityTesterChangeListener( new ConductivityTesterChangeListener().withAnonymousClassBody( {
      brightnessChanged: function() {
      },
      positiveProbeLocationChanged: function() {
        updateConductivityTesterBrightness();
      },
      negativeProbeLocationChanged: function() {
        updateConductivityTesterBrightness();
      },
      locationChanged: function() {
        //Have to callback here too since the battery or bulb could get submerged and short the circuit
        updateConductivityTesterBrightness();
      }
    } ) );
    //Update the conductivity tester when the water level changes, since it might move up to touch a probe (or move out from underneath a submerged probe)
    new RichSimpleObserver().withAnonymousClassBody( {
      update: function() {
        updateConductivityTesterBrightness();
      }
    } ).observe( saltConcentration, solution.shape, outputWater );
  }

  return inherit( SugarAndSaltSolutionModel, MacroModel, {
//When a crystal is absorbed by the water, increase the number of moles in solution
    crystalAbsorbed: function( crystal ) {
      if ( crystal instanceof MacroSalt ) {
        salt.moles.set( salt.moles.get() + crystal.getMoles() );
      }
      else if ( crystal instanceof MacroSugar ) {
        sugar.moles.set( sugar.moles.get() + crystal.getMoles() );
      }
    },
//Called when the user presses a button to clear the solutes, removes all solutes from the sim
    removeSaltAndSugar: function() {
      removeSalt();
      removeSugar();
    },
//Called when the user presses a button to clear the salt, removes all salt (dissolved and crystals) from the sim
    removeSalt: function() {
      removeCrystals( saltList, saltList );
      salt.moles.set( 0.0 );
    },
//Called when the user presses a button to clear the sugar, removes all sugar (dissolved and crystals) from the sim
    removeSugar: function() {
      removeCrystals( sugarList, sugarList );
      sugar.moles.set( 0.0 );
    },
//Adds the specified Sugar crystal to the model
    addMacroSugar: function( sugar ) {
      sugarList.add( sugar );
      sugarAdded.updateListeners( sugar );
    },
//Adds the specified salt crystal to the model
    addMacroSalt: function( salt ) {
      this.saltList.add( salt );
      saltAdded.updateListeners( salt );
    },
//Propagate the sugar and salt crystals, and absorb them if they hit the water

    //private
    updateCrystals: function( dt, crystalList ) {
      var hitTheWater = [];
      for ( var crystal in crystalList ) {
        //Store the initial location so we can use the (final - start) line to check for collision with water, so it can't jump over the water rectangle
        var initialLocation = crystal.position.get();
        //slow the motion down a little bit or it moves too fast since the camera is zoomed in so much
        crystal.stepInTime( gravity.times( crystal.mass ), dt / 10, beaker.getLeftWall(), beaker.getRightWall(), beaker.getFloor(), new Line2D.Number( beaker.getFloor().getX1(), 0, beaker.getFloor().getX2(), 0 ) );
        //This is necessary because if the water layer is too thin, the crystal could have jumped over it completely
        if ( new Line2D.Number( initialLocation.toPoint2D(), crystal.position.get().toPoint2D() ).intersects( solution.shape.get().getBounds2D() ) ) {
          hitTheWater.add( crystal );
        }
        else //Any crystals that landed on the beaker base or on top of precipitate should immediately precipitate into solid so that they take up the right volume and are consistent with our other representations
        if ( crystal.isLanded() ) {
          hitTheWater.add( crystal );
        }
      }
      //Remove the salt crystals that hit the water
      removeCrystals( crystalList, hitTheWater );
      //increase concentration in the water for crystals that hit
      for ( var crystal in hitTheWater ) {
        crystalAbsorbed( crystal );
      }
      // (even if poured out crystals didn't get dissolved yet)
      airborneSaltGrams.notifyIfChanged();
      airborneSugarGrams.notifyIfChanged();
    },
//Determine if a conductivity tester probe is touching water in the beaker, or water flowing out of the beaker (which would have the same concentration as the water in the beaker)

    //private
    isProbeTouchingWaterThatMightHaveSalt: function( region ) {
      var waterBounds = solution.shape.get().getBounds2D();
      var regionBounds = region.toRectangle2D();
      return waterBounds.intersects( region.toRectangle2D() ) || outputWater.get().getBounds2D().intersects( regionBounds );
    },
//Update the conductivity tester brightness when the probes come into contact with (or stop contacting) the fluid
    updateConductivityTesterBrightness: function() {
      //Check for a collision with the probe, using the full region of each probe (so if any part intersects, there is still an electrical connection).
      var waterBounds = solution.shape.get().getBounds2D();
      //See if both probes are touching water that might have salt in it
      var bothProbesTouching = isProbeTouchingWaterThatMightHaveSalt( conductivityTester.getPositiveProbeRegion() ) && isProbeTouchingWaterThatMightHaveSalt( conductivityTester.getNegativeProbeRegion() );
      //Null checks are necessary since those regions are computed from view components and may not have been computed yet (but will be non-null if the user dragged out the conductivity tester from the toolbox)
      var batterySubmerged = conductivityTester.getBatteryRegion() != null && waterBounds.intersects( conductivityTester.getBatteryRegion().getBounds2D() );
      var bulbSubmerged = conductivityTester.getBulbRegion() != null && waterBounds.intersects( conductivityTester.getBulbRegion().getBounds2D() );
      //The circuit should short out if the battery or bulb is submerged, but only if the water is conducting due to having some salt
      var shortCircuited = (batterySubmerged || bulbSubmerged) && saltConcentration.get() > 0;
      //Use a scale factor that matches up with the limits on saturation (manually sampled at runtime)
      conductivityTester.brightness.set( bothProbesTouching && !shortCircuited ? MathUtil.clamp( 0, saltConcentration.get() * 1.62E-4, 1 ) : 0.0 );
      conductivityTester.shortCircuited.set( shortCircuited );
    },
    getAnySolutes: function() {
      return anySolutes;
    },
    reset: function() {
      super.reset();
      removeSaltAndSugar();
      conductivityTester.reset();
    },
//Determine if any salt can be removed for purposes of displaying a "remove salt" button
    isAnySaltToRemove: function() {
      return salt.moles.greaterThan( 0.0 );
    },
//Determine if any sugar can be removed for purposes of displaying a "remove sugar" button
    isAnySugarToRemove: function() {
      return sugar.moles.greaterThan( 0.0 );
    },
//Called when water (with dissolved solutes) flows out of the beaker, so that subclasses can update concentrations if necessary.
//Have some moles of salt and sugar flow out so that the concentration remains unchanged
    waterDrained: function( outVolume, initialSaltConcentration, initialSugarConcentration ) {
      //Make sure to keep the concentration the same when water flowing out.  Use the values recorded before the model stepped to ensure conservation of solute moles
      updateConcentration( outVolume, initialSaltConcentration, salt.moles );
      updateConcentration( outVolume, initialSugarConcentration, sugar.moles );
    },
//Make sure to keep the concentration the same when water flowing out

    //private
    updateConcentration: function( outVolume, concentration, moles ) {
      var molesOfSoluteLeaving = concentration * outVolume;
      moles.set( moles.get() - molesOfSoluteLeaving );
    },
//Update the model when the clock ticks
    updateModel: function( dt ) {
      //Have to record the concentrations before the model updates since the concentrations change if water is added or removed.
      var initialSaltConcentration = saltConcentration.get();
      var initialSugarConcentration = sugarConcentration.get();
      var drainedWater = super.updateModel( dt );
      //Only call when draining, would have the wrong behavior for evaporation
      if ( drainedWater > 0 ) {
        waterDrained( drainedWater, initialSaltConcentration, initialSugarConcentration );
      }
      //Move about the sugar and salt crystals, and maybe absorb them
      updateCrystals( dt, saltList );
      updateCrystals( dt, sugarList );
      return drainedWater;
    },
//Remove the specified crystals.  Note that the toRemove

    //private
    removeCrystals: function( crystalList, toRemove ) {
      for ( var crystal in new ArrayList( toRemove ) ) {
        crystal.remove();
        crystalList.remove( crystal );
      }
    }
  } );
} );

