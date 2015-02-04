//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Model dispenser that shakes glucose into the model.
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MicroSugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/MicroSugarDispenser' );
  var GlucoseCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/glucose/GlucoseCrystal' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );

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
  function GlucoseDispenser( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    MicroSugarDispenser.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  return inherit( MicroSugarDispenser, GlucoseDispenser, {
    /**
     * @protected
     * @override
     * Create and add a random glucose crystal with 4 sucrose molecules
     * @param {Vector2} outputPoint
     */
    doAddSugar: function( outputPoint ) {
      var glucoseCrystal = new GlucoseCrystal( outputPoint, RandomUtil.randomAngle() );
      glucoseCrystal.grow( 3 );
      this.model.addGlucoseCrystal( glucoseCrystal );
    }
  } );
} );

