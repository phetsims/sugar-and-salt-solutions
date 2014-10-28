// Copyright 2002-2012, University of Colorado
/**
 * A shaker for the "micro tab" emits crystals less frequently than in the macro tab.  This class keeps track of when and what to emit.
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
  var SaltShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SaltShaker' );

  function MicroShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    //Keep track of how many times the user has tried to create macro salt, so that we can (less frequently) create corresponding micro crystals

    //private
    this.stepsAdding = new Property( 0 );
    SaltShaker.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  return inherit( SaltShaker, MicroShaker, {
    addSalt: function( model, outputPoint, volumePerSolidMole, crystalVelocity ) {
      //Only add a crystal every N steps, otherwise there are too many
      stepsAdding.set( stepsAdding.get() + 1 );
      if ( stepsAdding.get() % 30 == 0 ) {
        addCrystal( model, outputPoint );
      }
    },
//This method actually adds the crystal
    addCrystal: function( model, outputPoint ) {}
  } );
} );

