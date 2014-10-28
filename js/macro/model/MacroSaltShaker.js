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
  var SaltShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SaltShaker' );

  function MacroSaltShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    SaltShaker.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  return inherit( SaltShaker, MacroSaltShaker, {
    addSalt: function( model, outputPoint, volumePerSolidMole, crystalVelocity ) {
      //Add the salt
      model.addMacroSalt( new MacroSalt( outputPoint, volumePerSolidMole ).withAnonymousClassBody( {
        initializer: function() {
          //Give the salt an appropriate velocity when it comes out so it arcs
          velocity.set( crystalVelocity );
        }
      } ) );
    }
  } );
} );

