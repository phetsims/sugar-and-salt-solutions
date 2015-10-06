// Copyright 2002-2014, University of Colorado Boulder
/**
 * Provides growth for glucose crystals.  Works with IncrementalGrowth by giving
 * it specific information about seeding and creating glucose crystals
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalGrowth' );
  var CrystalStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalStrategy' );
  var AllPairs = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/AllPairs' );
  var GlucoseCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/glucose/GlucoseCrystal' );
  var Glucose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/glucose/Glucose' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );


  /**
   *
   * @param {MicroModel} model
   * @param {ItemList} crystals
   * @constructor
   */
  function GlucoseCrystalGrowth( model, crystals ) {
    CrystalGrowth.call( this, model, crystals );
  }

  return inherit( CrystalGrowth, GlucoseCrystalGrowth, {

    /**
     * @param {Vector} position
     * @returns {GlucoseCrystal}
     */
    newCrystal: function( position ) {
      var glucoseCrystal = new GlucoseCrystal( position, RandomUtil.randomAngle() );
      glucoseCrystal.setUpdateStrategy( new CrystalStrategy( this.model, this.model.glucoseCrystals, this.model.glucoseSaturated ) );
      return glucoseCrystal;
    },

    /**
     * @override
     * @returns {AllPairs}
     */
    getAllSeeds: function() {
      return new AllPairs( this.model.freeParticles, Glucose, Glucose );
    }

  } );

} );
// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.glucose;
//
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ItemList;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroModel;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.AllPairs;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.CrystalGrowth;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.CrystalStrategy;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.IFormulaUnit;
//
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.RandomUtil.randomAngle;
//
///**
// * Provides growth for glucose crystals.  Works with IncrementalGrowth by giving it specific information about seeding and creating glucose crystals
// *
// * @author Sam Reid
// */
//public class GlucoseCrystalGrowth extends CrystalGrowth<Glucose, GlucoseCrystal> {
//    public GlucoseCrystalGrowth( MicroModel model, ItemList<GlucoseCrystal> crystals ) {
//        super( model, crystals );
//    }
//
//getAllSeeds:function() {
//  return new AllPairs( this.model.freeParticles, Glucose, Glucose );
//}
//
//    @Override protected GlucoseCrystal newCrystal( Vector2D position ) {
//        return new GlucoseCrystal( position, randomAngle() ) {{setUpdateStrategy( new CrystalStrategy( model, model.glucoseCrystals, model.glucoseSaturated ) );}};
//    }
//}
