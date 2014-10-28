// Copyright 2002-2012, University of Colorado
/**
 * Model for the micro tab, which uses code from soluble salts sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Collections = require( 'java.util.Collections' );
  var Comparator = require( 'java.util.Comparator' );
  var List = require( 'java.util.List' );
  var Logger = require( 'java.util.logging.Logger' );
  var Vector2 = require( 'DOT/Vector2' );
  var ConstantDtClock = require( 'edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock' );
  var Property = require( 'AXON/Property' );
  var CompositeProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.CompositeProperty' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var DoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty' );
  var SimpleObserver = require( 'edu.colorado.phet.common.phetcommon.util.SimpleObserver' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var LoggingUtils = require( 'edu.colorado.phet.common.phetcommon.util.logging.LoggingUtils' );
  var BeakerDimension = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/BeakerDimension' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Compound' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Formula' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Calcium' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Chloride' );
  var Oxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Oxygen' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Sodium' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var Units = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Units' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/Sucrose' );
  var SucroseCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/SucroseCrystal' );
  var SucroseCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/SucroseCrystalGrowth' );
  var CalciumChlorideCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/calciumchloride/CalciumChlorideCrystal' );
  var CalciumChlorideCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/calciumchloride/CalciumChlorideCrystalGrowth' );
  var CalciumChlorideShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/calciumchloride/CalciumChlorideShaker' );
  var CrystalStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/CrystalStrategy' );
  var DissolveDisconnectedCrystals = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/DissolveDisconnectedCrystals' );
  var DrainData = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/DrainData' );
  var Draining = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/Draining' );
  var RandomMotionWhileDraining = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/RandomMotionWhileDraining' );
  var TargetConfiguration = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/TargetConfiguration' );
  var Glucose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/glucose/Glucose' );
  var GlucoseCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/glucose/GlucoseCrystal' );
  var GlucoseCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/glucose/GlucoseCrystalGrowth' );
  var SodiumChlorideCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumchloride/SodiumChlorideCrystal' );
  var SodiumChlorideCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumchloride/SodiumChlorideCrystalGrowth' );
  var SodiumChlorideShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumchloride/SodiumChlorideShaker' );
  var Nitrate = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumnitrate/Nitrate' );
  var SodiumNitrateCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumnitrate/SodiumNitrateCrystal' );
  var SodiumNitrateCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumnitrate/SodiumNitrateCrystalGrowth' );
  var SodiumNitrateShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumnitrate/SodiumNitrateShaker' );
  var GlucoseDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/view/GlucoseDispenser' );
  var SucroseDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/view/SucroseDispenser' );
  var RED_COLORBLIND = require( 'edu.colorado.phet.common.phetcommon.view.PhetColorScheme.RED_COLORBLIND' );//static
  var Strings = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings' );//static ///*
  var SALT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/SALT' );//static
  var SUGAR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/SUGAR' );//static
  var NEUTRAL_COLOR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/NEUTRAL_COLOR' );//static
  var molesPerLiterToMolesPerMeterCubed = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Units/molesPerLiterToMolesPerMeterCubed' );//static
  var ParticleCountTable = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/ParticleCountTable' );//static ///*
  var blue = require( 'java.awt.Color.blue' );//static
  var asList = require( 'java.util.Arrays.asList' );//static


  //private
  var FRAMES_PER_SECOND = 30;
//Debugging flag for draining particles through the faucet
  var DEBUG_DRAINING = false;

  //private
  var LOGGER = LoggingUtils.getLogger( MicroModel.class.getCanonicalName() );
//Flag to help debug the crystal ratios
  var DEBUG_CRYSTAL_RATIO = false;

  function MicroModel() {
    //List of all spherical particles, the constituents in larger molecules or crystals, used for rendering on the screen
    this.sphericalParticles = new ItemList();
    //List of all free particles, used to keep track of which particles (includes molecules) to move about randomly
    this.freeParticles = new ItemList();
    //List of all drained particles, used to keep track of which particles (includes molecules) should flow out of the output drain
    this.drainedParticles = new ItemList();
    //User setting for whether color should be based on charge or identity
    this.showChargeColor = new BooleanProperty( false );
    //Determine if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).  This is used to show/hide the "remove solutes" button

    //private
    this.anySolutes = new CompositeProperty( new Function0().withAnonymousClassBody( {
      apply: function() {
        return freeParticles.size.get() > 0;
      }
    } ), freeParticles.size );
    //The number of different types of solute in solution, to determine whether to show singular or plural text for the "remove solute(s)" button
    //Note: this value should not be set externally, it should only be set by this model.  The reason that we used DoubleProperty which has a public setter is because it also has methods such as greaterThan and valueEquals
    this.numberSoluteTypes = new DoubleProperty( 0.0 );
    //Listeners that are notified when the simulation time step has completed
    this.stepFinishedListeners = [];
    //Colors for all the dissolved solutes
    //Choose nitrate to be blue because the Nitrogen atom is blue, even though it is negative and therefore also blue under "show charge color" condition

    //private
    this.sucroseColor = new CompositeProperty( new Function0().withAnonymousClassBody( {
      apply: function() {
        return showChargeColor.get() ? NEUTRAL_COLOR : RED_COLORBLIND;
      }
    } ), showChargeColor );

    //private
    this.glucoseColor = new CompositeProperty( new Function0().withAnonymousClassBody( {
      apply: function() {
        return showChargeColor.get() ? NEUTRAL_COLOR : RED_COLORBLIND;
      }
    } ), showChargeColor );

    //private
    this.nitrateColor = new CompositeProperty( new Function0().withAnonymousClassBody( {
      apply: function() {
        return showChargeColor.get() ? blue : blue;
      }
    } ), showChargeColor );
    //Flag to indicate whether the fluid is draining, since the display concentrations are held steady while draining

    //private
    this.isDraining = outputFlowRate.greaterThan( 0.0 );
    //Constituents of dissolved solutes, such as sodium, nitrate, sucrose, etc.
    this.sodium = new SoluteConstituent( this, new IonColor( this, new Sodium() ), Sodium.class, isDraining );
    this.chloride = new SoluteConstituent( this, new IonColor( this, new Chloride() ), Chloride.class, isDraining );
    this.calcium = new SoluteConstituent( this, new IonColor( this, new Calcium() ), Calcium.class, isDraining );
    this.sucrose = new SoluteConstituent( this, sucroseColor, Sucrose.class, isDraining );
    this.glucose = new SoluteConstituent( this, glucoseColor, Glucose.class, isDraining );
    this.nitrate = new SoluteConstituent( this, nitrateColor, Nitrate.class, isDraining );
    //DrainData helps to maintain a constant concentration as particles flow out the drain by tracking flow rate and timing
    //There is one DrainData for each formula since they may flow at different rates and have different schedules
    this.sodiumChlorideDrainData = new DrainData( Formula.SODIUM_CHLORIDE );
    this.sucroseDrainData = new DrainData( Formula.SUCROSE );
    this.calciumChlorideDrainData = new DrainData( Formula.CALCIUM_CHLORIDE );
    this.sodiumNitrateDrainData = new DrainData( Formula.SODIUM_NITRATE );
    this.glucoseDrainData = new DrainData( Formula.GLUCOSE );
    //Lists of compounds
    this.sodiumChlorideCrystals = new ItemList();
    this.sodiumNitrateCrystals = new ItemList();
    this.calciumChlorideCrystals = new ItemList();
    this.sucroseCrystals = new ItemList();
    this.glucoseCrystals = new ItemList();
    //Determine saturation points
    this.sodiumChlorideSaturationPoint = molesPerLiterToMolesPerMeterCubed( 6.14 );
    this.calciumChlorideSaturationPoint = molesPerLiterToMolesPerMeterCubed( 6.71 );
    this.sodiumNitrateSaturationPoint = molesPerLiterToMolesPerMeterCubed( 10.8 );
    this.sucroseSaturationPoint = molesPerLiterToMolesPerMeterCubed( 5.84 );
    this.glucoseSaturationPoint = molesPerLiterToMolesPerMeterCubed( 5.05 );
    //Create observable properties that indicate whether each solution type is saturated
    //We previously used "or" in these conjunctions to mean that a compound is saturated if either of its constituents passes the threshold.
    //However, this has incorrect behavior for kits of mixed types, such as NaCl and CaCl2, since Cl saturation would lead to crystallization of both compounds (even if not enough Na)
    //Therefore it is essential to use "and" conjunctions to supported kits that share a solute component
    this.sodiumChlorideSaturated = sodium.concentration.greaterThan( sodiumChlorideSaturationPoint ).and( chloride.concentration.greaterThan( sodiumChlorideSaturationPoint ) );
    this.calciumChlorideSaturated = calcium.concentration.greaterThan( calciumChlorideSaturationPoint ).and( chloride.concentration.greaterThan( calciumChlorideSaturationPoint * 2 ) );
    this.sucroseSaturated = sucrose.concentration.greaterThan( sucroseSaturationPoint );
    this.glucoseSaturated = glucose.concentration.greaterThan( glucoseSaturationPoint );
    this.sodiumNitrateSaturated = sodium.concentration.greaterThan( sodiumNitrateSaturationPoint ).and( nitrate.concentration.greaterThan( sodiumNitrateSaturationPoint ) );
    //Keep track of which kit the user has selected so that particle draining can happen in formula units so there isn't an unbalanced number of solutes for crystallization

    //private
    this.kit;
    //The index of the kit selected by the user
    this.selectedKit = new Property( 0 ).withAnonymousClassBody( {
      initializer: function() {
        //When the user switches kits, clear the solutes and reset the water level
        addObserver( new SimpleObserver().withAnonymousClassBody( {
          update: function() {
            clearSolutes();
            resetWater();
            //Decided not to implement before 1.00 published, but may be useful if other kit features are added in the future
            if ( get() == 0 ) {
              kit = new MicroModelKit( Formula.SODIUM_CHLORIDE, Formula.SUCROSE );
            }
            else if ( get() == 1 ) {
              kit = new MicroModelKit( Formula.SODIUM_CHLORIDE, Formula.CALCIUM_CHLORIDE );
            }
            else if ( get() == 2 ) {
              kit = new MicroModelKit( Formula.SODIUM_CHLORIDE, Formula.SODIUM_NITRATE );
            }
            else if ( get() == 3 ) {
              kit = new MicroModelKit( Formula.SUCROSE, Formula.GLUCOSE );
            }
            else {
              throw new RuntimeException( "Unknown kit" );
            }
          }
        } ) );
      }
    } );
    //Rules for growing each crystal incrementally from existing dissolved constituents
    this.sodiumChlorideCrystalGrowth = new SodiumChlorideCrystalGrowth( this, sodiumChlorideCrystals );
    this.sodiumNitrateCrystalGrowth = new SodiumNitrateCrystalGrowth( this, sodiumNitrateCrystals );
    this.calciumChlorideCrystalGrowth = new CalciumChlorideCrystalGrowth( this, calciumChlorideCrystals );
    this.sucroseCrystalGrowth = new SucroseCrystalGrowth( this, sucroseCrystals );
    this.glucoseCrystalGrowth = new GlucoseCrystalGrowth( this, glucoseCrystals );
    //Updates the particles when the user drains solution
    this.draining = new Draining( this );
    //Workaround for completely dissolving any crystals that have become disconnected as a result of partial dissolving
    this.dissolveDisconnectedCrystals = new DissolveDisconnectedCrystals( this );
    //Amount to move back particles (in meters) to prevent them from going past the edge of the beaker
    this.modelInset = 1E-12;
    //SolubleSalts clock runs much faster than wall time
    SugarAndSaltSolutionModel.call( this, new ConstantDtClock( FRAMES_PER_SECOND ), // width = cube root(8E-23)
      new BeakerDimension( Math.pow( 8E-23 * //convert L to meters cubed
                                     0.001, 1 / 3.0 ) ), //Flow rate must be slowed since the beaker is microscopically small, this value determines how fast it will fill up
      5.0E-27, //Should be moved to be high enough to contain the largest molecule (sucrose), so that it may move about freely
      2.8440282964793075E-10, 5.75234062238494E-10, //This was tuned so that drag motions in each model are commensurate
      1.1603972084031932E9 );
    //Property that identifies the number of sucrose molecules in crystal form, for making sure the user doesn't exceed the allowed maximum
    var numSucroseMoleculesInCrystal = new CrystalMoleculeCount( sucroseCrystals );
    var numGlucoseMoleculesInCrystal = new CrystalMoleculeCount( glucoseCrystals );
    //For sucrose & glucose, account for non-dissolved crystals.  Otherwise the user can go over the limit since falling crystals aren't counted
    var moreSodiumChlorideAllowed = sphericalParticles.propertyCount( Sodium.class ).lessThan( MAX_SODIUM_CHLORIDE ).or( sphericalParticles.propertyCount( Chloride.class ).lessThan( MAX_SODIUM_CHLORIDE ) );
    var moreCalciumChlorideAllowed = sphericalParticles.propertyCount( Calcium.class ).lessThan( MAX_CALCIUM_CHLORIDE ).or( sphericalParticles.propertyCount( Chloride.class ).lessThan( MAX_CALCIUM_CHLORIDE ) );
    var moreSodiumNitrateAllowed = sphericalParticles.propertyCount( Sodium.class ).lessThan( MAX_SODIUM_NITRATE ).or( sphericalParticles.propertyCount( Oxygen.class ).lessThan( MAX_SODIUM_NITRATE * 3 ) );
    var moreSucroseAllowed = (freeParticles.propertyCount( Sucrose.class ).plus( numSucroseMoleculesInCrystal )).lessThan( MAX_SUCROSE );
    var moreGlucoseAllowed = (freeParticles.propertyCount( Glucose.class ).plus( numGlucoseMoleculesInCrystal )).lessThan( MAX_GLUCOSE );
    //Note that this is done by associating a DispenserType with the dispenser model element, a more direct way would be to create class Substance that has both a dispenser type and a node factory
    dispensers.add( new SodiumChlorideShaker( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSodiumChlorideAllowed, SODIUM_CHLORIDE_NEW_LINE, distanceScale, dispenserType, SALT, this ) );
    dispensers.add( new SodiumNitrateShaker( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSodiumNitrateAllowed, SODIUM_NITRATE_NEW_LINE, distanceScale, dispenserType, DispenserType.SODIUM_NITRATE, this ) );
    dispensers.add( new SucroseDispenser( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSucroseAllowed, SUCROSE, distanceScale, dispenserType, SUGAR, this ) );
    dispensers.add( new CalciumChlorideShaker( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreCalciumChlorideAllowed, CALCIUM_CHLORIDE_NEW_LINE, distanceScale, dispenserType, DispenserType.CALCIUM_CHLORIDE, this ) );
    dispensers.add( new GlucoseDispenser( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreGlucoseAllowed, GLUCOSE, distanceScale, dispenserType, DispenserType.GLUCOSE, this ) );
    //When the output flow rate changes, recompute the desired flow rate for each formula type to help ensure a constant concentration over time for each formula constituents
    outputFlowRate.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( outputFlowRate ) {
        checkStartDrain( sodiumChlorideDrainData );
        checkStartDrain( sucroseDrainData );
        checkStartDrain( calciumChlorideDrainData );
        checkStartDrain( sodiumNitrateDrainData );
        checkStartDrain( glucoseDrainData );
      }
    } ) );
  }

  return inherit( SugarAndSaltSolutionModel, MicroModel, {
//store the concentrations of all solutes and set up a drain schedule,
//so that particles will flow out at rates so as to keep the concentration level as constant as possible
      checkStartDrain: function( drainData ) {
        var currentDrainFlowRate = outputFlowRate.get() * faucetFlowRate;
        var timeToDrainFully = solution.volume.get() / currentDrainFlowRate;
        LOGGER.fine( "clock.getDt() = " + clock.getDt() + ", time to drain fully: " + timeToDrainFully );
        if ( currentDrainFlowRate > 0 ) {
          if ( drainData.previousDrainFlowRate == 0 ) {
            //When draining, try to attain this number of target ions per volume as closely as possible
            drainData.initialNumberFormulaUnits = countFreeFormulaUnits( drainData.formula );
            drainData.initialVolume = solution.volume.get();
          }
        }
        drainData.previousDrainFlowRate = currentDrainFlowRate;
      },
//Count the number of formula units matching the specified formula
//This is tricky since some kits have 2 solutes that share a component like NaCl + NaNO3
//So we have to assume that:
//1. all other actions conserve formula unit counts to make these calculations
//2. Kits are simple enough that that formula units could be computed independently.  For instance if one kit had NaCl and another copy of NaCl, then it wouldn't be able to distinguish them
//TODO: Consider consolidating this and other kit definition code in MicroModel.selectedKit
      countFreeFormulaUnits: function( formula ) {
        if ( selectedKit.get() == 0 ) {
          return countFreeFormulaUnitsKit0( formula );
        }
        else if ( selectedKit.get() == 1 ) {
          return countFreeFormulaUnitsKit1( formula );
        }
        else if ( selectedKit.get() == 2 ) {
          return countFreeFormulaUnitsKit2( formula );
        }
        else if ( selectedKit.get() == 3 ) {
          return countFreeFormulaUnitsKit3( formula );
        }
        else {
          throw new RuntimeException( "Kit not found" );
        }
      },
//See docs for countFreeFormulaUnits; solutes are independent so it is easy

      //private
      countFreeFormulaUnitsKit0: function( formula ) {
        if ( formula.equals( Formula.SODIUM_CHLORIDE ) ) {
          return freeParticles.count( Sodium.class );
        }
        else if ( formula.equals( Formula.SUCROSE ) ) {
          return freeParticles.count( Sucrose.class );
        }
        else {
          return 0;
        }
      },
//See docs for countFreeFormulaUnits; chloride is shared so it cannot be used to count

      //private
      countFreeFormulaUnitsKit1: function( formula ) {
        if ( formula.equals( Formula.SODIUM_CHLORIDE ) ) {
          return freeParticles.count( Sodium.class );
        }
        else if ( formula.equals( Formula.CALCIUM_CHLORIDE ) ) {
          return freeParticles.count( Calcium.class );
        }
        else {
          return 0;
        }
      },
//See docs for countFreeFormulaUnits; sodium is shared so it cannot be used to count

      //private
      countFreeFormulaUnitsKit2: function( formula ) {
        if ( formula.equals( Formula.SODIUM_CHLORIDE ) ) {
          return freeParticles.count( Chloride.class );
        }
        else if ( formula.equals( Formula.SODIUM_NITRATE ) ) {
          return freeParticles.count( Nitrate.class );
        }
        else {
          return 0;
        }
      },
//See docs for countFreeFormulaUnits; solutes are independent so it is easy

      //private
      countFreeFormulaUnitsKit3: function( formula ) {
        if ( formula.equals( Formula.SUCROSE ) ) {
          return freeParticles.count( Sucrose.class );
        }
        else if ( formula.equals( Formula.GLUCOSE ) ) {
          return freeParticles.count( Glucose.class );
        }
        else {
          return 0;
        }
      },
//When the simulation clock ticks, move the particles
      updateModel: function( dt ) {
        super.updateModel( dt );
        //It has to be cleared in each iteration
        draining.clearParticleGroupings();
        //Do this before updating the free particles since this could change their strategy
        if ( outputFlowRate.get() > 0 ) {
          //Set up all particles to have a random walk toward the drain, nearest particles in each formula unit will get exact speed in a later step and their strategy will be replaced
          new RandomMotionWhileDraining( this ).apply();
          //it catches up, then gets de-prioritized, which makes particles switch between formula groups and creates incorrect velocities
          var drainDataList = asList( sodiumChlorideDrainData, sucroseDrainData, calciumChlorideDrainData, sodiumNitrateDrainData, glucoseDrainData );
          Collections.sort( drainDataList, new Comparator().withAnonymousClassBody( {
            compare: function( a, b ) {
              return Number.compare( draining.getTimeToError( a, dt ), draining.getTimeToError( b, dt ) );
            }
          } ) );
          for ( var drainData in drainDataList ) {
            draining.updateParticlesFlowingToDrain( drainData, dt );
          }
        }
        //Iterate over all particles and let them update in time
        for ( var freeParticle in joinLists( freeParticles, sodiumChlorideCrystals, sodiumNitrateCrystals, calciumChlorideCrystals, sucroseCrystals, glucoseCrystals, drainedParticles ) ) {
          freeParticle.stepInTime( dt );
        }
        //Workaround for completely dissolving any crystals that have become disconnected as a result of partial dissolving
        dissolveDisconnectedCrystals.apply( sodiumChlorideCrystals );
        dissolveDisconnectedCrystals.apply( sodiumNitrateCrystals );
        dissolveDisconnectedCrystals.apply( calciumChlorideCrystals );
        dissolveDisconnectedCrystals.apply( sucroseCrystals );
        dissolveDisconnectedCrystals.apply( glucoseCrystals );
        if ( DEBUG_CRYSTAL_RATIO ) {
          for ( var sodiumChlorideCrystal in sodiumChlorideCrystals ) {
            var matches = sodiumChlorideCrystal.matchesFormulaRatio();
            console.log( "matches = " + matches );
          }
          var count = 0;
          for ( var calciumChlorideCrystal in calciumChlorideCrystals ) {
            console.log( "calciumChlorideCrystal[" + count + ", match = " + calciumChlorideCrystal.matchesFormulaRatio() );
            count++;
          }
          for ( var crystal in joinLists( sodiumChlorideCrystals, sodiumNitrateCrystals, calciumChlorideCrystals, sucroseCrystals, glucoseCrystals ) ) {
            var c = crystal;
            var matches = c.matchesFormulaRatio();
            if ( !matches ) {
              console.log( "Crystal didn't match formula ratio: " + c );
            }
          }
        }
        //Allow the crystals to grow--not part of the strategies because it has to look at all particles within a group to decide which to crystallize
        sodiumChlorideCrystalGrowth.allowCrystalGrowth( dt, sodiumChlorideSaturated );
        sucroseCrystalGrowth.allowCrystalGrowth( dt, sucroseSaturated );
        glucoseCrystalGrowth.allowCrystalGrowth( dt, glucoseSaturated );
        calciumChlorideCrystalGrowth.allowCrystalGrowth( dt, calciumChlorideSaturated );
        sodiumNitrateCrystalGrowth.allowCrystalGrowth( dt, sodiumNitrateSaturated );
        //Count the number of different formulae present in solution, that is the number of solutes
        var count = kit.getFormulae().filter( new Function1().withAnonymousClassBody( {
          apply: function( formula ) {
            return countFreeFormulaUnits( formula ) > 0;
          }
        } ) ).size();
        numberSoluteTypes.set( count + 0.0 );
        //Notify listeners that the update step completed
        for ( var listener in stepFinishedListeners ) {
          listener.apply();
        }
        //Water can be drained but this value is never used so no need to compute it exactly
        return 0;
      },
//Combine elements from several lists so they can be iterated over together

      //private
      joinLists: function( freeParticles ) {
        var p = [];
        for ( var freeParticle in freeParticles ) {
          var list = freeParticle.toList();
          for ( var o in list ) {
            p.add( o );
          }
        }
        return p;
      },
//Add a single salt crystal to the model
      addSodiumChlorideCrystal: function( sodiumChlorideCrystal ) {
        //Add the components of the lattice to the model so the graphics will be created
        for ( var atom in sodiumChlorideCrystal ) {
          sphericalParticles.add( atom );
        }
        sodiumChlorideCrystals.add( sodiumChlorideCrystal );
        sodiumChlorideCrystal.setUpdateStrategy( new CrystalStrategy( this, sodiumChlorideCrystals, sodiumChlorideSaturated ) );
      },
//Add a single sodium nitrate crystal to the model
      addSodiumNitrateCrystal: function( crystal ) {
        crystal.setUpdateStrategy( new CrystalStrategy( this, sodiumNitrateCrystals, sodiumNitrateSaturated ) );
        addComponents( crystal );
        sodiumNitrateCrystals.add( crystal );
      },
//Add all SphericalParticles contained in the compound so the graphics will be created

      //private
      addComponents: function( compound ) {
        for ( var sphericalParticle in compound.getAllSphericalParticles() ) {
          sphericalParticles.add( sphericalParticle );
        }
      },
//Remove all SphericalParticles contained in the compound so the graphics will be deleted
      removeComponents: function( compound ) {
        for ( var sphericalParticle in compound.getAllSphericalParticles() ) {
          sphericalParticles.remove( sphericalParticle );
        }
      },
      addCalciumChlorideCrystal: function( calciumChlorideCrystal ) {
        calciumChlorideCrystal.setUpdateStrategy( new CrystalStrategy( this, calciumChlorideCrystals, calciumChlorideSaturated ) );
        addComponents( calciumChlorideCrystal );
        calciumChlorideCrystals.add( calciumChlorideCrystal );
      },
//Add a sucrose crystal to the model, and add graphics for all its constituent particles
      addSucroseCrystal: function( sucroseCrystal ) {
        sucroseCrystal.setUpdateStrategy( new CrystalStrategy( this, sucroseCrystals, sucroseSaturated ) );
        addComponents( sucroseCrystal );
        sucroseCrystals.add( sucroseCrystal );
      },
//Add a glucose crystal to the model, and add graphics for all its constituent particles
      addGlucoseCrystal: function( glucoseCrystal ) {
        glucoseCrystal.setUpdateStrategy( new CrystalStrategy( this, glucoseCrystals, glucoseSaturated ) );
        addComponents( glucoseCrystal );
        glucoseCrystals.add( glucoseCrystal );
      },
//Keep the particle within the beaker solution bounds
      preventFromLeavingBeaker: function( particle ) {
        //If the particle ever entered the water fully, don't let it leave through the top
        if ( particle.hasSubmerged() ) {
          preventFromMovingPastWaterTop( particle );
        }
        preventFromFallingThroughBeakerBase( particle );
        preventFromFallingThroughBeakerRight( particle );
        preventFromFallingThroughBeakerLeft( particle );
      },
//prevent particles from falling through the top of the water

      //private
      preventFromMovingPastWaterTop: function( particle ) {
        var waterTopY = solution.shape.get().getBounds2D().getMaxY();
        var particleTopY = particle.getShape().getBounds2D().getMaxY();
        if ( particleTopY > waterTopY ) {
          particle.translate( 0, waterTopY - particleTopY - modelInset );
        }
      },
      isCrystalTotallyAboveTheWater: function( crystal ) {
        return crystal.getShape().getBounds2D().getY() > solution.shape.get().getBounds2D().getMaxY();
      },
      boundToBeakerBottom: function( particle ) {
        if ( particle.getShape().getBounds2D().getMinY() < 0 ) {
          particle.translate( 0, -particle.getShape().getBounds2D().getMinY() );
        }
      },
//Get the external force acting on the particle, gravity if the particle is in free fall or zero otherwise (e.g., in solution)
      getExternalForce: function( anyPartUnderwater ) {
        return new Vector2( 0, anyPartUnderwater ? 0 : -9.8 );
      },
//Determine whether the object is underwater--when it touches the water it should slow down
      isAnyPartUnderwater: function( particle ) {
        return particle.getShape().intersects( solution.shape.get().getBounds2D() );
      },
      collideWithWater: function( particle ) {
        particle.velocity.set( new Vector2( 0, -1 ).times( 0.25E-9 ) );
      },
      reset: function() {
        super.reset();
        //Clear out solutes, particles, concentration values
        clearSolutes();
        //Reset model for user settings
        showConcentrationValues.reset();
        dispenserType.reset();
        showChargeColor.reset();
        selectedKit.reset();
        clockRunning.reset();
      },
//Remove all solutes from the model
      clearSolutes: function() {
        //Clear particle lists
        sphericalParticles.clear();
        freeParticles.clear();
        sodiumChlorideCrystals.clear();
        sodiumNitrateCrystals.clear();
        calciumChlorideCrystals.clear();
        sucroseCrystals.clear();
      },
//Determine if there is any table salt to remove
      isAnySaltToRemove: function() {
        return sodium.concentration.greaterThan( 0.0 ).and( chloride.concentration.greaterThan( 0.0 ) );
      },
//Determine if there is any sugar that can be removed
      isAnySugarToRemove: function() {
        return sucrose.concentration.greaterThan( 0.0 );
      },
      getAnySolutes: function() {
        return anySolutes;
      },
//Iterate over particles that take random walks so they don't move above the top of the water

      //private
      updateParticlesDueToWaterLevelDropped: function( changeInWaterHeight ) {
        waterLevelDropped( freeParticles, changeInWaterHeight );
        waterLevelDropped( sucroseCrystals, changeInWaterHeight );
        waterLevelDropped( sodiumChlorideCrystals, changeInWaterHeight );
        waterLevelDropped( calciumChlorideCrystals, changeInWaterHeight );
        waterLevelDropped( sodiumNitrateCrystals, changeInWaterHeight );
      },
//When water level decreases, move the particles down with the water level.
//Beaker base is at y=0.  Move particles proportionately to how close they are to the top.

      //private
      waterLevelDropped: function( particles, volumeDropped ) {
        var changeInWaterHeight = beaker.getHeightForVolume( volumeDropped ) - beaker.getHeightForVolume( 0 );
        for ( var particle in particles ) {
          if ( waterVolume.get() > 0 ) {
            var yLocationInBeaker = particle.getPosition().getY();
            var waterTopY = beaker.getHeightForVolume( waterVolume.get() );
            //Only move particles down if they are fully underwater
            if ( yLocationInBeaker < waterTopY ) {
              var fractionToTop = yLocationInBeaker / waterTopY;
              particle.translate( 0, -changeInWaterHeight * fractionToTop );
              //Prevent particles from leaving the top of the liquid
              preventFromLeavingBeaker( particle );
            }
          }
          //would just fall back to the water level
          preventFromFallingThroughBeakerBase( particle );
        }
      },
//prevent particles from falling through the bottom of the beaker

      //private
      preventFromFallingThroughBeakerBase: function( particle ) {
        var bottomY = particle.getShape().getBounds2D().getMinY();
        if ( bottomY < 0 ) {
          particle.translate( 0, -bottomY + modelInset );
        }
      },
//prevent particles from falling through the bottom of the beaker

      //private
      preventFromFallingThroughBeakerLeft: function( particle ) {
        var left = particle.getShape().getBounds2D().getMinX();
        if ( left < beaker.getLeftWall().getX1() ) {
          particle.translate( beaker.getLeftWall().getX1() - left, 0 );
        }
      },
//prevent particles from falling through the bottom of the beaker

      //private
      preventFromFallingThroughBeakerRight: function( particle ) {
        var right = particle.getShape().getBounds2D().getMaxX();
        if ( right > beaker.getRightWall().getX1() ) {
          particle.translate( beaker.getRightWall().getX1() - right, 0 );
        }
      },
//When water evaporates, move the particles so they move down with the water level
      waterEvaporated: function( evaporatedWater ) {
        super.waterEvaporated( evaporatedWater );
        updateParticlesDueToWaterLevelDropped( evaporatedWater );
      },
//Get the target configurations for some crystals for debugging purposes
      getAllBondingSites: function() {
        var s = [];
        for ( var crystal in sodiumChlorideCrystals ) {
          s.add( new SodiumChlorideCrystalGrowth( this, sodiumChlorideCrystals ).getTargetConfiguration( crystal ) );
        }
        for ( var crystal in calciumChlorideCrystals ) {
          s.add( new CalciumChlorideCrystalGrowth( this, calciumChlorideCrystals ).getTargetConfiguration( crystal ) );
        }
        return s;
      },
//Require crystallization and prevent dissolving when water volume is below this threshold.
//This is because there is so little water it would be impossible to dissolve anything and everything should crystallize
      isWaterBelowCrystalThreshold: function() {
        return waterVolume.get() <= Units.litersToMetersCubed( 0.03E-23 );
      }
    },
//statics
    {
      DEBUG_DRAINING: DEBUG_DRAINING,
      DEBUG_CRYSTAL_RATIO: DEBUG_CRYSTAL_RATIO
    } );
} );

