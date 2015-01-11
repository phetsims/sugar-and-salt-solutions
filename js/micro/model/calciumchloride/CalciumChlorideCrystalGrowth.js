// Copyright 2002-2014, University of Colorado Boulder

/**
 * Provides growth for calcium chloride crystals.  Works with IncrementalGrowth by
 * giving it specific information about seeding and creating calcium chloride crystals
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CalciumChlorideCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/calciumchloride/CalciumChlorideCrystal' );
  var ThreeParticleFormulaUnit = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/calciumchloride/ThreeParticleFormulaUnit' );
  var CrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalGrowth' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Calcium' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Chloride' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );
  var CrystalStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalStrategy' );

  /**
   *
   * @param {MicroModel} model
   * @param {ItemList<CalciumChlorideCrystal>} crystals
   * @constructor
   */
  function CalciumChlorideCrystalGrowth( model, crystals ) {
    CrystalGrowth.call(this,model,crystals);
   }
  return inherit( CrystalGrowth, CalciumChlorideCrystalGrowth, {
    /**
     * @protected
     * @return {Array<IFormulaUnit>}
     */
    getAllSeeds: function() {
      var aList = this.model.freeParticles.filter( Calcium );
      var bList = this.model.freeParticles.filter( Chloride );
      var formulaUnits = [];
      _.each( aList.getArray(), function( a ) {
        _.each( bList.getArray(), function( b ) {
          _.each( bList.getArray(), function( c ) {
            //Check for equality in case typeA==typeB, as in the case of Sucrose
            if ( b !== c ) {
              formulaUnits.push( new ThreeParticleFormulaUnit( a, b, c ) );
            }
          } );
        } );
      } );
      return formulaUnits;
    },

    /**
     * @protected
     * @override
     * @param {Vector} position
     * @returns {CalciumChlorideCrystal}
     */
    newCrystal:function(  position ) {
      var calciumChlorideCrystal = new CalciumChlorideCrystal( position, RandomUtil.randomAngle() );
      calciumChlorideCrystal.setUpdateStrategy( new CrystalStrategy( this.model, this.model.calciumChlorideCrystals,
        this.model.calciumChlorideSaturated ) );
      return calciumChlorideCrystal;
    }

  } );


} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.calciumchloride;
//
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ItemList;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroModel;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.CrystalGrowth;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.CrystalStrategy;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.IFormulaUnit;
//
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.RandomUtil.randomAngle;
//
///**
// *
// *
// * @author Sam Reid
// */
//public class CalciumChlorideCrystalGrowth extends CrystalGrowth<SphericalParticle, CalciumChlorideCrystal> {
//    public CalciumChlorideCrystalGrowth( MicroModel model, ItemList<CalciumChlorideCrystal> crystals ) {
//        super( model, crystals );
//    }
//
//    @Override protected ArrayList<IFormulaUnit> getAllSeeds() {
//
//        ItemList<Particle> aList = model.freeParticles.filter( SphericalParticle.Calcium.class );
//        ItemList<Particle> bList = model.freeParticles.filter( SphericalParticle.Chloride.class );
//        ArrayList<IFormulaUnit> formulaUnits = new ArrayList<IFormulaUnit>();
//        for ( Particle a : aList ) {
//            for ( Particle b : bList ) {
//                for ( Particle c : bList ) {
//                    //Check for equality in case typeA==typeB, as in the case of Sucrose
//                    if ( b != c ) {
//                        formulaUnits.add( new ThreeParticleFormulaUnit<Particle>( a, b, c ) );
//                    }
//                }
//            }
//        }
//        return formulaUnits;
//
//    }
//
//    @Override protected CalciumChlorideCrystal newCrystal( Vector2D position ) {
//        return new CalciumChlorideCrystal( position, randomAngle() ) {{setUpdateStrategy( new CrystalStrategy( model, model.calciumChlorideCrystals, model.calciumChlorideSaturated ) );}};
//    }
//}
