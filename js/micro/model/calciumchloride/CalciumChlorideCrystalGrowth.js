// Copyright 2014-2018, University of Colorado Boulder

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
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Calcium' );
  var CalciumChlorideCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/calciumchloride/CalciumChlorideCrystal' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Chloride' );
  var CrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalGrowth' );
  var CrystalStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalStrategy' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ItemList' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var ThreeParticleFormulaUnit = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/calciumchloride/ThreeParticleFormulaUnit' );

  /**
   *
   * @param {MicroModel} model
   * @param {ItemList<CalciumChlorideCrystal>} crystals
   * @constructor
   */
  function CalciumChlorideCrystalGrowth( model, crystals ) {
    CrystalGrowth.call( this, model, crystals );
  }

  sugarAndSaltSolutions.register( 'CalciumChlorideCrystalGrowth', CalciumChlorideCrystalGrowth );
  return inherit( CrystalGrowth, CalciumChlorideCrystalGrowth, {
    /**
     * @protected
     * @returns {ItemList}
     */
    getAllSeeds: function() {
      var aList = this.model.freeParticles.filterByClass( Calcium );
      var bList = this.model.freeParticles.filterByClass( Chloride );
      var formulaUnits = [];
      _.each( aList.getArray(), function( a ) {
        _.each( bList.getArray(), function( b ) {
          _.each( bList.getArray(), function( c ) {
            // Check for equality in case typeA==typeB, as in the case of Sucrose
            if ( b !== c ) {
              formulaUnits.push( new ThreeParticleFormulaUnit( a, b, c ) );
            }
          } );
        } );
      } );


      return new ItemList( formulaUnits );
    },

    /**
     * @protected
     * @override
     * @param {Vector2} position
     * @returns {CalciumChlorideCrystal}
     */
    newCrystal: function( position ) {
      var calciumChlorideCrystal = new CalciumChlorideCrystal( position, RandomUtil.randomAngle() );
      calciumChlorideCrystal.setUpdateStrategy( new CrystalStrategy( this.model, this.model.calciumChlorideCrystals,
        this.model.calciumChlorideSaturated ) );
      return calciumChlorideCrystal;
    }
  } );
} );
