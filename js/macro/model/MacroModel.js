//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Introductory (macro) model that keeps track of moles of solute dissolved in the liquid.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/SugarAndSaltSolutionModel' );
  var BeakerDimension = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/BeakerDimension' );
  var ConductivityTester = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ConductivityTester' );
  var AirborneCrystalMoles = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/AirborneCrystalMoles' );
  var SoluteModel = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/SoluteModel' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/DispenserType' );
  var MacroSalt = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroSalt' );
  var MacroSugar = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroSugar' );
  var MacroSaltShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroSaltShaker' );
  var MacroSugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroSugarDispenser' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  // strings
  var saltString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/salt' );
  var sugarString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sugar' );

  //constants
  //Saturation points for salt and sugar assume 25 degrees C
  var saltSaturationPoint = 6.14 * 1000;//6.14 moles per liter, converted to SI
  var sugarSaturationPoint = 5.85 * 1000;//5.85 moles per liter, converted to SI

  //Force due to gravity near the surface of the earth in m/s^2
  var gravity = new Vector2( 0, -9.8 );

  /**
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {Bounds2} r
   * @returns {*}
   */
  function lineIntersectsBounds( x1, y1, x2, y2, r ) {
    return Util.lineSegmentIntersection( x1, y1, x2, y2, r.minX, r.minY, r.maxX, r.minY ) ||
           Util.lineSegmentIntersection( x1, y1, x2, y2, r.maxX, r.minY, r.maxX, r.maxY ) ||
           Util.lineSegmentIntersection( x1, y1, x2, y2, r.maxX, r.maxY, r.minX, r.maxY ) ||
           Util.lineSegmentIntersection( x1, y1, x2, y2, r.minX, r.maxY, r.minX, r.minY ) ||
           (r.containsCoordinates( x1, y1 ) && r.containsCoordinates( x2, y2 ));
  }

  /**
   * @param {number} aspectRatio
   * @constructor
   */
  function MacroModel( aspectRatio ) {
    var thisModel = this;
    SugarAndSaltSolutionModel.call( thisModel,
      aspectRatio, //Use the same aspect ratio as the view to minimize insets with blank regions
      30, //frames per second
      new BeakerDimension( 0.2 ),
      0.0005, // faucetFlowRate
      // These values were sampled from the model with debug mode by printing out the model
      // location of the mouse and moving it to a location that looks good
      0.011746031746031754,
      0.026349206349206344,
      1//In macro model scales are already tuned so no additional scaling is needed
    );

    //Sugar and its listeners
    thisModel.sugarList = new ObservableArray();//The sugar crystals that haven't been dissolved

    //Salt and its listeners
    thisModel.saltList = new ObservableArray();//The salt crystals that haven't been dissolved

    //    //Model for the conductivity tester which is in the macro tab but not other tabs
    thisModel.conductivityTester=new ConductivityTester( thisModel.beaker );

    //Model moles, concentration, amount dissolved, amount precipitated, etc. for salt and sugar
    //The chemistry team informed me that there is 0.2157/1000 meters cubed per mole of solid sugar
    thisModel.salt = new SoluteModel( thisModel.waterVolume, saltSaturationPoint, SugarAndSaltConstants.VOLUME_PER_SOLID_MOLE_SALT,
      MacroSalt.molarMass );
    thisModel.sugar = new SoluteModel( thisModel.waterVolume, sugarSaturationPoint, 0.2157 / 1000.0, MacroSugar.molarMass );

    //Flag to indicate if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).
    //This is used to show/hide the "remove solutes" button
    //Determine if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).
    thisModel.anySolutes = thisModel.salt.moles.greaterThanNumber( 0 ).or( thisModel.sugar.moles.greaterThanNumber( 0 ) );

    //Total volume of the water plus any solid precipitate submerged under the water (and hence pushing it up)
    thisModel.solidVolume = new DerivedProperty( [ thisModel.salt.solidVolume, thisModel.sugar.solidVolume ], function() {
      return thisModel.salt.solidVolume.get() + thisModel.sugar.solidVolume.get();
    } );

    //The concentration in the liquid in moles / m^3
    //Determine the concentration of dissolved solutes
    //When we were accounting for volume effects of dissolved solutes, the concentrations had to be defined here instead of
    //in SoluteModel because they depend on the total volume of the solution (which in turn depends on the amount of solute
    //dissolved in the solvent).
    thisModel.saltConcentration = new DerivedProperty( [ thisModel.salt.molesDissolved, thisModel.solution.volume ], function() {
      return thisModel.salt.molesDissolved.get() / thisModel.solution.volume.get();
    } );
    thisModel.sugarConcentration = new DerivedProperty( [ thisModel.sugar.molesDissolved, thisModel.solution.volume ], function() {
      return thisModel.sugar.molesDissolved.get() / thisModel.solution.volume.get();
    } );

    //Amounts of sugar and salt in crystal form falling from the dispenser
    //Keep track of how many moles of crystal are in the air, since we need to prevent user from adding more than
    //10 moles to the system
    //This shuts off salt/sugar when there is salt/sugar in the air that could get added to the solution
    thisModel.airborneSaltGrams = new AirborneCrystalMoles( thisModel.saltList ).times( thisModel.salt.gramsPerMole );
    thisModel.airborneSugarGrams = new AirborneCrystalMoles( thisModel.sugarList ).times( thisModel.sugar.gramsPerMole );

    //Properties to indicate if the user is allowed to add more of the solute.  If not allowed the dispenser is shown as empty.
    thisModel.moreSaltAllowed = new DerivedProperty( [ thisModel.salt.grams, thisModel.airborneSaltGrams ], function() {
      return (thisModel.salt.grams.get() + thisModel.airborneSaltGrams.get()) < 100;
    } );

    thisModel.moreSugarAllowed = new DerivedProperty( [ thisModel.sugar.grams, thisModel.airborneSugarGrams ], function() {
      return (thisModel.sugar.grams.get() + thisModel.airborneSugarGrams.get()) < 100;
    } );

    //Add models for the various dispensers: sugar, salt, etc.
    thisModel.dispensers.push( new MacroSaltShaker( thisModel.beaker.getCenterX(), thisModel.beaker.getTopY() + thisModel.beaker.getHeight() * 0.5,
      thisModel.beaker, thisModel.moreSaltAllowed, saltString, thisModel.distanceScale, thisModel.dispenserType, DispenserType.SALT, this ) );

    thisModel.dispensers.push( new MacroSugarDispenser( thisModel.beaker.getCenterX(), thisModel.beaker.getTopY() + thisModel.beaker.getHeight() * 0.5,
      thisModel.beaker, thisModel.moreSugarAllowed, sugarString, thisModel.distanceScale, thisModel.dispenserType, DispenserType.SUGAR, this ) );

    thisModel.crystalsListChangedCallbacks = []; // function()
  }

  return inherit( SugarAndSaltSolutionModel, MacroModel, {
    /**
     * @protected
     * Update the model when the clock ticks
     * @param {number} dt
     * @return {number} how much water was drained out
     */
    updateModel: function( dt ) {

      //Have to record the concentrations before the model updates since the concentrations change if water is added or removed.
      var initialSaltConcentration = this.saltConcentration.get();
      var initialSugarConcentration = this.sugarConcentration.get();

      var drainedWater = SugarAndSaltSolutionModel.prototype.updateModel.call( this, dt );

      //Notify listeners that some water (with solutes) exited the system, so they can decrease the amounts
      //of solute (moles, not molarity) in the system
      //Only call when draining, would have the wrong behavior for evaporation
      if ( drainedWater > 0 ) {
        this.waterDrained( drainedWater, initialSaltConcentration, initialSugarConcentration );
      }

      if ( this.saltList.length > 0 || this.sugarList.length > 0 ) {
        this.fireCrystalListChanged();
      }

      //Move about the sugar and salt crystals, and maybe absorb them
      this.updateCrystals( dt, this.saltList );
      this.updateCrystals( dt, this.sugarList );
      return drainedWater;
    },

    /**
     * Registers a callback that will be notified when crystals are added to the model
     * @param {function} callback
     */
    registerListChangedCallback: function( callback ) {
      this.crystalsListChangedCallbacks.push( callback );
    },

    // @private Notify if Crystals Item List got changed
    fireCrystalListChanged: function() {
      var changedCallbacks = this.crystalsListChangedCallbacks.slice( 0 );
      for ( var i = 0; i < changedCallbacks.length; i++ ) {
        changedCallbacks[ i ]();
      }
    },

    /**
     *Propagate the sugar and salt crystals, and absorb them if they hit the water
     * @param {number} dt
     * @param {ObservableArray<MacroCrystal>} crystalList
     */
    updateCrystals: function( dt, crystalList ) {
      var thisModel = this;
      var hitTheWater = []; // Array<MacroCrystal>

      crystalList.forEach( function( crystal ) {
        //Store the initial location so we can use the (final - start) line to check for collision with water, so it can't
        // jump over the water rectangle
        var initialLocation = crystal.position.get();

        //slow the motion down a little bit or it moves too fast since the camera is zoomed in so much
        crystal.stepInTime( gravity.times( crystal.mass ), dt / 10, thisModel.beaker.getLeftWall(), thisModel.beaker.getRightWall(),
          thisModel.beaker.getFloor(), thisModel.beaker.getTopOfSolid() );

        //If the salt hits the water during any point of its initial -> final trajectory, absorb it.
        //This is necessary because if the water layer is too thin, the crystal could have jumped over it completely
        if ( lineIntersectsBounds( initialLocation.x, initialLocation.y, crystal.position.get().x, crystal.position.get().y,
            thisModel.solution.shape.get().bounds ) ) {
          hitTheWater.push( crystal );
        }
        //Any crystals that landed on the beaker base or on top of precipitate should immediately precipitate into solid
        //so that they take up the right volume and are consistent with our other representations
        else if ( crystal.isLanded() ) {
          hitTheWater.push( crystal );
        }
      } );
      //Remove the salt crystals that hit the water
      thisModel.removeCrystals( crystalList, hitTheWater );

      //increase concentration in the water for crystals that hit
      hitTheWater.forEach( function( crystal ) {
        thisModel.crystalAbsorbed( crystal );
      } );

      //Update the properties representing how many crystals are in the air, to make sure we stop pouring out crystals
      // if we have reached the limit.(even if poured out crystals didn't get dissolved yet)
      thisModel.airborneSaltGrams.notifyObserversStatic(); // Notify if another the underlying item got changed
      thisModel.airborneSugarGrams.notifyObserversStatic();
    },

    /**
     * When a crystal is absorbed by the water, increase the number of moles in solution
     * @param {MacroCrystal} crystal
     */
    crystalAbsorbed: function( crystal ) {
      if ( crystal instanceof MacroSalt ) {
        this.salt.moles.set( this.salt.moles.get() + crystal.moles );
      }
      else if ( crystal instanceof MacroSugar ) {
        this.sugar.moles.set( this.sugar.moles.get() + crystal.moles );
      }
    },

    /**
     * @protected
     * Called when water (with dissolved solutes) flows out of the beaker, so that subclasses can update
     * concentrations if necessary.Have some moles of salt and sugar flow out so that the concentration remains unchanged
     * @param {number} outVolume
     * @param {number} initialSaltConcentration
     * @param {number} initialSugarConcentration
     */
    waterDrained: function( outVolume, initialSaltConcentration, initialSugarConcentration ) {

      //Make sure to keep the concentration the same when water flowing out.  Use the values recorded before the model stepped to ensure conservation of solute moles
      this.updateConcentration( outVolume, initialSaltConcentration, this.salt.moles );
      this.updateConcentration( outVolume, initialSugarConcentration, this.sugar.moles );
    },

    /**
     * @private
     * Make sure to keep the concentration the same when water flowing out
     * @param {number} outVolume
     * @param {number} concentration
     * @param {Property<number>} moles
     */
    updateConcentration: function( outVolume, concentration, moles ) {
      var molesOfSoluteLeaving = concentration * outVolume;
      moles.set( moles.get() - molesOfSoluteLeaving );
    },

    //Called when the user presses a button to clear the solutes, removes all solutes from the sim
    removeSaltAndSugar: function() {
      this.removeSalt();
      this.removeSugar();
    },

    //Called when the user presses a button to clear the salt, removes all salt (dissolved and crystals) from the sim
    removeSalt: function() {
      this.removeCrystals( this.saltList, this.saltList );
      this.salt.moles.set( 0.0 );
    },

    //Called when the user presses a button to clear the sugar, removes all sugar (dissolved and crystals) from the sim
    removeSugar: function() {
      this.removeCrystals( this.sugarList, this.sugarList );
      this.sugar.moles.set( 0.0 );
    },

    /**
     * Adds the specified Sugar crystal to the model
     * @param {MacroSugar} sugar
     */
    addMacroSugar: function( sugar ) {
      this.sugarList.add( sugar );
    },

    /**
     * Adds the specified salt crystal to the model
     * @param {MacroSalt} salt
     */
    addMacroSalt: function( salt ) {
      this.saltList.add( salt );
    },

    /**
     * Determine if any salt can be removed for purposes of displaying a "remove salt" button
     * @returns {Property<Boolean>}
     */
    isAnySaltToRemove: function() {
      return this.salt.moles.greaterThanNumber( 0.0 );
    },

    /**
     * Determine if any sugar can be removed for purposes of displaying a "remove sugar" button
     * @returns {Property<Boolean>}
     */
    isAnySugarToRemove: function() {
      return this.sugar.moles.greaterThanNumber( 0.0 );
    },

    /**
     *
     * @returns {Property<Boolean>}
     */
    getAnySolutes: function() {
      return this.anySolutes;
    },

    /**
     * Remove the specified crystals.
     * @private
     * @param {ObservableArray<MacroCrystal>} crystalList
     * @param {Array<MacroCrystal>} toRemove
     */
    removeCrystals: function( crystalList, toRemove ) {
      toRemove.forEach( function( crystal ) {
        crystalList.remove( crystal );
      } );
    }

  } );
} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.macro.model;
//
//import java.awt.geom.Line2D;
//import java.awt.geom.Rectangle2D;
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.math.ImmutableRectangle2D;
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock;
//import edu.colorado.phet.common.phetcommon.model.event.Notifier;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.SettableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.doubleproperty.CompositeDoubleProperty;
//import edu.colorado.phet.common.phetcommon.util.RichSimpleObserver;
//import edu.colorado.phet.common.piccolophet.nodes.conductivitytester.IConductivityTester.ConductivityTesterChangeListener;
//import edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Strings;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.AirborneCrystalMoles;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.BeakerDimension;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ConductivityTester;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SugarAndSaltSolutionModel;
//import edu.colorado.phet.sugarandsaltsolutions.macro.view.MacroSugarDispenser;
//
//import static edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType.SALT;
//import static edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType.SUGAR;
//

