// Copyright 2014-2018, University of Colorado Boulder
/**
 * Sugar crystal
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MacroCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroCrystal' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  // constants
  // Create a sugar crystal with the specified amount in grams /mol
  var molarMass = 342.23134;

  // Number of grams per grain of sugar, manually tuned to make it so that grains are small but it doesn't take too long
  // to get the concentration bar to appear on the bar chart.Making this number bigger won't change the size of the
  // salt grain, but will change how fast the concentration goes up as salt is shaken in
  var gramsPerGrain = 0.4;

  var molesIn5Grams = gramsPerGrain / molarMass;

  /**
   * @param {Vector2} position
   * @param {number} volumePerMole
   * @constructor
   */
  function MacroSugar( position, volumePerMole ) {
    MacroCrystal.call( this, position, molesIn5Grams, volumePerMole );
  }

  sugarAndSaltSolutions.register( 'MacroSugar', MacroSugar );

  return inherit( MacroCrystal, MacroSugar, {},
    //static
    {
      molarMass: molarMass,
      gramsPerGrain: 0.4

    }
  );
} );
