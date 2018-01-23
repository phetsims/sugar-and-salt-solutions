// Copyright 2014-2017, University of Colorado Boulder
/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MacroSalt = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroSalt' );
  var SaltShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/SaltShaker' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<Boolean>} moreAllowed
   * @param {string} name
   * @param {number} distanceScale
   * @param {Property<DispenserType>} selectedType
   * @param {DispenserType} type
   * @param {*} model
   * @constructor
   */
  function MacroSaltShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    SaltShaker.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  sugarAndSaltSolutions.register( 'MacroSaltShaker', MacroSaltShaker );

  return inherit( SaltShaker, MacroSaltShaker, {

    /**
     * @protected
     * @override
     * Adds the salt to the model
     * @param {MacroModel}model
     * @param {Vector2} outputPoint
     * @param {number} volumePerSolidMole
     * @param {Vector2} crystalVelocity
     */
    addSalt: function( model, outputPoint, volumePerSolidMole, crystalVelocity ) {
      // Add the salt
      var macroSalt = new MacroSalt( outputPoint, volumePerSolidMole );
      model.addMacroSalt( macroSalt );

      //Give the salt an appropriate velocity when it comes out so it arcs
      macroSalt.velocity.set( crystalVelocity );
    }
  } );

} );


