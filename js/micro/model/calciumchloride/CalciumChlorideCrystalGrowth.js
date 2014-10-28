// Copyright 2002-2012, University of Colorado
/**
 * Provides growth for calcium chloride crystals.  Works with IncrementalGrowth by giving it specific information about seeding and creating calcium chloride crystals
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
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var CrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/CrystalGrowth' );
  var CrystalStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/CrystalStrategy' );
  var IFormulaUnit = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/IFormulaUnit' );
  var randomAngle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/RandomUtil/randomAngle' );//static

  function CalciumChlorideCrystalGrowth( model, crystals ) {
    CrystalGrowth.call( this, model, crystals );
  }

  return inherit( CrystalGrowth, CalciumChlorideCrystalGrowth, {
    getAllSeeds: function() {
      var aList = model.freeParticles.filter( SphericalParticle.Calcium.class );
      var bList = model.freeParticles.filter( SphericalParticle.Chloride.class );
      var formulaUnits = [];
      for ( var a in aList ) {
        for ( var b in bList ) {
          for ( var c in bList ) {
            //Check for equality in case typeA==typeB, as in the case of Sucrose
            if ( b != c ) {
              formulaUnits.add( new ThreeParticleFormulaUnit( a, b, c ) );
            }
          }
        }
      }
      return formulaUnits;
    },
    newCrystal: function( position ) {
      return new CalciumChlorideCrystal( position, randomAngle() ).withAnonymousClassBody( {
        initializer: function() {
          setUpdateStrategy( new CrystalStrategy( model, model.calciumChlorideCrystals, model.calciumChlorideSaturated ) );
        }
      } );
    }
  } );
} );

