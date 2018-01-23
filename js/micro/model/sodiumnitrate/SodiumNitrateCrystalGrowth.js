// Copyright 2014-2017, University of Colorado Boulder
/**
 * Provides growth for sodium nitrate crystals.  Works with IncrementalGrowth by giving it specific
 * information about seeding and creating sodium nitrate crystals
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AllPairs = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/AllPairs' );
  var CrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalGrowth' );
  var CrystalStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalStrategy' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Nitrate = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/Nitrate' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Sodium' );
  var SodiumNitrateCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/SodiumNitrateCrystal' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );


  /**
   *
   * @param {MicroModel} model
   * @param {ItemList} crystals
   * @constructor
   */
  function SodiumNitrateCrystalGrowth( model, crystals ) {
    CrystalGrowth.call( this, model, crystals );
  }

  sugarAndSaltSolutions.register( 'SodiumNitrateCrystalGrowth', SodiumNitrateCrystalGrowth );
  return inherit( CrystalGrowth, SodiumNitrateCrystalGrowth, {
    /**
     * @returns {AllPairs}
     */
    getAllSeeds: function() {
      return new AllPairs( this.model.freeParticles, Sodium, Nitrate );
    },

    /**
     * @protected
     * @override
     * @param {Vector2} position
     * @returns {SodiumNitrateCrystal}
     */
    newCrystal: function( position ) {
      var sodiumNitrateCrystal = new SodiumNitrateCrystal( position, RandomUtil.randomAngle() );
      sodiumNitrateCrystal.setUpdateStrategy( new CrystalStrategy( this.model,
        this.model.sodiumNitrateCrystals, this.model.sodiumNitrateSaturated ) );
      return sodiumNitrateCrystal;
    }
  } );
} );
// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate;
//
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ItemList;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Sodium;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroModel;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.AllPairs;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.CrystalGrowth;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.CrystalStrategy;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.IFormulaUnit;
//
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.RandomUtil.randomAngle;
//
///**
// * Provides growth for sodium nitrate crystals.  Works with IncrementalGrowth by giving it specific information about seeding and creating sodium nitrate crystals
// *
// * @author Sam Reid
// */
//public class SodiumNitrateCrystalGrowth extends CrystalGrowth<Particle, SodiumNitrateCrystal> {
//    public SodiumNitrateCrystalGrowth( MicroModel model, ItemList<SodiumNitrateCrystal> crystals ) {
//        super( model, crystals );
//    }
//
//    @Override protected ArrayList<IFormulaUnit> getAllSeeds() {
//        return new AllPairs( model.freeParticles, Sodium.class, Nitrate.class );
//    }
//
//    @Override protected SodiumNitrateCrystal newCrystal( Vector2D position ) {
//        return new SodiumNitrateCrystal( position, randomAngle() ) {{setUpdateStrategy( new CrystalStrategy( model, model.sodiumNitrateCrystals, model.sodiumNitrateSaturated ) );}};
//    }
//
//}