//public class MacroModel extends SugarAndSaltSolutionModel {
//
//    //Model for the conductivity tester which is in the macro tab but not other tabs
//    public final ConductivityTester conductivityTester;
//

//
//    //Model moles, concentration, amount dissolved, amount precipitated, etc. for salt and sugar
//    public final SoluteModel salt;
//    public final SoluteModel sugar;
//
//    //Total volume of the water plus any solid precipitate submerged under the water (and hence pushing it up)
//    public final CompositeDoubleProperty solidVolume;
//
//    //The concentration in the liquid in moles / m^3
//    public final CompositeDoubleProperty saltConcentration;
//    public final CompositeDoubleProperty sugarConcentration;
//
//    //Amounts of sugar and salt in crystal form falling from the dispenser
//    protected final CompositeDoubleProperty airborneSaltGrams;
//    protected final CompositeDoubleProperty airborneSugarGrams;
//
//    //Force due to gravity near the surface of the earth in m/s^2
//    private final Vector2D gravity = new Vector2D( 0, -9.8 );
//
//    //Flag to indicate if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).  This is used to show/hide the "remove solutes" button
//    public final ObservableProperty<Boolean> anySolutes;
//
//    public MacroModel() {
//        super( new ConstantDtClock( 30 ), new BeakerDimension( 0.2 ), 0.0005,
//
//               //These values were sampled from the model with debug mode by printing out the model location of the mouse and moving it to a location that looks good
//               0.011746031746031754, 0.026349206349206344,
//
//               //In macro model scales are already tuned so no additional scaling is needed
//               1 );
//
//        //Model moles, concentration, amount dissolved, amount precipitated, etc. for salt and sugar
//        //The chemistry team informed me that there is 0.2157/1000 meters cubed per mole of solid sugar
//        salt = new SoluteModel( waterVolume, saltSaturationPoint, SoluteModel.VOLUME_PER_SOLID_MOLE_SALT, MacroSalt.molarMass );
//        sugar = new SoluteModel( waterVolume, sugarSaturationPoint, 0.2157 / 1000.0, MacroSugar.molarMass );
//
//        //Determine if there are any solutes (i.e., if moles of salt or moles of sugar is greater than zero).  This is used to show/hide the "remove solutes" button
//        anySolutes = salt.moles.greaterThan( 0 ).or( sugar.moles.greaterThan( 0 ) );
//
//        //Total volume of the water plus any solid precipitate submerged under the water (and hence pushing it up)
//        solidVolume = salt.solidVolume.plus( sugar.solidVolume );
//
//        //Determine the concentration of dissolved solutes
//        //When we were accounting for volume effects of dissolved solutes, the concentrations had to be defined here instead of in SoluteModel because they depend on the total volume of the solution (which in turn depends on the amount of solute dissolved in the solvent).
//        saltConcentration = salt.molesDissolved.dividedBy( solution.volume );
//        sugarConcentration = sugar.molesDissolved.dividedBy( solution.volume );
//
//        //Keep track of how many moles of crystal are in the air, since we need to prevent user from adding more than 10 moles to the system
//        //This shuts off salt/sugar when there is salt/sugar in the air that could get added to the solution
//        airborneSaltGrams = new AirborneCrystalMoles( saltList ).times( salt.gramsPerMole );
//        airborneSugarGrams = new AirborneCrystalMoles( sugarList ).times( sugar.gramsPerMole );
//
//        //Properties to indicate if the user is allowed to add more of the solute.  If not allowed the dispenser is shown as empty.
//        ObservableProperty<Boolean> moreSaltAllowed = salt.grams.plus( airborneSaltGrams ).lessThan( 100 );
//        ObservableProperty<Boolean> moreSugarAllowed = sugar.grams.plus( airborneSugarGrams ).lessThan( 100 );
//
//        //Add models for the various dispensers: sugar, salt, etc.
//        dispensers.add( new MacroSaltShaker( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSaltAllowed, Strings.SALT, distanceScale, dispenserType, SALT, this ) );
//        dispensers.add( new MacroSugarDispenser( beaker.getCenterX(), beaker.getTopY() + beaker.getHeight() * 0.5, beaker, moreSugarAllowed, Strings.SUGAR, distanceScale, dispenserType, SUGAR, this ) );
//
//        //Model for the conductivity tester
//        conductivityTester = new ConductivityTester( beaker.getWidth(), beaker.getHeight() );
//
//        //When the conductivity tester probe locations change, also update the conductivity tester brightness since they may come into contact (or leave contact) with the fluid
//        conductivityTester.addConductivityTesterChangeListener( new ConductivityTesterChangeListener() {
//            public void brightnessChanged() {
//            }
//
//            public void positiveProbeLocationChanged() {
//                updateConductivityTesterBrightness();
//            }
//
//            public void negativeProbeLocationChanged() {
//                updateConductivityTesterBrightness();
//            }
//
//            public void locationChanged() {
//                //Have to callback here too since the battery or bulb could get submerged and short the circuit
//                updateConductivityTesterBrightness();
//            }
//        } );
//
//        //Update the conductivity tester when the water level changes, since it might move up to touch a probe (or move out from underneath a submerged probe)
//        new RichSimpleObserver() {
//            @Override public void update() {
//                updateConductivityTesterBrightness();
//            }
//        }.observe( saltConcentration, solution.shape, outputWater );
//    }
//


