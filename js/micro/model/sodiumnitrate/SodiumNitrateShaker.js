// Copyright 2014-2015, University of Colorado Boulder
/**
 * This shaker adds sodium nitrate to the model when shaken
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MicroShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/MicroShaker' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil');
  var SodiumNitrateCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/SodiumNitrateCrystal' );

  /**
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<boolean>} moreAllowed
   * @param {string} name
   * @param {number} distanceScale
   * @param {Property<DispenserType>} selectedType
   * @param {DispenserType} type
   * @param {MicroModel} model
   * @constructor
   */
  function SodiumNitrateShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    MicroShaker.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  return inherit( MicroShaker, SodiumNitrateShaker, {

    /**
     * @override
     * @protected
     * @param {MicroModel} model
     * @param {Vector2} outputPoint
     */
    addCrystal: function( model, outputPoint ) {
      var sodiumNitrateCrystal = new SodiumNitrateCrystal( outputPoint, RandomUtil.randomAngle() );
      sodiumNitrateCrystal.grow( 6 );
      model.addSodiumNitrateCrystal( sodiumNitrateCrystal );
    }
  } );
} );
// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Beaker;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroModel;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroShaker;
//
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.RandomUtil.randomAngle;
//
///**
// * This shaker adds sodium nitrate to the model when shaken
// *
// * @author Sam Reid
// */
//public class SodiumNitrateShaker extends MicroShaker {
//    public SodiumNitrateShaker( double x, double y, Beaker beaker, ObservableProperty<Boolean> moreAllowed, String name, double distanceScale, ObservableProperty<DispenserType> selectedType, DispenserType type, MicroModel model ) {
//        super( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
//    }
//
//    @Override protected void addCrystal( MicroModel model, Vector2D outputPoint ) {
//        model.addSodiumNitrateCrystal( new SodiumNitrateCrystal( outputPoint, randomAngle() ) {{grow( 6 );}} );
//    }
//}
