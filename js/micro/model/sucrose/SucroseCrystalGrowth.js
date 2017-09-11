// Copyright 2014-2015, University of Colorado Boulder
/**
 * Provides growth for sucrose crystals.  Works with IncrementalGrowth by giving it
 * specific information about seeding and creating sucrose crystals
 *
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
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sucrose/Sucrose' );
  var SucroseCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sucrose/SucroseCrystal' );

  /**
   *
   * @param {MicroModel} model
   * @param {ItemList} crystals
   * @constructor
   */
  function SucroseCrystalGrowth( model, crystals ) {
    CrystalGrowth.call( this, model, crystals );
  }

  return inherit( CrystalGrowth, SucroseCrystalGrowth, {
    /**
     * @override
     * @returns {AllPairs}
     */
    getAllSeeds: function() {
      return new AllPairs( this.model.freeParticles, Sucrose, Sucrose );
    },

    /**
     * @override
     * @protected
     * @param {Vector2} position
     * @returns {SucroseCrystal}
     */
    newCrystal: function( position ) {
      var sucroseCrystal = new SucroseCrystal( position, RandomUtil.randomAngle() );
      sucroseCrystal.setUpdateStrategy( new CrystalStrategy( this.model, this.model.sucroseCrystals, this.model.sucroseSaturated ) );
      return sucroseCrystal;
    }

  } );
} );
