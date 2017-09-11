// Copyright 2015, University of Colorado Boulder
/**
 * Model dispenser that shakes sucrose into the model.
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MicroSugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/MicroSugarDispenser' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );
  var SucroseCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sucrose/SucroseCrystal' );

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<boolean>} moreAllowed
   * @param {string} name
   * @param {number} distanceScale
   * @param {<Property<DispenserType<string>>} selectedType
   * @param {DispenserType<string>} type
   * @param {MicroModel}model
   * @constructor
   * @abstract
   */
  function SucroseDispenser( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    MicroSugarDispenser.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  return inherit( MicroSugarDispenser, SucroseDispenser, {
    /**
     * @protected
     * @override
     * Create and add a random sucrose crystal with 4 sucrose molecules
     * @param {Vector2} outputPoint
     */
    doAddSugar: function( outputPoint ) {
      var sucroseCrystal = new SucroseCrystal( outputPoint, RandomUtil.randomAngle() );
      sucroseCrystal.grow( 3 );
      this.model.addSucroseCrystal( sucroseCrystal );
    }
  } );
} );

