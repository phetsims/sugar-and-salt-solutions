// Copyright 2002-2012, University of Colorado
/**
 * Provides growth for glucose crystals.  Works with IncrementalGrowth by giving it specific information about seeding and creating glucose crystals
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Vector2 = require( 'DOT/Vector2' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var AllPairs = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/AllPairs' );
  var CrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/CrystalGrowth' );
  var CrystalStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/CrystalStrategy' );
  var IFormulaUnit = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/IFormulaUnit' );
  var randomAngle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/RandomUtil/randomAngle' );//static

  function GlucoseCrystalGrowth( model, crystals ) {
    CrystalGrowth.call( this, model, crystals );
  }

  return inherit( CrystalGrowth, GlucoseCrystalGrowth, {
    getAllSeeds: function() {
      return new AllPairs( model.freeParticles, Glucose.class, Glucose.class );
    },
    newCrystal: function( position ) {
      return new GlucoseCrystal( position, randomAngle() ).withAnonymousClassBody( {
        initializer: function() {
          setUpdateStrategy( new CrystalStrategy( model, model.glucoseCrystals, model.glucoseSaturated ) );
        }
      } );
    }
  } );
} );

