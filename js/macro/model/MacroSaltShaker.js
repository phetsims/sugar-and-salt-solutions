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
  var SaltShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/SaltShaker' );
  var MacroSalt = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroSalt' );

  function MacroSaltShaker() {

  }


  return inherit( SaltShaker, MacroSaltShaker, {

    /**
     * @protected
     * @override
     * Adds the salt to the model
     * @param {MacroModel}model
     * @param {Vector2} outputPoint
     * @param {number} volumePerSolidMole
     * @param {Vector2} crystalVelocity
     */
    addSalt: function( model, outputPoint, volumePerSolidMole, crystalVelocity ) {

      // Add the salt
      var macroSalt = new MacroSalt( outputPoint, volumePerSolidMole );
      model.addMacroSalt( macroSalt );

      //Give the salt an appropriate velocity when it comes out so it arcs
      macroSalt.velocity.set( crystalVelocity );
    }
  } );

} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.macro.model;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Beaker;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SaltShaker;
//
///**
// * @author Sam Reid
// */
//public class MacroSaltShaker extends SaltShaker<MacroModel> {
//    public MacroSaltShaker( double x, double y, Beaker beaker, ObservableProperty<Boolean> moreAllowed, String name, double distanceScale, ObservableProperty<DispenserType> selectedType, DispenserType type, MacroModel model ) {
//        super( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
//    }
//
//    @Override protected void addSalt( MacroModel model, Vector2D outputPoint, double volumePerSolidMole, final Vector2D crystalVelocity ) {
//
//
//    }
//}
