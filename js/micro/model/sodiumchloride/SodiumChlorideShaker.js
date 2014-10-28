// Copyright 2002-2012, University of Colorado
/**
 * This salt shaker adds salt (NaCl) crystals to the model when shaken
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

  function SodiumChlorideShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    MicroShaker.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  return inherit( MicroShaker, SodiumChlorideShaker, {
//Create a random salt crystal and add it to the model
    addCrystal: function( model, outputPoint ) {
      //Attempt to randomly create a crystal with a correct balance of components
      model.addSodiumChlorideCrystal( new SodiumChlorideCrystal( outputPoint, randomAngle() ).withAnonymousClassBody( {
        initializer: function() {
          grow( 6 );
        }
      } ) );
    }
  } );
} );

