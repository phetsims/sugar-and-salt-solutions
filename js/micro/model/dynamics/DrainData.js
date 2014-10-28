// Copyright 2002-2011, University of Colorado
/**
 * DrainData helps to maintain a constant concentration as particles flow out the drain by tracking flow rate and timing
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Formula' );

  function DrainData( formula ) {
    //initial number of formula units (such as Ca + Cl + Cl for CaCl) at time user started manipulating drain faucet, used to choose a target concentration in MicroModel
    this.initialNumberFormulaUnits;
    //initial volume at time user started manipulating drain faucet, in m^3, used to choose a target concentration in MicroModel
    this.initialVolume;
    //the previous flow rate of the drain faucet, for purposes of recording the target concentration when user starts draining fluid.
    this.previousDrainFlowRate;
    //The formula to match for the formula unit, necessary since concentration is different for each solute type
    this.formula;
    this.formula = formula;
  }

  return inherit( Object, DrainData, {
  } );
} );

