// Copyright 2002-2012, University of Colorado
/**
 * Model dispenser that shakes sucrose into the model.
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
  var SucroseCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/SucroseCrystal' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var randomAngle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/RandomUtil/randomAngle' );//static

  function SucroseDispenser( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model ) {
    MicroSugarDispenser.call( this, x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
  }

  return inherit( MicroSugarDispenser, SucroseDispenser, {
//Create and add a random sucrose crystal with 4 sucrose molecules
    doAddSugar: function( outputPoint ) {
      model.addSucroseCrystal( new SucroseCrystal( outputPoint, randomAngle() ).withAnonymousClassBody( {
        initializer: function() {
          grow( 3 );
        }
      } ) );
    }
  } );
} );

