// Copyright 2014-2015, University of Colorado Boulder
/**
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/SugarDispenser' );
  var MacroSugar = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroSugar' );

  /**
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<Boolean>} moreAllowed
   * @param {string} sugarDispenserName
   * @param {number} distanceScale
   * @param {Property<DispenserType>} selectedType
   * @param {DispenserType} type
   * @param {MacroModel} model
   * @constructor
   */
  function MacroSugarDispenser( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model ) {

    var thisDispenser = this;
    SugarDispenser.call( thisDispenser, x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
  }

  return inherit( SugarDispenser, MacroSugarDispenser, {
    /**
     * @param {Vector2} outputPoint
     */
    addSugarToModel: function( outputPoint ) {
      //Add the sugar, with some randomness in the velocity
      var macroSugar = new MacroSugar( outputPoint, this.model.sugar.volumePerSolidMole );
      macroSugar.velocity.set( this.getCrystalVelocity( outputPoint ).plus( ( Math.random() - 0.5 ) * 0.05,
          ( Math.random() - 0.5 ) * 0.05 ) );
      this.model.addMacroSugar( macroSugar );
    }
  } );
} );
