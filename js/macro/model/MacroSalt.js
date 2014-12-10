//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Salt crystal
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MacroCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroCrystal' );

  //constants
  //Manually tuned to make it so that grains are small but it doesn't take too long to get the concentration bar to appear
  //on the bar chart./Making this number bigger won't change the size of the salt grain, but will change how
  //fast the concentration goes up as salt is shaken in
  var gramsPerGrain = 0.2;
  //Create a salt crystal with the specified amount in g/mol
  var molarMass = 58.4425;
  var molesIn5Grams = gramsPerGrain / molarMass;

  /**
   *
   * @param {Vector2} position
   * @param {number} volumePerMole
   * @constructor
   */
  function MacroSalt( position, volumePerMole ) {
    MacroCrystal.call( this, position, molesIn5Grams, volumePerMole );
  }

  return inherit( MacroCrystal, MacroSalt, {},
    //static
    {
      molarMass: molarMass,
      gramsPerGrain: 0.4,
      molesIn5Grams: gramsPerGrain / molarMass
    } );

} );
