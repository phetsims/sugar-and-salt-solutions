//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Model for the micro tab, which uses code from soluble salts sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Logger = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/Logger' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/SugarAndSaltSolutionModel' );
  var BeakerDimension = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/BeakerDimension' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Formula' );
  var Vector2 = require( 'DOT/Vector2' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/DispenserType' );
  var Units = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Units' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ItemList' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Property = require( 'AXON/Property' );
  var ParticleColorConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/ParticleColorConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Sodium' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Chloride' );
  var Oxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Oxygen' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Calcium' );
  var IonColor = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/IonColor' );
  var CrystalMoleculeCount = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/CrystalMoleculeCount' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sucrose/Sucrose' );
  var Glucose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/glucose/Glucose' );
  var Nitrate = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/Nitrate' );
  var DrainData = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DrainData' );
  var Draining = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/Draining' );
  var CrystalStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalStrategy' );
  var RandomMotionWhileDraining = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/RandomMotionWhileDraining' );
  var DissolveDisconnectedCrystals = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DissolveDisconnectedCrystals' );
  var MicroModelKit = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/MicroModelKit' );
  var ParticleCountTable = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/ParticleCountTable' );
  var SoluteConstituent = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/SoluteConstituent' );
  var CalciumChlorideShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/calciumchloride/CalciumChlorideShaker' );
  var SodiumChlorideCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumchloride/SodiumChlorideCrystalGrowth' );
  var SodiumChlorideShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumchloride/SodiumChlorideShaker' );
  var SodiumNitrateCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/SodiumNitrateCrystalGrowth' );
  var SodiumNitrateShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/SodiumNitrateShaker' );
  var SucroseDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sucrose/SucroseDispenser' );
  var CalciumChlorideCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/calciumchloride/CalciumChlorideCrystalGrowth' );
  var SucroseCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sucrose/SucroseCrystalGrowth' );
  var GlucoseCrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/glucose/GlucoseCrystalGrowth' );
  var GlucoseDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/glucose/GlucoseDispenser' );


  // strings
  var SODIUM_CHLORIDE_NEW_LINE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sodiumChlorideNewLine' );
  var CALCIUM_CHLORIDE_NEW_LINE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/calciumChlorideNewLine' );
  var SODIUM_NITRATE_NEW_LINE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sodiumNitrateNewLine' );
  var SUCROSE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sucrose' );
  var GLUCOSE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/glucose' );

  // constants
  //Debugging flag for draining particles through the faucet
  // TODO var DEBUG_DRAINING = false;
  //Flag to help debug the crystal ratios
  var DEBUG_CRYSTAL_RATIO = false;

  function MicroModel( aspectRatio ) {
    var thisModel = this;

    SugarAndSaltSolutionModel.call( thisModel,
      aspectRatio, //Use the same aspect ratio as the view to minimize insets with blank regions
      30, //frames per second
      //The volume of the micro beaker should be 2E-23L
      //In the macro tab, the dimension is BeakerDimension( width = 0.2, height = 0.1, depth = 0.1 ), each unit in meters
      //So if it is to have the same shape is as the previous tab then we use  width*height*depth = 2E-23
      // and  width = 2*height = 2*depth
      // Solving for width, we have:
      // 2E-23 = width * width/2 * width/2
      // =>
      // 8E-23 = width^3.  Therefore
      // width = cube root(8E-23)
      new BeakerDimension( Math.pow( 8E-23 * 0.001, 1 / 3.0 ) ),  //convert L to meters cubed

      //Flow rate must be slowed since the beaker is microscopically small, this value determines how fast it will fill up
      5.0E-27,

      //Values sampled at runtime using a debugger using this line in SugarAndSaltSolutionModel.update:
      //System.out.println( "solution.shape.get().getBounds2D().getMaxY() = " + solution.shape.get().getBounds2D().getMaxY() );
      //Should be moved to be high enough to contain the largest molecule (sucrose), so that it may move about freely
      2.8440282964793075E-10, 5.75234062238494E-10,

      //Ratio of length scales in meters
      //The amount to scale model translations so that micro tab emits solute at the appropriate time.  Without this factor,
      //the tiny (1E-9 meters) drag motion in the Micro tab wouldn't be enough to emit solute
      //This was tuned so that drag motions in each model are commensurate
      1.1603972084031932E9 );

    //List of all spherical particles, the constituents in larger molecules or crystals, used for rendering on the screen
    this.sphericalParticles = new ItemList();

    //List of all free particles, used to keep track of which particles (includes molecules) to move about randomly
    this.freeParticles = new ItemList();

    //List of all drained particles, used to keep track of which particles (includes molecules) should flow out of the
    //output drain
    this.drainedParticles = new ItemList();

    //User setting for whether color should be based on charge or identity
    this.showChargeColor = new BooleanProperty( false );

    //Determine if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).
    //This is used to show/hide the "remove solutes" button
    //@private
    this.anySolutes = new DerivedProperty( [ this.freeParticles.lengthProperty ], function( length ) {
      return thisModel.freeParticles.length > 0;
    } );

    //The number of different types of solute in solution, to determine whether to show singular or plural text for the "remove solute(s)" button
    //Note: this value should not be set externally, it should only be set by this model.  The reason that we used DoubleProperty which has a public setter
    //is because it also has methods such as greaterThan and valueEquals
    this.numberSoluteTypes = new Property( 0.0 );

    // Colors for all the dissolved solutes
    //Choose nitrate to be blue because the Nitrogen atom is blue, even though it is negative and therefore also blue under "show charge color" condition
    //@private
    this.sucroseColor = new DerivedProperty( [ thisModel.showChargeColor ], function() {
      return thisModel.showChargeColor.get() ? ParticleColorConstants.NEUTRAL_COLOR : ParticleColorConstants.RED_COLORBLIND;
    } );
    //@private
    this.glucoseColor = new DerivedProperty( [ thisModel.showChargeColor ], function() {
      return thisModel.showChargeColor.get() ? ParticleColorConstants.NEUTRAL_COLOR : ParticleColorConstants.RED_COLORBLIND;
    } );
    //@private
    this.nitrateColor = new DerivedProperty( [ thisModel.showChargeColor ], function() {
      return thisModel.showChargeColor.get() ? Color.BLUE : Color.BLUE; // why blue for both conditions..check ..? TODO
    } );


    //@private Flag to indicate whether the fluid is draining, since the display
    // concentrations are held steady while draining
    this.isDraining = new DerivedProperty( [ this.outputFlowRate ], function( outputFlowRate ) { return outputFlowRate > 0; } );

    //Constituents of dissolved solutes, such as sodium, nitrate, sucrose, etc.
    this.sodium = new SoluteConstituent( this, new IonColor( this, new Sodium() ), Sodium, this.isDraining );
    this.chloride = new SoluteConstituent( this, new IonColor( this, new Chloride() ), Chloride, this.isDraining );
    this.calcium = new SoluteConstituent( this, new IonColor( this, new Calcium() ), Calcium, this.isDraining );
    this.sucrose = new SoluteConstituent( this, this.sucroseColor, Sucrose, this.isDraining );
    this.glucose = new SoluteConstituent( this, this.glucoseColor, Glucose, this.isDraining );
    this.nitrate = new SoluteConstituent( this, this.nitrateColor, Nitrate, this.isDraining );

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
    this.sodiumChlorideSaturationPoint = Units.molesPerLiterToMolesPerMeterCubed( 6.14 );
    this.calciumChlorideSaturationPoint = Units.molesPerLiterToMolesPerMeterCubed( 6.71 );
    this.sodiumNitrateSaturationPoint = Units.molesPerLiterToMolesPerMeterCubed( 10.8 );
    this.sucroseSaturationPoint = Units.molesPerLiterToMolesPerMeterCubed( 5.84 );
    this.glucoseSaturationPoint = Units.molesPerLiterToMolesPerMeterCubed( 5.05 );

    //Create observable properties that indicate whether each solution type is saturated
    //We previously used "or" in these conjunctions to mean that a compound is saturated if either of its constituents passes the threshold.
    //However, this has incorrect behavior for kits of mixed types, such as NaCl and CaCl2, since Cl saturation would
    //lead to crystallization of both compounds (even if not enough Na)
    //Therefore it is essential to use "and" conjunctions to supported kits that share a solute component
    this.sodiumChlorideSaturated = new DerivedProperty( [ this.sodium.concentration, this.chloride.concentration ],
      function( sodiumConcentration, chlorideConcentration ) {
        return sodiumConcentration > thisModel.sodiumChlorideSaturationPoint && chlorideConcentration > thisModel.sodiumChlorideSaturationPoint;
      } );

    this.calciumChlorideSaturated = new DerivedProperty( [ this.calcium.concentration, this.chloride.concentration ],
      function( calciumConcentration, chlorideConcentration ) {
        return calciumConcentration > thisModel.calciumChlorideSaturationPoint && chlorideConcentration > thisModel.calciumChlorideSaturationPoint * 2;
      } );

    this.sucroseSaturated = new DerivedProperty( [ this.sucrose.concentration ], function( sucroseConcentration ) {
      return sucroseConcentration > thisModel.sucroseSaturationPoint;
    } );

    this.glucoseSaturated = new DerivedProperty( [ this.glucose.concentration ], function( glucoseSaturation ) {
      return glucoseSaturation > thisModel.glucoseSaturationPoint;
    } );

    this.sodiumNitrateSaturated = new DerivedProperty( [ this.sodium.concentration, this.nitrate.concentration ],
      function( sodiumConcentration, nitrateConcentration ) {
        return sodiumConcentration > thisModel.sodiumNitrateSaturationPoint && nitrateConcentration > thisModel.sodiumNitrateSaturationPoint;
      } );

    //Keep track of which kit the user has selected so that particle draining can happen in formula units
    // so there isn't an unbalanced number of solutes for crystallization
    this.kit = null;

    //The index of the kit selected by the user
    this.selectedKit = new Property( 0 );
    this.selectedKit.link( function( value ) {
      //When the user switches kits, clear the solutes and reset the water level
      thisModel.clearSolutes();
      thisModel.resetWater();

      //TODO: Consider consolidating this and other kit definition code in MicroModel.countFreeFormulaUnits
      //Decided not to implement before 1.00 published, but may be useful if other kit features are added in the future
      if ( value === 0 ) { thisModel.kit = new MicroModelKit( Formula.SODIUM_CHLORIDE, Formula.SUCROSE ); }
      else if ( value === 1 ) { thisModel.kit = new MicroModelKit( Formula.SODIUM_CHLORIDE, Formula.CALCIUM_CHLORIDE ); }
      else if ( value === 2 ) { thisModel.kit = new MicroModelKit( Formula.SODIUM_CHLORIDE, Formula.SODIUM_NITRATE ); }
      else if ( value === 3 ) { thisModel.kit = new MicroModelKit( Formula.SUCROSE, Formula.GLUCOSE ); }

    } );

    //@protected
    //Rules for growing each crystal incrementally from existing dissolved constituents
    this.sodiumChlorideCrystalGrowth = new SodiumChlorideCrystalGrowth( this, this.sodiumChlorideCrystals );
    this.sodiumNitrateCrystalGrowth = new SodiumNitrateCrystalGrowth( this, this.sodiumNitrateCrystals );
    this.calciumChlorideCrystalGrowth = new CalciumChlorideCrystalGrowth( this, this.calciumChlorideCrystals );
    this.sucroseCrystalGrowth = new SucroseCrystalGrowth( this, this.sucroseCrystals );
    this.glucoseCrystalGrowth = new GlucoseCrystalGrowth( this, this.glucoseCrystals );

    //Updates the particles when the user drains solution
    this.draining = new Draining( this );

    //Workaround for completely dissolving any crystals that have become disconnected as a result of partial dissolving
    this.dissolveDisconnectedCrystals = new DissolveDisconnectedCrystals( this );

    //Amount to move back particles (in meters) to prevent them from going past the edge of the beaker
    this.modelInset = 1E-12;

    //Property that identifies the number of sucrose molecules in crystal form, for making sure the user doesn't exceed the allowed maximum
    this.numSucroseMoleculesInCrystal = new CrystalMoleculeCount( this.sucroseCrystals );
    this.numGlucoseMoleculesInCrystal = new CrystalMoleculeCount( this.glucoseCrystals );

    //Determine whether the user is allowed to add more of each type, based on the particle table
    //These computations make the simplifying assumption that only certain combinations of molecules will appear together
    //This allows us to say, for example, that more NaNO3 may be added if Oxygen is not over the limit, adding another molecule to its kit that contains
    //oxygen would cause this to give incorrect limiting behavior
    //For sucrose & glucose, account for non-dissolved crystals.  Otherwise the user can go over the limit since falling crystals aren't counted
    this.moreSodiumChlorideAllowed = new DerivedProperty(
      [ this.sphericalParticles.propertyCount( Sodium ), this.sphericalParticles.propertyCount( Chloride ) ],
      function( sodiumCount, chlorideCount ) {
        return sodiumCount < ParticleCountTable.MAX_SODIUM_CHLORIDE || chlorideCount < ParticleCountTable.MAX_SODIUM_CHLORIDE;
      } );

    this.moreCalciumChlorideAllowed = new DerivedProperty(
      [ this.sphericalParticles.propertyCount( Calcium ), this.sphericalParticles.propertyCount( Chloride ) ],
      function( calciumCount, chlorideCount ) {
        return calciumCount < ParticleCountTable.MAX_CALCIUM_CHLORIDE || chlorideCount < ParticleCountTable.MAX_CALCIUM_CHLORIDE;
      } );

    this.moreSodiumNitrateAllowed = new DerivedProperty(
      [ this.sphericalParticles.propertyCount( Sodium ), this.sphericalParticles.propertyCount( Oxygen ) ],
      function( sodiumCount, oxygenCount ) {
        return sodiumCount < ParticleCountTable.MAX_SODIUM_NITRATE || oxygenCount < ParticleCountTable.MAX_SODIUM_NITRATE * 3;
      } );

    this.moreSucroseAllowed = new DerivedProperty( [ this.freeParticles.propertyCount( Sucrose ), this.numSucroseMoleculesInCrystal ],
      function( sucroseCount, numSucroseMoleculesInCrystal ) {
        return sucroseCount + numSucroseMoleculesInCrystal > ParticleCountTable.MAX_SUCROSE;
      } );

    this.moreGlucoseAllowed = new DerivedProperty( [ this.freeParticles.propertyCount( Glucose ), this.numGlucoseMoleculesInCrystal ],
      function( sucroseCount, numGlucoseMoleculesInCrystal ) {
        return sucroseCount + numGlucoseMoleculesInCrystal > ParticleCountTable.MAX_GLUCOSE;
      } );

    //Add models for the various dispensers: sugar, salt, etc.
    //Note that this is done by associating a DispenserType with the dispenser model element, a more direct way would be to create
    // class Substance that has both a dispenser type and a node factory
    this.dispensers.push( new SodiumChlorideShaker( this.beaker.getCenterX(), this.beaker.getTopY() + this.beaker.getHeight() * 0.5,
      this.beaker, this.moreSodiumChlorideAllowed, SODIUM_CHLORIDE_NEW_LINE, this.distanceScale, this.dispenserType, DispenserType.SALT, this ) );

    this.dispensers.push( new SodiumNitrateShaker( this.beaker.getCenterX(), this.beaker.getTopY() + this.beaker.getHeight() * 0.5,
      this.beaker, this.moreSodiumNitrateAllowed, SODIUM_NITRATE_NEW_LINE, this.distanceScale, this.dispenserType, DispenserType.SODIUM_NITRATE, this ) );

    this.dispensers.push( new SucroseDispenser( this.beaker.getCenterX(), this.beaker.getTopY() + this.beaker.getHeight() * 0.5,
      this.beaker, this.moreSucroseAllowed, SUCROSE, this.distanceScale, this.dispenserType, DispenserType.SUGAR, this ) );

    this.dispensers.push( new CalciumChlorideShaker( this.beaker.getCenterX(), this.beaker.getTopY() + this.beaker.getHeight() * 0.5,
      this.beaker, this.moreCalciumChlorideAllowed, CALCIUM_CHLORIDE_NEW_LINE, this.distanceScale, this.dispenserType, DispenserType.CALCIUM_CHLORIDE, this ) );

    this.dispensers.push( new GlucoseDispenser( this.beaker.getCenterX(), this.beaker.getTopY() + this.beaker.getHeight() * 0.5,
      this.beaker, this.moreGlucoseAllowed, GLUCOSE, this.distanceScale, this.dispenserType, DispenserType.GLUCOSE, this ) );

    //When the output flow rate changes, recompute the desired flow rate for each formula type to help ensure a constant
    // concentration over time for each formula constituents
    this.outputFlowRate.link( function( outputFlowRate ) {
      thisModel.checkStartDrain( thisModel.sodiumChlorideDrainData );
      thisModel.checkStartDrain( thisModel.sucroseDrainData );
      thisModel.checkStartDrain( thisModel.calciumChlorideDrainData );
      thisModel.checkStartDrain( thisModel.sodiumNitrateDrainData );
      thisModel.checkStartDrain( thisModel.glucoseDrainData );
    } );

  }

  return inherit( SugarAndSaltSolutionModel, MicroModel, {
    /**
     * store the concentrations of all solutes and set up a drain schedule, so that particles will flow out at rates so as to
     * keep the concentration level as constant as possible
     * @param {DrainData} drainData
     */
    checkStartDrain: function( drainData ) {
      var currentDrainFlowRate = this.outputFlowRate.get() * this.faucetFlowRate;
      var timeToDrainFully = this.solution.volume.get() / currentDrainFlowRate;

      Logger.fine( "time to drain fully: " + timeToDrainFully );

      if ( currentDrainFlowRate > 0 ) {
        if ( drainData.previousDrainFlowRate === 0 ) {
          //When draining, try to attain this number of target ions per volume as closely as possible
          drainData.initialNumberFormulaUnits = this.countFreeFormulaUnits( drainData.formula );
          drainData.initialVolume = this.solution.volume.get();
        }
      }
      drainData.previousDrainFlowRate = currentDrainFlowRate;
    },


    /**
     * @private
     * Count the number of formula units matching the specified formula
     * This is tricky since some kits have 2 solutes that share a component like NaCl + NaNO3
     * So we have to assume that:
     * 1. all other actions conserve formula unit counts to make these calculations
     * 2. Kits are simple enough that that formula units could be computed independently.  For instance if one kit had NaCl
     * and another copy of NaCl, then it wouldn't be able to distinguish them
     * TODO: Consider consolidating this and other kit definition code in MicroModel.selectedKit
     * @param {Formula} formula
     * @returns {number}
     */
    countFreeFormulaUnits: function( formula ) {
      if ( this.selectedKit.get() === 0 ) { return this.countFreeFormulaUnitsKit0( formula ); }
      else if ( this.selectedKit.get() === 1 ) { return this.countFreeFormulaUnitsKit1( formula ); }
      else if ( this.selectedKit.get() === 2 ) { return this.countFreeFormulaUnitsKit2( formula ); }
      else if ( this.selectedKit.get() === 3 ) { return this.countFreeFormulaUnitsKit3( formula ); }
      else { throw new Error( "Kit not found" ); }
    },


    /**
     * @private
     * See docs for countFreeFormulaUnits; solutes are independent so it is easy
     * @param {Formula} formula
     * @returns {number}
     */
    countFreeFormulaUnitsKit0: function( formula ) {
      if ( formula.equals( Formula.SODIUM_CHLORIDE ) ) { return this.freeParticles.countByClass( Sodium ); }
      else if ( formula.equals( Formula.SUCROSE ) ) { return this.freeParticles.countByClass( Sucrose ); }
      else { return 0; }
    },

    /**
     * @private
     * See docs for countFreeFormulaUnits; chloride is shared so it cannot be used to count
     * @param {Formula} formula
     * @returns {number}
     */
    countFreeFormulaUnitsKit1: function( formula ) {
      if ( formula.equals( Formula.SODIUM_CHLORIDE ) ) { return this.freeParticles.countByClass( Sodium ); }
      else if ( formula.equals( Formula.CALCIUM_CHLORIDE ) ) { return this.freeParticles.countByClass( Calcium ); }
      else { return 0; }
    },

    /**
     * @private
     * See docs for countFreeFormulaUnits; sodium is shared so it cannot be used to count
     * @param {Formula} formula
     * @returns {number}
     */
    countFreeFormulaUnitsKit2: function( formula ) {
      if ( formula.equals( Formula.SODIUM_CHLORIDE ) ) { return this.freeParticles.countByClass( Chloride ); }
      else if ( formula.equals( Formula.SODIUM_NITRATE ) ) { return this.freeParticles.countByClass( Nitrate ); }
      else { return 0; }
    },

    /**
     * See docs for countFreeFormulaUnits; solutes are independent so it is easy
     * @param {Formula} formula
     * @returns {number}
     */
    countFreeFormulaUnitsKit3: function( formula ) {
      if ( formula.equals( Formula.SUCROSE ) ) { return this.freeParticles.countByClass( Sucrose ); }
      else if ( formula.equals( Formula.GLUCOSE ) ) { return this.freeParticles.countByClass( Glucose ); }
      else { return 0; }
    },

    /**
     * When the simulation clock ticks, move the particles
     * @param {number} dt
     * @returns {*}
     */
    updateModel: function( dt ) {
      SugarAndSaltSolutionModel.prototype.updateModel.call( this, dt );

      var self = this;
      //The Draining algorithm keeps track of which formula unit each particle is assigned to so that a particle is not double counted
      //It has to be cleared in each iteration
      this.draining.clearParticleGroupings();

      //If water is draining, call this first to set the update strategies to be FlowToDrain instead of FreeParticle
      //Do this before updating the free particles since this could change their strategy
      if ( this.outputFlowRate.get() > 0 ) {

        // Set up all particles to have a random walk toward the drain, nearest particles in each formula unit will get exact speed
        // in a later step and their strategy will be replaced
        var randomWhileDraining = new RandomMotionWhileDraining( this );
        randomWhileDraining.apply();

        //Prioritize the closest formula unit, otherwise if a further away formula unit is given priority it will cause a "racing condition" in which
        //it catches up, then gets de-prioritized, which makes particles switch between formula groups and creates incorrect velocities
        var drainDataList = [ this.sodiumChlorideDrainData, this.sucroseDrainData, this.calciumChlorideDrainData, this.sodiumNitrateDrainData, this.glucoseDrainData ];
        _.sortBy( drainDataList, function( a ) {
          self.draining.getTimeToError( a, dt );
        } );

        _.each( drainDataList, function( drainData ) {
          self.draining.updateParticlesFlowingToDrain( drainData, dt );
        } );
      }

      var allParticles = [];
      allParticles = allParticles.concat( this.freeParticles.getArray(), this.sodiumChlorideCrystals.getArray(), this.sodiumNitrateCrystals.getArray(),
        this.calciumChlorideCrystals.getArray(), this.sucroseCrystals.getArray(), this.glucoseCrystals.getArray(), this.drainedParticles.getArray() );

      //Iterate over all particles and let them update in time
      _.each( allParticles, function( freeParticle ) {
        freeParticle.stepInTime( dt );
      } );

      //Workaround for completely dissolving any crystals that have become disconnected as a result of partial dissolving
      this.dissolveDisconnectedCrystals.apply( this.sodiumChlorideCrystals );
      this.dissolveDisconnectedCrystals.apply( this.sodiumNitrateCrystals );
      this.dissolveDisconnectedCrystals.apply( this.calciumChlorideCrystals );
      this.dissolveDisconnectedCrystals.apply( this.sucroseCrystals );
      this.dissolveDisconnectedCrystals.apply( this.glucoseCrystals );

      if ( DEBUG_CRYSTAL_RATIO ) {
        this.sodiumChlorideCrystals.forEach( function( sodiumChlorideCrystal ) {
          var matches = sodiumChlorideCrystal.matchesFormulaRatio();
          console.log( "matches = " + matches );
        } );

        var debugCount = 0;
        this.calciumChlorideCrystals.forEach( function( calciumChlorideCrystal ) {
          console.log( "calciumChlorideCrystal[" + debugCount + ", match = " + calciumChlorideCrystal.matchesFormulaRatio() );
          debugCount++;
        } );

        var allCrystals = [];
        allCrystals = allCrystals.concat( this.sodiumChlorideCrystals.getArray(), this.sodiumNitrateCrystals.getArray(), this.calciumChlorideCrystals.getArray(),
          this.sucroseCrystals.getArray(), this.glucoseCrystals.getArray() );

        allCrystals.forEach( function( crystal ) {
          var matches = crystal.matchesFormulaRatio();
          if ( !matches ) {
            console.log( "Crystal didn't match formula ratio: " + crystal );
          }
        } );
      }

      //Allow the crystals to grow--not part of the strategies because it has to look at all particles within a group to decide which to crystallize
      this.sodiumChlorideCrystalGrowth.allowCrystalGrowth( dt, this.sodiumChlorideSaturated );
      this.sucroseCrystalGrowth.allowCrystalGrowth( dt, this.sucroseSaturated );
      this.glucoseCrystalGrowth.allowCrystalGrowth( dt, this.glucoseSaturated );
      this.calciumChlorideCrystalGrowth.allowCrystalGrowth( dt, this.calciumChlorideSaturated );
      this.sodiumNitrateCrystalGrowth.allowCrystalGrowth( dt, this.sodiumNitrateSaturated );

      //Update the number of solute types for purposes of changing the text on the "remove solute(s)" button
      //Count the number of different formulae present in solution, that is the number of solutes
      var count = this.kit.getFormulae().filter( function( formula ) {
        return self.countFreeFormulaUnits( formula ) > 0;
      } ).length;

      this.numberSoluteTypes.set( count + 0.0 );

      //Notify listeners that the update step completed
      /**
       * TODO
       for ( VoidFunction0 listener : stepFinishedListeners ) {
            listener.apply();
        } **/

      //Water can be drained but this value is never used so no need to compute it exactly
      return 0;
    },

    /**
     * Add a single salt crystal to the model
     * @param {SodiumChlorideCrystal} sodiumChlorideCrystal
     */
    addSodiumChlorideCrystal: function( sodiumChlorideCrystal ) {
      var self = this;
      //Add the components of the lattice to the model so the graphics will be created
      var particles = sodiumChlorideCrystal.iterator();
      particles.forEach( function( atom ) {
        self.sphericalParticles.add( atom );
      } );

      this.sodiumChlorideCrystals.add( sodiumChlorideCrystal );
      sodiumChlorideCrystal.setUpdateStrategy( new CrystalStrategy( this, this.sodiumChlorideCrystals, this.sodiumChlorideSaturated ) );
    },

    /**
     * Add a single sodium nitrate crystal to the model
     * @param {SodiumNitrateCrystal} crystal
     */
    addSodiumNitrateCrystal: function( crystal ) {
      crystal.setUpdateStrategy( new CrystalStrategy( this, this.sodiumNitrateCrystals, this.sodiumNitrateSaturated ) );
      this.addComponents( crystal );
      this.sodiumNitrateCrystals.add( crystal );
    },

    /**
     * @private
     * Add all SphericalParticles contained in the compound so the graphics will be created
     * @param compound
     */
    addComponents: function( compound ) {
      var self = this;
      compound.getAllSphericalParticles().forEach( function( sphericalParticle ) {
        self.sphericalParticles.add( sphericalParticle );
      } );
    },

    /**
     * Remove all SphericalParticles contained in the compound so the graphics will be deleted
     * @param {Compound} compound
     */
    removeComponents: function( compound ) {
      var self = this;
      compound.getAllSphericalParticles().forEach( function( sphericalParticle ) {
        self.sphericalParticles.remove( sphericalParticle );
      } );
    },

    /**
     *
     * @param {CalciumChlorideCrystal} calciumChlorideCrystal
     */
    addCalciumChlorideCrystal: function( calciumChlorideCrystal ) {
      calciumChlorideCrystal.setUpdateStrategy( new CrystalStrategy( this, this.calciumChlorideCrystals, this.calciumChlorideSaturated ) );
      this.addComponents( calciumChlorideCrystal );
      this.calciumChlorideCrystals.add( calciumChlorideCrystal );
    },

    /**
     * Add a sucrose crystal to the model, and add graphics for all its constituent particles
     * @param {SucroseCrystal} sucroseCrystal
     */
    addSucroseCrystal: function( sucroseCrystal ) {
      sucroseCrystal.setUpdateStrategy( new CrystalStrategy( this, this.sucroseCrystals, this.sucroseSaturated ) );
      this.addComponents( sucroseCrystal );
      this.sucroseCrystals.add( sucroseCrystal );
    },

    /**
     * Add a glucose crystal to the model, and add graphics for all its constituent particles
     * @param {GlucoseCrystal} glucoseCrystal
     */
    addGlucoseCrystal: function( glucoseCrystal ) {
      glucoseCrystal.setUpdateStrategy( new CrystalStrategy( this, this.glucoseCrystals, this.glucoseSaturated ) );
      this.addComponents( glucoseCrystal );
      this.glucoseCrystals.add( glucoseCrystal );
    },

    /**
     * Keep the particle within the beaker solution bounds
     * @param {Particle} particle
     */
    preventFromLeavingBeaker: function( particle ) {

      //If the particle ever entered the water fully, don't let it leave through the top
      if ( particle.hasSubmerged() ) {
        this.preventFromMovingPastWaterTop( particle );
      }
      this.preventFromFallingThroughBeakerBase( particle );
      this.preventFromFallingThroughBeakerRight( particle );
      this.preventFromFallingThroughBeakerLeft( particle );
    },


    /**
     * @private
     * prevent particles from falling through the top of the water
     * @param {Particle} particle
     */
    preventFromMovingPastWaterTop: function( particle ) {
      var waterTopY = this.solution.shape.get().bounds.getMaxY();
      var particleTopY = particle.getShape().bounds.getMaxY();

      if ( particleTopY > waterTopY ) {
        particle.translate( 0, waterTopY - particleTopY - this.modelInset );
      }
    },

    /**
     *
     * @param {Crystal} crystal
     * @returns {boolean}
     */
    isCrystalTotallyAboveTheWater: function( crystal ) {
      return crystal.getShape().bounds.getY() > this.solution.shape.get().bounds.getMaxY();
    },

    /**
     *
     * @param {Particle} particle
     */
    boundToBeakerBottom: function( particle ) {
      if ( particle.getShape().bounds.getMinY() < 0 ) {
        particle.translate( 0, -particle.getShape().bounds.getMinY() );
      }
    },

    /**
     * Get the external force acting on the particle, gravity if the particle is in free fall or zero otherwise (e.g., in solution)
     * @param {boolean} anyPartUnderwater
     * @returns {Vector2}
     */
    getExternalForce: function( anyPartUnderwater ) {
      return new Vector2( 0, anyPartUnderwater ? 0 : -9.8 );
    },

    /**
     * Determine whether the object is underwater--when it touches the water it should slow down
     * @param {Particle} particle
     * @returns {boolean}
     */
    isAnyPartUnderwater: function( particle ) {
      return particle.getShape().bounds.intersectsBounds( this.solution.shape.get().bounds );
    },

    /**
     *
     * @param {Particle} particle
     */
    collideWithWater: function( particle ) {
      particle.velocity.set( new Vector2( 0, -1 ).times( 0.25E-9 ) );
    },

    reset: function() {
      SugarAndSaltSolutionModel.prototype.reset.call( this );

      //Clear out solutes, particles, concentration values
      this.clearSolutes();

      //Reset model for user settings
      this.showConcentrationValues.reset();
      this.dispenserType.reset();
      this.showChargeColor.reset();
      this.selectedKit.reset();
      this.clockRunning.reset();
    },

    /**
     * Remove all solutes from the model
     */
    clearSolutes: function() {
      //Clear particle lists
      this.sphericalParticles.clear();
      this.freeParticles.clear();
      this.sodiumChlorideCrystals.clear();
      this.sodiumNitrateCrystals.clear();
      this.calciumChlorideCrystals.clear();
      this.sucroseCrystals.clear();
    },

    /**
     * Determine if there is any table salt to remove
     * @returns {DerivedProperty}
     */
    isAnySaltToRemove: function() {
      return new DerivedProperty( [ this.sodium.concentration, this.chloride.concentration ],
        function( sodiumConcentration, chlorideConcentration ) {
          return sodiumConcentration > 0 && chlorideConcentration > 0;
        } );
    },

    /**
     * Determine if there is any sugar that can be removed
     * @returns {Property}
     */
    isAnySugarToRemove: function() {
      return new DerivedProperty( [ this.sucrose.concentration ], function( sucroseConcentration ) { return sucroseConcentration > 0; } );
    },

    /**
     * @override
     * @returns {Property}
     */
    getAnySolutes: function() {
      return this.anySolutes;
    },

    /**
     * @private
     * Iterate over particles that take random walks so they don't move above the top of the water
     * @param {number} changeInWaterHeight
     */
    updateParticlesDueToWaterLevelDropped: function( changeInWaterHeight ) {
      this.waterLevelDropped( this.freeParticles, changeInWaterHeight );
      this.waterLevelDropped( this.sucroseCrystals, changeInWaterHeight );
      this.waterLevelDropped( this.sodiumChlorideCrystals, changeInWaterHeight );
      this.waterLevelDropped( this.calciumChlorideCrystals, changeInWaterHeight );
      this.waterLevelDropped( this.sodiumNitrateCrystals, changeInWaterHeight );
    },

    /**
     * @private
     * When water level decreases, move the particles down with the water level.
     * Beaker base is at y=0.  Move particles proportionately to how close they are to the top.
     * @param {ItemList} particles
     * @param {number} volumeDropped
     */
    waterLevelDropped: function( particles, volumeDropped ) {

      var self = this;
      var changeInWaterHeight = self.beaker.getHeightForVolume( volumeDropped ) - this.beaker.getHeightForVolume( 0 );
      particles.forEach( function( particle ) {
        if ( self.waterVolume.get() > 0 ) {
          var yLocationInBeaker = particle.getPosition().getY();
          var waterTopY = self.beaker.getHeightForVolume( self.waterVolume.get() );

          //Only move particles down if they are fully underwater
          if ( yLocationInBeaker < waterTopY ) {
            var fractionToTop = yLocationInBeaker / waterTopY;
            particle.translate( 0, -changeInWaterHeight * fractionToTop );

            //Prevent particles from leaving the top of the liquid
            self.preventFromLeavingBeaker( particle );
          }
        }

        //This step must be done after prevention of particles leaving the top because falling through
        // the bottom is worse (never returns), pushing through the top, particles
        //would just fall back to the water level
        self.preventFromFallingThroughBeakerBase( particle );
      } );
    },


    /**
     * @private
     * prevent particles from falling through the bottom of the beaker
     * @param {Particle} particle
     */
    preventFromFallingThroughBeakerBase: function( particle ) {
      var bottomY = particle.getShape().bounds.getMinY();
      if ( bottomY < 0 ) {
        particle.translate( 0, -bottomY + this.modelInset );
      }
    },

    /**
     * @private
     * prevent particles from falling through the bottom of the beaker
     * @param {Particle} particle
     */
    preventFromFallingThroughBeakerLeft: function( particle ) {
      var left = particle.getShape().bounds.getMinX();
      if ( left < this.beaker.getLeftWall().start.x ) {
        particle.translate( this.beaker.getLeftWall().start.x - left, 0 );
      }
    },


    /**
     * @private
     * prevent particles from falling through the bottom of the beaker
     * @param {Particle} particle
     */
    preventFromFallingThroughBeakerRight: function( particle ) {
      var right = particle.getShape().bounds.getMaxX();
      if ( right > this.beaker.getRightWall().start.x ) {
        particle.translate( this.beaker.getRightWall().start.x - right, 0 );
      }
    },

    /**
     *
     * When water evaporates, move the particles so they move down with the water level
     * @protected
     * @override
     * @param umber{n} evaporatedWater
     */
    waterEvaporated: function( evaporatedWater ) {
      SugarAndSaltSolutionModel.prototype.waterEvaporated.call( this, evaporatedWater );
      this.updateParticlesDueToWaterLevelDropped( evaporatedWater );
    },

    /**
     * Get the target configurations for some crystals for debugging purposes
     * @returns {Array}
     */
    getAllBondingSites: function() {
      var s = [];
      var self = this;
      this.sodiumChlorideCrystals.forEach( function( crystal ) {
        s.push( new SodiumChlorideCrystalGrowth( self, self.sodiumChlorideCrystals ).getTargetConfiguration( crystal ) );
      } );

      this.calciumChlorideCrystals.forEach( function( crystal ) {
        s.add( new CalciumChlorideCrystalGrowth( self, self.calciumChlorideCrystals ).getTargetConfiguration( crystal ) );
      } );

      return s;
    },

    /**
     * Require crystallization and prevent dissolving when water volume is below this threshold.
     * This is because there is so little water it would be impossible to dissolve anything and everything should crystallize
     * @returns {boolean}
     */
    isWaterBelowCrystalThreshold: function() {
      return this.waterVolume.get() <= Units.litersToMetersCubed( 0.03E-23 );
    }

  } );

} );


