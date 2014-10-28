// Copyright 2002-2012, University of Colorado
/**
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Beaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Beaker' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType' );
  var SugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarDispenser' );
  var MacroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroModel' );
  var MacroSugar = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroSugar' );

  function MacroSugarDispenser( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model ) {
    SugarDispenser.call( this, x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
  }

  return inherit( SugarDispenser, MacroSugarDispenser, {
    addSugarToModel: function( outputPoint ) {
      //Add the sugar, with some randomness in the velocity
      model.addMacroSugar( new MacroSugar( outputPoint, model.sugar.volumePerSolidMole ).withAnonymousClassBody( {
        initializer: function() {
          velocity.set( getCrystalVelocity( outputPoint ).plus( (random.nextDouble() - 0.5) * 0.05, (random.nextDouble() - 0.5) * 0.05 ) );
        }
      } ) );
    }
  } );
} );

