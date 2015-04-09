// Copyright 2002-2014, University of Colorado Boulder
/**
 * DrainData helps to maintain a constant concentration as particles flow out the drain by tracking flow rate and timing
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {Formula} formula
   * @constructor
   */
  function DrainData( formula ) {
    //initial number of formula units (such as Ca + Cl + Cl for CaCl) at time user started manipulating drain
    // faucet, used to choose a target concentration in MicroModel
    this.initialNumberFormulaUnits = 0;

    //initial volume at time user started manipulating drain faucet, in m^3, used to choose a
    //target concentration in MicroModel
    this.initialVolume = 0;

    //the previous flow rate of the drain faucet, for purposes of recording the target
    //concentration when user starts draining fluid.
    this.previousDrainFlowRate = 0;

    //The formula to match for the formula unit, necessary since concentration is different for each solute type
    //Do not set other state here since it should only be set once the user starts manipulating the drain faucet
    this.formula = formula;
  }

  return inherit( Object, DrainData );
} );

//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics;
//
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Formula;
//
///**
// * DrainData helps to maintain a constant concentration as particles flow out the drain by tracking flow rate and timing
// *
// * @author Sam Reid
// */
//public class DrainData {
//
//    //initial number of formula units (such as Ca + Cl + Cl for CaCl) at time user started manipulating drain faucet, used to choose a target concentration in MicroModel
//    public int initialNumberFormulaUnits;
//
//    //initial volume at time user started manipulating drain faucet, in m^3, used to choose a target concentration in MicroModel
//    public double initialVolume;
//
//    //the previous flow rate of the drain faucet, for purposes of recording the target concentration when user starts draining fluid.
//    public double previousDrainFlowRate;
//
//    //The formula to match for the formula unit, necessary since concentration is different for each solute type
//    public final Formula formula;
//
//    public DrainData( Formula formula ) {
//        this.formula = formula;
//
//        //Do not set other state here since it should only be set once the user starts manipulating the drain faucet
//    }
//}