//    //Adds the specified Sugar crystal to the model
//    public void addMacroSugar( final MacroSugar sugar ) {
//        sugarList.add( sugar );
//        sugarAdded.updateListeners( sugar );
//    }
//

//
//    //Propagate the sugar and salt crystals, and absorb them if they hit the water
//    private void updateCrystals( double dt, final ArrayList<? extends MacroCrystal> crystalList ) {
//        ArrayList<MacroCrystal> hitTheWater = new ArrayList<MacroCrystal>();
//        for ( MacroCrystal crystal : crystalList ) {
//            //Store the initial location so we can use the (final - start) line to check for collision with water, so it can't jump over the water rectangle
//            Vector2D initialLocation = crystal.position.get();
//
//            //slow the motion down a little bit or it moves too fast since the camera is zoomed in so much
//            crystal.stepInTime( gravity.times( crystal.mass ), dt / 10, beaker.getLeftWall(), beaker.getRightWall(), beaker.getFloor(),
//                                new Line2D.Double( beaker.getFloor().getX1(), 0, beaker.getFloor().getX2(), 0 ) );
//
//            //If the salt hits the water during any point of its initial -> final trajectory, absorb it.
//            //This is necessary because if the water layer is too thin, the crystal could have jumped over it completely
//            if ( new Line2D.Double( initialLocation.toPoint2D(), crystal.position.get().toPoint2D() ).intersects( solution.shape.get().getBounds2D() ) ) {
//                hitTheWater.add( crystal );
//            }
//            //Any crystals that landed on the beaker base or on top of precipitate should immediately precipitate into solid so that they take up the right volume and are consistent with our other representations
//            else if ( crystal.isLanded() ) {
//                hitTheWater.add( crystal );
//            }
//        }
//        //Remove the salt crystals that hit the water
//        removeCrystals( crystalList, hitTheWater );
//
//        //increase concentration in the water for crystals that hit
//        for ( MacroCrystal crystal : hitTheWater ) {
//            crystalAbsorbed( crystal );
//        }
//
//        //Update the properties representing how many crystals are in the air, to make sure we stop pouring out crystals if we have reached the limit
//        // (even if poured out crystals didn't get dissolved yet)
//        airborneSaltGrams.notifyIfChanged();
//        airborneSugarGrams.notifyIfChanged();
//    }
//
//    //Determine if a conductivity tester probe is touching water in the beaker, or water flowing out of the beaker (which would have the same concentration as the water in the beaker)
//    private boolean isProbeTouchingWaterThatMightHaveSalt( ImmutableRectangle2D region ) {
//        Rectangle2D waterBounds = solution.shape.get().getBounds2D();
//
//        final Rectangle2D regionBounds = region.toRectangle2D();
//        return waterBounds.intersects( region.toRectangle2D() ) || outputWater.get().getBounds2D().intersects( regionBounds );
//    }
//
//    //Update the conductivity tester brightness when the probes come into contact with (or stop contacting) the fluid
//    protected void updateConductivityTesterBrightness() {
//
//        //Check for a collision with the probe, using the full region of each probe (so if any part intersects, there is still an electrical connection).
//        Rectangle2D waterBounds = solution.shape.get().getBounds2D();
//
//        //See if both probes are touching water that might have salt in it
//        boolean bothProbesTouching = isProbeTouchingWaterThatMightHaveSalt( conductivityTester.getPositiveProbeRegion() ) && isProbeTouchingWaterThatMightHaveSalt( conductivityTester.getNegativeProbeRegion() );
//
//        //Check to see if the circuit is shorted out (if light bulb or battery is submerged).
//        //Null checks are necessary since those regions are computed from view components and may not have been computed yet (but will be non-null if the user dragged out the conductivity tester from the toolbox)
//        boolean batterySubmerged = conductivityTester.getBatteryRegion() != null && waterBounds.intersects( conductivityTester.getBatteryRegion().getBounds2D() );
//        boolean bulbSubmerged = conductivityTester.getBulbRegion() != null && waterBounds.intersects( conductivityTester.getBulbRegion().getBounds2D() );
//
//        //The circuit should short out if the battery or bulb is submerged, but only if the water is conducting due to having some salt
//        boolean shortCircuited = ( batterySubmerged || bulbSubmerged ) && saltConcentration.get() > 0;
//
//        //Set the brightness to be a linear function of the salt concentration (but keeping it bounded between 0 and 1 which are the limits of the conductivity tester brightness
//        //Use a scale factor that matches up with the limits on saturation (manually sampled at runtime)
//        conductivityTester.brightness.set( bothProbesTouching && !shortCircuited ? MathUtil.clamp( 0, saltConcentration.get() * 1.62E-4, 1 ) : 0.0 );
//        conductivityTester.shortCircuited.set( shortCircuited );
//    }
//

