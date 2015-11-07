// Copyright 2014-2015, University of Colorado Boulder
/**
 * Provides growth for sodium chloride crystals.  Works with IncrementalGrowth by giving it
 * specific information about seeding and creating sodium chloride crystals
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CrystalGrowth = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalGrowth' );
  var AllPairs = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/AllPairs' );
  var SodiumChlorideCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumchloride/SodiumChlorideCrystal' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );
  var CrystalStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalStrategy' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Chloride' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Sodium' );

  /**
   *
   * @param {MicroModel} model
   * @param {ItemList} crystals
   * @constructor
   */
  function SodiumChlorideCrystalGrowth( model, crystals ) {
    CrystalGrowth.call( this, model, crystals );
  }

  return inherit( CrystalGrowth, SodiumChlorideCrystalGrowth, {
    /**
     * @returns {AllPairs}
     */
    getAllSeeds: function() {
      return new AllPairs( this.model.freeParticles, Sodium, Chloride );
    },

    /**
     * @protected
     * @override
     * @param {Vector2} position
     * @returns {SodiumChlorideCrystal}
     */
    newCrystal: function( position ) {
      var sodiumChlorideCrystal = new SodiumChlorideCrystal( position, RandomUtil.randomAngle() );
      sodiumChlorideCrystal.setUpdateStrategy( new CrystalStrategy( this.model,
        this.model.sodiumChlorideCrystals, this.model.sodiumChlorideSaturated ) );
      return sodiumChlorideCrystal;
    }

  } );
} );