//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.micro.model;
//
//import java.awt.Color;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.Comparator;
//import java.util.List;
//import java.util.logging.Logger;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock;
//import edu.colorado.phet.common.phetcommon.model.property.BooleanProperty;
//import edu.colorado.phet.common.phetcommon.model.property.CompositeProperty;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty;
//import edu.colorado.phet.common.phetcommon.util.SimpleObserver;
//import edu.colorado.phet.common.phetcommon.util.function.Function0;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction0;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.util.logging.LoggingUtils;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.BeakerDimension;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Compound;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Crystal;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Formula;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ItemList;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Calcium;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Chloride;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Oxygen;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Sodium;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SugarAndSaltSolutionModel;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Units;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.sucrose.Sucrose;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.sucrose.SucroseCrystal;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.sucrose.SucroseCrystalGrowth;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.calciumchloride.CalciumChlorideCrystal;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.calciumchloride.CalciumChlorideCrystalGrowth;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.calciumchloride.CalciumChlorideShaker;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.CrystalStrategy;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.DissolveDisconnectedCrystals;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.DrainData;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.Draining;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.RandomMotionWhileDraining;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.TargetConfiguration;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.glucose.Glucose;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.glucose.GlucoseCrystal;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.glucose.GlucoseCrystalGrowth;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumchloride.SodiumChlorideCrystal;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumchloride.SodiumChlorideCrystalGrowth;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumchloride.SodiumChlorideShaker;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate.Nitrate;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate.SodiumNitrateCrystal;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate.SodiumNitrateCrystalGrowth;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate.SodiumNitrateShaker;
//import edu.colorado.phet.sugarandsaltsolutions.micro.view.GlucoseDispenser;
//import edu.colorado.phet.sugarandsaltsolutions.micro.view.SucroseDispenser;
//
//import static edu.colorado.phet.common.phetcommon.view.PhetColorScheme.RED_COLORBLIND;
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Strings.*;
//import static edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType.SALT;
//import static edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType.SUGAR;
//import static edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.NEUTRAL_COLOR;
//import static edu.colorado.phet.sugarandsaltsolutions.common.model.Units.molesPerLiterToMolesPerMeterCubed;
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.ParticleCountTable.*;
//import static java.awt.Color.blue;
//import static java.util.Arrays.asList;
//
///**
// * Model for the micro tab, which uses code from soluble salts sim.
// *
// * @author Sam Reid
// */
//public class MicroModel extends SugarAndSaltSolutionModel {
//
//    private static final double FRAMES_PER_SECOND = 30;
//
//    //List of all spherical particles, the constituents in larger molecules or crystals, used for rendering on the screen
//    public final ItemList<SphericalParticle> sphericalParticles = new ItemList<SphericalParticle>();
//
//    //List of all free particles, used to keep track of which particles (includes molecules) to move about randomly
//    public final ItemList<Particle> freeParticles = new ItemList<Particle>();
//
//    //List of all drained particles, used to keep track of which particles (includes molecules) should flow out of the output drain
//    public final ItemList<Particle> drainedParticles = new ItemList<Particle>();
//
//    //User setting for whether color should be based on charge or identity
//    public final BooleanProperty showChargeColor = new BooleanProperty( false );
//
//    //Determine if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).  This is used to show/hide the "remove solutes" button
//    private final ObservableProperty<Boolean> anySolutes = new CompositeProperty<Boolean>( new Function0<Boolean>() {
//        public Boolean apply() {
//            return freeParticles.size.get() > 0;
//        }
//    }, freeParticles.size );
//
//    //The number of different types of solute in solution, to determine whether to show singular or plural text for the "remove solute(s)" button
//    //Note: this value should not be set externally, it should only be set by this model.  The reason that we used DoubleProperty which has a public setter is because it also has methods such as greaterThan and valueEquals
//    public final DoubleProperty numberSoluteTypes = new DoubleProperty( 0.0 );
//
//    //Debugging flag for draining particles through the faucet
//    public static final boolean DEBUG_DRAINING = false;
//
//    //Listeners that are notified when the simulation time step has completed
//    public final ArrayList<VoidFunction0> stepFinishedListeners = new ArrayList<VoidFunction0>();
//
//    //Colors for all the dissolved solutes
//    //Choose nitrate to be blue because the Nitrogen atom is blue, even though it is negative and therefore also blue under "show charge color" condition
//    private final ObservableProperty<Color> sucroseColor = new CompositeProperty<Color>( new Function0<Color>() {
//        public Color apply() {
//            return showChargeColor.get() ? NEUTRAL_COLOR : RED_COLORBLIND;
//        }
//    }, showChargeColor );
//    private final ObservableProperty<Color> glucoseColor = new CompositeProperty<Color>( new Function0<Color>() {
//        public Color apply() {
//            return showChargeColor.get() ? NEUTRAL_COLOR : RED_COLORBLIND;
//        }
//    }, showChargeColor );
//    private final ObservableProperty<Color> nitrateColor = new CompositeProperty<Color>( new Function0<Color>() {
//        public Color apply() {
//            return showChargeColor.get() ? blue : blue;
//        }
//    }, showChargeColor );
//
//    //Flag to indicate whether the fluid is draining, since the display concentrations are held steady while draining
//    private final ObservableProperty<Boolean> isDraining = outputFlowRate.greaterThan( 0.0 );
//
//    //Constituents of dissolved solutes, such as sodium, nitrate, sucrose, etc.
//    public final SoluteConstituent sodium = new SoluteConstituent( this, new IonColor( this, new Sodium() ), Sodium.class, isDraining );
//    public final SoluteConstituent chloride = new SoluteConstituent( this, new IonColor( this, new Chloride() ), Chloride.class, isDraining );
//    public final SoluteConstituent calcium = new SoluteConstituent( this, new IonColor( this, new Calcium() ), Calcium.class, isDraining );
//    public final SoluteConstituent sucrose = new SoluteConstituent( this, sucroseColor, Sucrose.class, isDraining );
//    public final SoluteConstituent glucose = new SoluteConstituent( this, glucoseColor, Glucose.class, isDraining );
//    public final SoluteConstituent nitrate = new SoluteConstituent( this, nitrateColor, Nitrate.class, isDraining );
//
//    //DrainData helps to maintain a constant concentration as particles flow out the drain by tracking flow rate and timing
//    //There is one DrainData for each formula since they may flow at different rates and have different schedules
//    public final DrainData sodiumChlorideDrainData = new DrainData( Formula.SODIUM_CHLORIDE );
//    public final DrainData sucroseDrainData = new DrainData( Formula.SUCROSE );
//    public final DrainData calciumChlorideDrainData = new DrainData( Formula.CALCIUM_CHLORIDE );
//    public final DrainData sodiumNitrateDrainData = new DrainData( Formula.SODIUM_NITRATE );
//    public final DrainData glucoseDrainData = new DrainData( Formula.GLUCOSE );
//
//    //Lists of compounds
//    public final ItemList<SodiumChlorideCrystal> sodiumChlorideCrystals = new ItemList<SodiumChlorideCrystal>();
//    public final ItemList<SodiumNitrateCrystal> sodiumNitrateCrystals = new ItemList<SodiumNitrateCrystal>();
//    public final ItemList<CalciumChlorideCrystal> calciumChlorideCrystals = new ItemList<CalciumChlorideCrystal>();
//    public final ItemList<SucroseCrystal> sucroseCrystals = new ItemList<SucroseCrystal>();
//    public final ItemList<GlucoseCrystal> glucoseCrystals = new ItemList<GlucoseCrystal>();
//
//    //Determine saturation points
//    final double sodiumChlorideSaturationPoint = molesPerLiterToMolesPerMeterCubed( 6.14 );
//    final double calciumChlorideSaturationPoint = molesPerLiterToMolesPerMeterCubed( 6.71 );
//    final double sodiumNitrateSaturationPoint = molesPerLiterToMolesPerMeterCubed( 10.8 );
//    final double sucroseSaturationPoint = molesPerLiterToMolesPerMeterCubed( 5.84 );
//    final double glucoseSaturationPoint = molesPerLiterToMolesPerMeterCubed( 5.05 );
//
//    //Create observable properties that indicate whether each solution type is saturated
//    //We previously used "or" in these conjunctions to mean that a compound is saturated if either of its constituents passes the threshold.
//    //However, this has incorrect behavior for kits of mixed types, such as NaCl and CaCl2, since Cl saturation would lead to crystallization of both compounds (even if not enough Na)
//    //Therefore it is essential to use "and" conjunctions to supported kits that share a solute component
//    public final ObservableProperty<Boolean> sodiumChlorideSaturated = sodium.concentration.greaterThan( sodiumChlorideSaturationPoint ).and( chloride.concentration.greaterThan( sodiumChlorideSaturationPoint ) );
//    public final ObservableProperty<Boolean> calciumChlorideSaturated = calcium.concentration.greaterThan( calciumChlorideSaturationPoint ).and( chloride.concentration.greaterThan( calciumChlorideSaturationPoint * 2 ) );
//    public final ObservableProperty<Boolean> sucroseSaturated = sucrose.concentration.greaterThan( sucroseSaturationPoint );
//    public final ObservableProperty<Boolean> glucoseSaturated = glucose.concentration.greaterThan( glucoseSaturationPoint );
//    public final ObservableProperty<Boolean> sodiumNitrateSaturated = sodium.concentration.greaterThan( sodiumNitrateSaturationPoint ).and( nitrate.concentration.greaterThan( sodiumNitrateSaturationPoint ) );
//
//    //Keep track of which kit the user has selected so that particle draining can happen in formula units so there isn't an unbalanced number of solutes for crystallization
//    private MicroModelKit kit;
//
//    private static final Logger LOGGER = LoggingUtils.getLogger( MicroModel.class.getCanonicalName() );
//
//    //The index of the kit selected by the user
//    public final Property<Integer> selectedKit = new Property<Integer>( 0 ) {{
//
//        //When the user switches kits, clear the solutes and reset the water level
//        addObserver( new SimpleObserver() {
//            public void update() {
//                clearSolutes();
//                resetWater();
//
//                //TODO: Consider consolidating this and other kit definition code in MicroModel.countFreeFormulaUnits
//                //Decided not to implement before 1.00 published, but may be useful if other kit features are added in the future
//                if ( get() == 0 ) { kit = new MicroModelKit( Formula.SODIUM_CHLORIDE, Formula.SUCROSE ); }
//                else if ( get() == 1 ) { kit = new MicroModelKit( Formula.SODIUM_CHLORIDE, Formula.CALCIUM_CHLORIDE ); }
//                else if ( get() == 2 ) { kit = new MicroModelKit( Formula.SODIUM_CHLORIDE, Formula.SODIUM_NITRATE ); }
//                else if ( get() == 3 ) { kit = new MicroModelKit( Formula.SUCROSE, Formula.GLUCOSE ); }
//                else { throw new RuntimeException( "Unknown kit" ); }
//            }
//        } );
//    }};
//
//    //Rules for growing each crystal incrementally from existing dissolved constituents
//    protected final SodiumChlorideCrystalGrowth sodiumChlorideCrystalGrowth = new SodiumChlorideCrystalGrowth( this, sodiumChlorideCrystals );
//    protected final SodiumNitrateCrystalGrowth sodiumNitrateCrystalGrowth = new SodiumNitrateCrystalGrowth( this, sodiumNitrateCrystals );
//    protected final CalciumChlorideCrystalGrowth calciumChlorideCrystalGrowth = new CalciumChlorideCrystalGrowth( this, calciumChlorideCrystals );
//    protected final SucroseCrystalGrowth sucroseCrystalGrowth = new SucroseCrystalGrowth( this, sucroseCrystals );
//    protected final GlucoseCrystalGrowth glucoseCrystalGrowth = new GlucoseCrystalGrowth( this, glucoseCrystals );
//
//    //Updates the particles when the user drains solution
//    public final Draining draining = new Draining( this );
//
//    //Workaround for completely dissolving any crystals that have become disconnected as a result of partial dissolving
//    public final DissolveDisconnectedCrystals dissolveDisconnectedCrystals = new DissolveDisconnectedCrystals( this );
//
//    //Flag to help debug the crystal ratios
//    public static final boolean DEBUG_CRYSTAL_RATIO = false;
//
//    //Amount to move back particles (in meters) to prevent them from going past the edge of the beaker
//    public final double modelInset = 1E-12;
//
//    public MicroModel() {
//
//        //SolubleSalts clock runs much faster than wall time
//        super( new ConstantDtClock( FRAMES_PER_SECOND ),
//
//               //The volume of the micro beaker should be 2E-23L
//               //In the macro tab, the dimension is BeakerDimension( width = 0.2, height = 0.1, depth = 0.1 ), each unit in meters
//               //So if it is to have the same shape is as the previous tab then we use
//               // width*height*depth = 2E-23
//               // and
//               // width = 2*height = 2*depth
//               //Solving for width, we have:
//               // 2E-23 = width * width/2 * width/2
//               // =>
//               // 8E-23 = width^3.  Therefore
//               // width = cube root(8E-23)
//               new BeakerDimension( Math.pow( 8E-23
//                                              //convert L to meters cubed
//                                              * 0.001, 1 / 3.0 ) ),
//
//               //Flow rate must be slowed since the beaker is microscopically small, this value determines how fast it will fill up
//               5.0E-27,
//
//               //Values sampled at runtime using a debugger using this line in SugarAndSaltSolutionModel.update: System.out.println( "solution.shape.get().getBounds2D().getMaxY() = " + solution.shape.get().getBounds2D().getMaxY() );
//               //Should be moved to be high enough to contain the largest molecule (sucrose), so that it may move about freely
//               2.8440282964793075E-10, 5.75234062238494E-10,
//
//               //Ratio of length scales in meters
//               //The amount to scale model translations so that micro tab emits solute at the appropriate time.  Without this factor, the tiny (1E-9 meters) drag motion in the Micro tab wouldn't be enough to emit solute
//               //This was tuned so that drag motions in each model are commensurate
//               1.1603972084031932E9 );
//
//        //Property that identifies the number of sucrose molecules in crystal form, for making sure the user doesn't exceed the allowed maximum
//        final CrystalMoleculeCount numSucroseMoleculesInCrystal = new CrystalMoleculeCount( sucroseCrystals );
//        final CrystalMoleculeCount numGlucoseMoleculesInCrystal = new CrystalMoleculeCount( glucoseCrystals );
//
//        //Determine whether the user is allowed to add more of each type, based on the particle table
//        //These computations make the simplifying assumption that only certain combinations of molecules will appear together
//        //This allows us to say, for example, that more NaNO3 may be added if Oxygen is not over the limit, adding another molecule to its kit that contains oxygen would cause this to give incorrect limiting behavior
//        //For sucrose & glucose, account for non-dissolved crystals.  Otherwise the user can go over the limit since falling crystals aren't counted
//        ObservableProperty<Boolean> moreSodiumChlorideAllowed = sphericalParticles.propertyCount( Sodium.class ).lessThan( MAX_SODIUM_CHLORIDE ).or( sphericalParticles.propertyCount( Chloride.class ).lessThan( MAX_SODIUM_CHLORIDE ) );
//        ObservableProperty<Boolean> moreCalciumChlorideAllowed = sphericalParticles.propertyCount( Calcium.class ).lessThan( MAX_CALCIUM_CHLORIDE ).or( sphericalParticles.propertyCount( Chloride.class ).lessThan( MAX_CALCIUM_CHLORIDE ) );
//        ObservableProperty<Boolean> moreSodiumNitrateAllowed = sphericalParticles.propertyCount( Sodium.class ).lessThan( MAX_SODIUM_NITRATE ).or( sphericalParticles.propertyCount( Oxygen.class ).lessThan( MAX_SODIUM_NITRATE * 3 ) );
//        ObservableProperty<Boolean> moreSucroseAllowed = ( freeParticles.propertyCount( Sucrose.class ).plus( numSucroseMoleculesInCrystal ) ).lessThan( MAX_SUCROSE );
//        ObservableProperty<Boolean> moreGlucoseAllowed = ( freeParticles.propertyCount( Glucose.class ).plus( numGlucoseMoleculesInCrystal ) ).lessThan( MAX_GLUCOSE );
//
//        //Add models for the various dispensers: sugar, salt, etc.
//        //Note that this is done by associating a DispenserType with the dispenser model element, a more direct way would be to create class Substance that has both a dispenser type and a node factory
//        dispensers.add( new SodiumChlorideShaker( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSodiumChlorideAllowed, SODIUM_CHLORIDE_NEW_LINE, distanceScale, dispenserType, SALT, this ) );
//        dispensers.add( new SodiumNitrateShaker( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSodiumNitrateAllowed, SODIUM_NITRATE_NEW_LINE, distanceScale, dispenserType, DispenserType.SODIUM_NITRATE, this ) );
//        dispensers.add( new SucroseDispenser( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSucroseAllowed, SUCROSE, distanceScale, dispenserType, SUGAR, this ) );
//        dispensers.add( new CalciumChlorideShaker( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreCalciumChlorideAllowed, CALCIUM_CHLORIDE_NEW_LINE, distanceScale, dispenserType, DispenserType.CALCIUM_CHLORIDE, this ) );
//        dispensers.add( new GlucoseDispenser( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreGlucoseAllowed, GLUCOSE, distanceScale, dispenserType, DispenserType.GLUCOSE, this ) );
//
//        //When the output flow rate changes, recompute the desired flow rate for each formula type to help ensure a constant concentration over time for each formula constituents
//        outputFlowRate.addObserver( new VoidFunction1<Double>() {
//            public void apply( Double outputFlowRate ) {
//                checkStartDrain( sodiumChlorideDrainData );
//                checkStartDrain( sucroseDrainData );
//                checkStartDrain( calciumChlorideDrainData );
//                checkStartDrain( sodiumNitrateDrainData );
//                checkStartDrain( glucoseDrainData );
//            }
//        } );
//    }
//
//    //store the concentrations of all solutes and set up a drain schedule,
//    //so that particles will flow out at rates so as to keep the concentration level as constant as possible
//    public void checkStartDrain( DrainData drainData ) {
//        double currentDrainFlowRate = outputFlowRate.get() * faucetFlowRate;
//
//        double timeToDrainFully = solution.volume.get() / currentDrainFlowRate;
//        LOGGER.fine( "clock.getDt() = " + clock.getDt() + ", time to drain fully: " + timeToDrainFully );
//
//        if ( currentDrainFlowRate > 0 ) {
//            if ( drainData.previousDrainFlowRate == 0 ) {
//
//                //When draining, try to attain this number of target ions per volume as closely as possible
//                drainData.initialNumberFormulaUnits = countFreeFormulaUnits( drainData.formula );
//                drainData.initialVolume = solution.volume.get();
//            }
//        }
//        drainData.previousDrainFlowRate = currentDrainFlowRate;
//    }
//
//    //Count the number of formula units matching the specified formula
//    //This is tricky since some kits have 2 solutes that share a component like NaCl + NaNO3
//    //So we have to assume that:
//    //1. all other actions conserve formula unit counts to make these calculations
//    //2. Kits are simple enough that that formula units could be computed independently.  For instance if one kit had NaCl and another copy of NaCl, then it wouldn't be able to distinguish them
//    //TODO: Consider consolidating this and other kit definition code in MicroModel.selectedKit
//    public int countFreeFormulaUnits( Formula formula ) {
//        if ( selectedKit.get() == 0 ) { return countFreeFormulaUnitsKit0( formula ); }
//        else if ( selectedKit.get() == 1 ) { return countFreeFormulaUnitsKit1( formula ); }
//        else if ( selectedKit.get() == 2 ) { return countFreeFormulaUnitsKit2( formula ); }
//        else if ( selectedKit.get() == 3 ) { return countFreeFormulaUnitsKit3( formula ); }
//        else { throw new RuntimeException( "Kit not found" ); }
//    }
//
//    //See docs for countFreeFormulaUnits; solutes are independent so it is easy
//    private int countFreeFormulaUnitsKit0( Formula formula ) {
//        if ( formula.equals( Formula.SODIUM_CHLORIDE ) ) { return freeParticles.count( Sodium.class ); }
//        else if ( formula.equals( Formula.SUCROSE ) ) { return freeParticles.count( Sucrose.class ); }
//        else { return 0; }
//    }
//
//    //See docs for countFreeFormulaUnits; chloride is shared so it cannot be used to count
//    private int countFreeFormulaUnitsKit1( Formula formula ) {
//        if ( formula.equals( Formula.SODIUM_CHLORIDE ) ) { return freeParticles.count( Sodium.class ); }
//        else if ( formula.equals( Formula.CALCIUM_CHLORIDE ) ) { return freeParticles.count( Calcium.class ); }
//        else { return 0; }
//    }
//
//    //See docs for countFreeFormulaUnits; sodium is shared so it cannot be used to count
//    private int countFreeFormulaUnitsKit2( Formula formula ) {
//        if ( formula.equals( Formula.SODIUM_CHLORIDE ) ) { return freeParticles.count( Chloride.class ); }
//        else if ( formula.equals( Formula.SODIUM_NITRATE ) ) { return freeParticles.count( Nitrate.class ); }
//        else { return 0; }
//    }
//
//    //See docs for countFreeFormulaUnits; solutes are independent so it is easy
//    private int countFreeFormulaUnitsKit3( Formula formula ) {
//        if ( formula.equals( Formula.SUCROSE ) ) { return freeParticles.count( Sucrose.class ); }
//        else if ( formula.equals( Formula.GLUCOSE ) ) { return freeParticles.count( Glucose.class ); }
//        else { return 0; }
//    }
//
//    //When the simulation clock ticks, move the particles
//    @Override protected double updateModel( final double dt ) {
//        super.updateModel( dt );
//
//        //The Draining algorithm keeps track of which formula unit each particle is assigned to so that a particle is not double counted
//        //It has to be cleared in each iteration
//        draining.clearParticleGroupings();
//
//        //If water is draining, call this first to set the update strategies to be FlowToDrain instead of FreeParticle
//        //Do this before updating the free particles since this could change their strategy
//        if ( outputFlowRate.get() > 0 ) {
//
//            //Set up all particles to have a random walk toward the drain, nearest particles in each formula unit will get exact speed in a later step and their strategy will be replaced
//            new RandomMotionWhileDraining( this ).apply();
//
//            //Prioritize the closest formula unit, otherwise if a further away formula unit is given priority it will cause a "racing condition" in which
//            //it catches up, then gets de-prioritized, which makes particles switch between formula groups and creates incorrect velocities
//            List<DrainData> drainDataList = asList( sodiumChlorideDrainData, sucroseDrainData, calciumChlorideDrainData, sodiumNitrateDrainData, glucoseDrainData );
//            Collections.sort( drainDataList, new Comparator<DrainData>() {
//                public int compare( DrainData a, DrainData b ) {
//                    return Double.compare( draining.getTimeToError( a, dt ), draining.getTimeToError( b, dt ) );
//                }
//            } );
//
//            for ( DrainData drainData : drainDataList ) {
//                draining.updateParticlesFlowingToDrain( drainData, dt );
//            }
//        }
//
//        //Iterate over all particles and let them update in time
//        for ( Particle freeParticle : joinLists( freeParticles, sodiumChlorideCrystals, sodiumNitrateCrystals, calciumChlorideCrystals, sucroseCrystals, glucoseCrystals, drainedParticles ) ) {
//            freeParticle.stepInTime( dt );
//        }
//
//        //Workaround for completely dissolving any crystals that have become disconnected as a result of partial dissolving
//        dissolveDisconnectedCrystals.apply( sodiumChlorideCrystals );
//        dissolveDisconnectedCrystals.apply( sodiumNitrateCrystals );
//        dissolveDisconnectedCrystals.apply( calciumChlorideCrystals );
//        dissolveDisconnectedCrystals.apply( sucroseCrystals );
//        dissolveDisconnectedCrystals.apply( glucoseCrystals );
//
//        if ( DEBUG_CRYSTAL_RATIO ) {
//            for ( SodiumChlorideCrystal sodiumChlorideCrystal : sodiumChlorideCrystals ) {
//                boolean matches = sodiumChlorideCrystal.matchesFormulaRatio();
//                System.out.println( "matches = " + matches );
//            }
//
//            int count = 0;
//            for ( CalciumChlorideCrystal calciumChlorideCrystal : calciumChlorideCrystals ) {
//                System.out.println( "calciumChlorideCrystal[" + count + ", match = " + calciumChlorideCrystal.matchesFormulaRatio() );
//                count++;
//            }
//
//            for ( Particle crystal : joinLists( sodiumChlorideCrystals, sodiumNitrateCrystals, calciumChlorideCrystals, sucroseCrystals, glucoseCrystals ) ) {
//                Crystal c = (Crystal) crystal;
//                boolean matches = c.matchesFormulaRatio();
//                if ( !matches ) {
//                    System.out.println( "Crystal didn't match formula ratio: " + c );
//                }
//            }
//        }
//
//        //Allow the crystals to grow--not part of the strategies because it has to look at all particles within a group to decide which to crystallize
//        sodiumChlorideCrystalGrowth.allowCrystalGrowth( dt, sodiumChlorideSaturated );
//        sucroseCrystalGrowth.allowCrystalGrowth( dt, sucroseSaturated );
//        glucoseCrystalGrowth.allowCrystalGrowth( dt, glucoseSaturated );
//        calciumChlorideCrystalGrowth.allowCrystalGrowth( dt, calciumChlorideSaturated );
//        sodiumNitrateCrystalGrowth.allowCrystalGrowth( dt, sodiumNitrateSaturated );
//
//        //Update the number of solute types for purposes of changing the text on the "remove solute(s)" button
//        //Count the number of different formulae present in solution, that is the number of solutes
//        final int count = kit.getFormulae().filter( new Function1<Formula, Boolean>() {
//            public Boolean apply( Formula formula ) {
//                return countFreeFormulaUnits( formula ) > 0;
//            }
//        } ).size();
//        numberSoluteTypes.set( count + 0.0 );
//
//        //Notify listeners that the update step completed
//        for ( VoidFunction0 listener : stepFinishedListeners ) {
//            listener.apply();
//        }
//
//        //Water can be drained but this value is never used so no need to compute it exactly
//        return 0;
//    }
//
//    //Combine elements from several lists so they can be iterated over together
//    private ArrayList<Particle> joinLists( ItemList<? extends Particle>... freeParticles ) {
//        ArrayList<Particle> p = new ArrayList<Particle>();
//        for ( ItemList<? extends Particle> freeParticle : freeParticles ) {
//            ArrayList<? extends Particle> list = freeParticle.toList();
//            for ( Particle o : list ) {
//                p.add( o );
//            }
//        }
//        return p;
//    }
//
//    //Add a single salt crystal to the model
//    public void addSodiumChlorideCrystal( SodiumChlorideCrystal sodiumChlorideCrystal ) {
//
//        //Add the components of the lattice to the model so the graphics will be created
//        for ( SphericalParticle atom : sodiumChlorideCrystal ) {
//            sphericalParticles.add( atom );
//        }
//        sodiumChlorideCrystals.add( sodiumChlorideCrystal );
//        sodiumChlorideCrystal.setUpdateStrategy( new CrystalStrategy( this, sodiumChlorideCrystals, sodiumChlorideSaturated ) );
//    }
//
//    //Add a single sodium nitrate crystal to the model
//    public void addSodiumNitrateCrystal( SodiumNitrateCrystal crystal ) {
//        crystal.setUpdateStrategy( new CrystalStrategy( this, sodiumNitrateCrystals, sodiumNitrateSaturated ) );
//        addComponents( crystal );
//        sodiumNitrateCrystals.add( crystal );
//    }
//
//    //Add all SphericalParticles contained in the compound so the graphics will be created
//    private void addComponents( Compound<? extends Particle> compound ) {
//        for ( SphericalParticle sphericalParticle : compound.getAllSphericalParticles() ) {
//            sphericalParticles.add( sphericalParticle );
//        }
//    }
//
//    //Remove all SphericalParticles contained in the compound so the graphics will be deleted
//    public void removeComponents( Compound<?> compound ) {
//        for ( SphericalParticle sphericalParticle : compound.getAllSphericalParticles() ) {
//            sphericalParticles.remove( sphericalParticle );
//        }
//    }
//
//    public void addCalciumChlorideCrystal( CalciumChlorideCrystal calciumChlorideCrystal ) {
//        calciumChlorideCrystal.setUpdateStrategy( new CrystalStrategy( this, calciumChlorideCrystals, calciumChlorideSaturated ) );
//        addComponents( calciumChlorideCrystal );
//        calciumChlorideCrystals.add( calciumChlorideCrystal );
//    }
//
//    //Add a sucrose crystal to the model, and add graphics for all its constituent particles
//    public void addSucroseCrystal( SucroseCrystal sucroseCrystal ) {
//        sucroseCrystal.setUpdateStrategy( new CrystalStrategy( this, sucroseCrystals, sucroseSaturated ) );
//        addComponents( sucroseCrystal );
//        sucroseCrystals.add( sucroseCrystal );
//    }
//
//    //Add a glucose crystal to the model, and add graphics for all its constituent particles
//    public void addGlucoseCrystal( GlucoseCrystal glucoseCrystal ) {
//        glucoseCrystal.setUpdateStrategy( new CrystalStrategy( this, glucoseCrystals, glucoseSaturated ) );
//        addComponents( glucoseCrystal );
//        glucoseCrystals.add( glucoseCrystal );
//    }
//
//    //Keep the particle within the beaker solution bounds
//    public void preventFromLeavingBeaker( Particle particle ) {
//
//        //If the particle ever entered the water fully, don't let it leave through the top
//        if ( particle.hasSubmerged() ) {
//            preventFromMovingPastWaterTop( particle );
//        }
//        preventFromFallingThroughBeakerBase( particle );
//        preventFromFallingThroughBeakerRight( particle );
//        preventFromFallingThroughBeakerLeft( particle );
//    }
//
//    //prevent particles from falling through the top of the water
//    private void preventFromMovingPastWaterTop( Particle particle ) {
//        double waterTopY = solution.shape.get().getBounds2D().getMaxY();
//        double particleTopY = particle.getShape().getBounds2D().getMaxY();
//
//        if ( particleTopY > waterTopY ) {
//            particle.translate( 0, waterTopY - particleTopY - modelInset );
//        }
//    }
//
//    public boolean isCrystalTotallyAboveTheWater( Crystal crystal ) {
//        return crystal.getShape().getBounds2D().getY() > solution.shape.get().getBounds2D().getMaxY();
//    }
//
//    public void boundToBeakerBottom( Particle particle ) {
//        if ( particle.getShape().getBounds2D().getMinY() < 0 ) {
//            particle.translate( 0, -particle.getShape().getBounds2D().getMinY() );
//        }
//    }
//
//    //Get the external force acting on the particle, gravity if the particle is in free fall or zero otherwise (e.g., in solution)
//    public Vector2D getExternalForce( final boolean anyPartUnderwater ) {
//        return new Vector2D( 0, anyPartUnderwater ? 0 : -9.8 );
//    }
//
//    //Determine whether the object is underwater--when it touches the water it should slow down
//    public boolean isAnyPartUnderwater( Particle particle ) {
//        return particle.getShape().intersects( solution.shape.get().getBounds2D() );
//    }
//
//    public void collideWithWater( Particle particle ) {
//        particle.velocity.set( new Vector2D( 0, -1 ).times( 0.25E-9 ) );
//    }
//
//    public void reset() {
//        super.reset();
//
//        //Clear out solutes, particles, concentration values
//        clearSolutes();
//
//        //Reset model for user settings
//        showConcentrationValues.reset();
//        dispenserType.reset();
//        showChargeColor.reset();
//        selectedKit.reset();
//        clockRunning.reset();
//    }
//
//    //Remove all solutes from the model
//    public void clearSolutes() {
//
//        //Clear particle lists
//        sphericalParticles.clear();
//        freeParticles.clear();
//        sodiumChlorideCrystals.clear();
//        sodiumNitrateCrystals.clear();
//        calciumChlorideCrystals.clear();
//        sucroseCrystals.clear();
//    }
//
//    //Determine if there is any table salt to remove
//    public ObservableProperty<Boolean> isAnySaltToRemove() {
//        return sodium.concentration.greaterThan( 0.0 ).and( chloride.concentration.greaterThan( 0.0 ) );
//    }
//
//    //Determine if there is any sugar that can be removed
//    public ObservableProperty<Boolean> isAnySugarToRemove() {
//        return sucrose.concentration.greaterThan( 0.0 );
//    }
//
//    @Override public ObservableProperty<Boolean> getAnySolutes() {
//        return anySolutes;
//    }
//
//    //Iterate over particles that take random walks so they don't move above the top of the water
//    private void updateParticlesDueToWaterLevelDropped( double changeInWaterHeight ) {
//        waterLevelDropped( freeParticles, changeInWaterHeight );
//        waterLevelDropped( sucroseCrystals, changeInWaterHeight );
//        waterLevelDropped( sodiumChlorideCrystals, changeInWaterHeight );
//        waterLevelDropped( calciumChlorideCrystals, changeInWaterHeight );
//        waterLevelDropped( sodiumNitrateCrystals, changeInWaterHeight );
//    }
//
//    //When water level decreases, move the particles down with the water level.
//    //Beaker base is at y=0.  Move particles proportionately to how close they are to the top.
//    private void waterLevelDropped( ItemList<? extends Particle> particles, double volumeDropped ) {
//
//        double changeInWaterHeight = beaker.getHeightForVolume( volumeDropped ) - beaker.getHeightForVolume( 0 );
//        for ( Particle particle : particles ) {
//            if ( waterVolume.get() > 0 ) {
//                double yLocationInBeaker = particle.getPosition().getY();
//                double waterTopY = beaker.getHeightForVolume( waterVolume.get() );
//
//                //Only move particles down if they are fully underwater
//                if ( yLocationInBeaker < waterTopY ) {
//                    double fractionToTop = yLocationInBeaker / waterTopY;
//                    particle.translate( 0, -changeInWaterHeight * fractionToTop );
//
//                    //Prevent particles from leaving the top of the liquid
//                    preventFromLeavingBeaker( particle );
//                }
//            }
//
//            //This step must be done after prevention of particles leaving the top because falling through the bottom is worse (never returns), pushing through the top, particles
//            //would just fall back to the water level
//            preventFromFallingThroughBeakerBase( particle );
//        }
//    }
//
//    //prevent particles from falling through the bottom of the beaker
//    private void preventFromFallingThroughBeakerBase( Particle particle ) {
//        double bottomY = particle.getShape().getBounds2D().getMinY();
//        if ( bottomY < 0 ) {
//            particle.translate( 0, -bottomY + modelInset );
//        }
//    }
//
//    //prevent particles from falling through the bottom of the beaker
//    private void preventFromFallingThroughBeakerLeft( Particle particle ) {
//        double left = particle.getShape().getBounds2D().getMinX();
//        if ( left < beaker.getLeftWall().getX1() ) {
//            particle.translate( beaker.getLeftWall().getX1() - left, 0 );
//        }
//    }
//
//    //prevent particles from falling through the bottom of the beaker
//    private void preventFromFallingThroughBeakerRight( Particle particle ) {
//        double right = particle.getShape().getBounds2D().getMaxX();
//        if ( right > beaker.getRightWall().getX1() ) {
//            particle.translate( beaker.getRightWall().getX1() - right, 0 );
//        }
//    }
//
//    //When water evaporates, move the particles so they move down with the water level
//    @Override protected void waterEvaporated( double evaporatedWater ) {
//        super.waterEvaporated( evaporatedWater );
//        updateParticlesDueToWaterLevelDropped( evaporatedWater );
//    }
//
//    //Get the target configurations for some crystals for debugging purposes
//    public ArrayList<TargetConfiguration<SphericalParticle>> getAllBondingSites() {
//        ArrayList<TargetConfiguration<SphericalParticle>> s = new ArrayList<TargetConfiguration<SphericalParticle>>();
//        for ( SodiumChlorideCrystal crystal : sodiumChlorideCrystals ) {
//            s.add( new SodiumChlorideCrystalGrowth( this, sodiumChlorideCrystals ).getTargetConfiguration( crystal ) );
//        }
//        for ( CalciumChlorideCrystal crystal : calciumChlorideCrystals ) {
//            s.add( new CalciumChlorideCrystalGrowth( this, calciumChlorideCrystals ).getTargetConfiguration( crystal ) );
//        }
//        return s;
//    }
//
//    //Require crystallization and prevent dissolving when water volume is below this threshold.
//    //This is because there is so little water it would be impossible to dissolve anything and everything should crystallize
//    public boolean isWaterBelowCrystalThreshold() {
//        return waterVolume.get() <= Units.litersToMetersCubed( 0.03E-23 );
//    }
//}
