// Copyright 2002-2012, University of Colorado
/**
 * Sugar crystal
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

//Create a sugar crystal with the specified amount in grams /mol
  var molarMass = 342.23134;
//Number of grams per grain of sugar, manually tuned to make it so that grains are small but it doesn't take too long to get the concentration bar to appear on the bar chart
//Making this number bigger won't change the size of the salt grain, but will change how fast the concentration goes up as salt is shaken in

  //private
  var gramsPerGrain = 0.4;

  //private
  var molesIn5Grams = gramsPerGrain / molarMass;

  function MacroSugar( position, volumePerMole ) {
    MacroCrystal.call( this, position, molesIn5Grams, volumePerMole );
  }

  return inherit( MacroCrystal, MacroSugar, {
    },
//statics
    {
      molarMass: molarMass
    } );
} );

