// Copyright 2002-2012, University of Colorado
/**
 * Dispenser for the micro tab that emits sugar, either sucrose or glucose.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var Beaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Beaker' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType' );
  var SugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarDispenser' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );

  function MicroSugarDispenser( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model ) {
    //Keep track of how many times the user has tried to create macro salt, so that we can (less frequently) create corresponding micro crystals

    //private
    this.stepsOfAddingSugar = new Property( 0 );
    SugarDispenser.call( this, x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
  }

  return inherit( SugarDispenser, MicroSugarDispenser, {
//Checks to see if a sugar should be emitted, and if so, adds it to the model
    addSugarToModel: function( outputPoint ) {
      //Only add a crystal every N steps, otherwise there are too many
      stepsOfAddingSugar.set( stepsOfAddingSugar.get() + 1 );
      if ( stepsOfAddingSugar.get() % 10 == 0 ) {
        //Create a random crystal with 4 sucrose molecules
        doAddSugar( outputPoint );
      }
    },
//Adds a single sugar model item to the model at the specified point
    doAddSugar: function( outputPoint ) {}
  } );
} );