//
//    @Override public void reset() {
//        super.reset();
//        removeSaltAndSugar();
//        conductivityTester.reset();
//    }
//

//
//    //Called when water (with dissolved solutes) flows out of the beaker, so that subclasses can update concentrations if necessary.
//    //Have some moles of salt and sugar flow out so that the concentration remains unchanged
//    protected void waterDrained( double outVolume, double initialSaltConcentration, double initialSugarConcentration ) {
//
//        //Make sure to keep the concentration the same when water flowing out.  Use the values recorded before the model stepped to ensure conservation of solute moles
//        updateConcentration( outVolume, initialSaltConcentration, salt.moles );
//        updateConcentration( outVolume, initialSugarConcentration, sugar.moles );
//    }
//
//    //Make sure to keep the concentration the same when water flowing out
//    private void updateConcentration( double outVolume, double concentration, SettableProperty<Double> moles ) {
//        double molesOfSoluteLeaving = concentration * outVolume;
//        moles.set( moles.get() - molesOfSoluteLeaving );
//    }
//
//    //Update the model when the clock ticks
//    protected double updateModel( double dt ) {
//
//        //Have to record the concentrations before the model updates since the concentrations change if water is added or removed.
//        double initialSaltConcentration = saltConcentration.get();
//        double initialSugarConcentration = sugarConcentration.get();
//
//        double drainedWater = super.updateModel( dt );
//
//        //Notify listeners that some water (with solutes) exited the system, so they can decrease the amounts of solute (moles, not molarity) in the system
//        //Only call when draining, would have the wrong behavior for evaporation
//        if ( drainedWater > 0 ) {
//            waterDrained( drainedWater, initialSaltConcentration, initialSugarConcentration );
//        }
//
//        //Move about the sugar and salt crystals, and maybe absorb them
//        updateCrystals( dt, saltList );
//        updateCrystals( dt, sugarList );
//
//        return drainedWater;
//    }
//
//    //Remove the specified crystals.  Note that the toRemove
//    private void removeCrystals( ArrayList<? extends MacroCrystal> crystalList, ArrayList<? extends MacroCrystal> toRemove ) {
//        for ( MacroCrystal crystal : new ArrayList<MacroCrystal>( toRemove ) ) {
//            crystal.remove();
//            crystalList.remove( crystal );
//        }
//    }
//}
