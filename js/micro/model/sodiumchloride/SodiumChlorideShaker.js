// Copyright 2014-2017, University of Colorado Boulder
/**
 * This salt shaker adds salt (NaCl) crystals to the model when shaken
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MicroShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/MicroShaker' );
  var RandomUtil = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/RandomUtil' );
  var SodiumChlorideCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumchloride/SodiumChlorideCrystal' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<boolean>} moreAllowed
   * @param {string} name
   * @param {number} distanceScale
   * @param {Property<DispenserType>} selectedType
   * @param {DispenserType} type
   * @param {MicroModel} model
   * @constructor
   */
  function SodiumChlorideShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    MicroShaker.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  sugarAndSaltSolutions.register( 'SodiumChlorideShaker', SodiumChlorideShaker );
  return inherit( MicroShaker, SodiumChlorideShaker, {

    /**
     * Create a random salt crystal and add it to the model
     *
     * @param {MicroModel} model
     * @param {Vector2} outputPoint
     */
    addCrystal: function( model, outputPoint ) {
      var sodiumChlorideCrystal = new SodiumChlorideCrystal( outputPoint, RandomUtil.randomAngle() );
      sodiumChlorideCrystal.grow( 6 );

      //Attempt to randomly create a crystal with a correct balance of components
      model.addSodiumChlorideCrystal( sodiumChlorideCrystal );
    }
  } );
} );

