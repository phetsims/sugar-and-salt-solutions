//  Copyright 2002-2014, University of Colorado Boulder
/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/SugarDispenser' );
  var MacroSugar = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroSugar' );

  /**
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<Boolean>} moreAllowed
   * @param {string} sugarDispenserName
   * @param {number} distanceScale
   * @param {Property<DispenserType>} selectedType
   * @param {DispenserType} type
   * @param {MacroModel} model
   * @constructor
   */
  function MacroSugarDispenser( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model ) {

    var thisDispenser = this;
    SugarDispenser.call( thisDispenser, x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
  }

  return inherit( SugarDispenser, MacroSugarDispenser, {
    addSugarToModel: function( outputPoint ) {

      //Add the sugar, with some randomness in the velocity
      var macroSugar = new MacroSugar( outputPoint, this.model.sugar.volumePerSolidMole );
      macroSugar.velocity.set( this.getCrystalVelocity( outputPoint ).plus( ( Math.random() - 0.5 ) * 0.05,
          ( Math.random() - 0.5 ) * 0.05 ) );
    }
  } );
} );


//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.macro.view;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Beaker;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SugarDispenser;
//import edu.colorado.phet.sugarandsaltsolutions.macro.model.MacroModel;
//import edu.colorado.phet.sugarandsaltsolutions.macro.model.MacroSugar;
//
///**
// * @author Sam Reid
// */
//public class MacroSugarDispenser extends SugarDispenser<MacroModel> {
//    public MacroSugarDispenser( double x, double y, Beaker beaker, ObservableProperty<Boolean> moreAllowed, final String sugarDispenserName, double distanceScale, ObservableProperty<DispenserType> selectedType, DispenserType type, MacroModel model ) {
//        super( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
//    }
//

//    }
//}
