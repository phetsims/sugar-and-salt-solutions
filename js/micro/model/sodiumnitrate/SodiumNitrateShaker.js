// Copyright 2002-2012, University of Colorado
/**
 * This shaker adds sodium nitrate to the model when shaken
 *
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
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var MicroShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroShaker' );
  var randomAngle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/RandomUtil/randomAngle' );//static

  function SodiumNitrateShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    MicroShaker.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  return inherit( MicroShaker, SodiumNitrateShaker, {
    addCrystal: function( model, outputPoint ) {
      model.addSodiumNitrateCrystal( new SodiumNitrateCrystal( outputPoint, randomAngle() ).withAnonymousClassBody( {
        initializer: function() {
          grow( 6 );
        }
      } ) );
    }
  } );
} );

