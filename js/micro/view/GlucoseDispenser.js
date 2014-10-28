// Copyright 2002-2012, University of Colorado
/**
 * Model dispenser that shakes glucose into the model.
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
  var GlucoseCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/glucose/GlucoseCrystal' );
  var randomAngle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/RandomUtil/randomAngle' );//static

  function GlucoseDispenser( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model ) {
    MicroSugarDispenser.call( this, x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
  }

  return inherit( MicroSugarDispenser, GlucoseDispenser, {
//Create and add a random glucose crystal with 4 sucrose molecules
    doAddSugar: function( outputPoint ) {
      model.addGlucoseCrystal( new GlucoseCrystal( outputPoint, randomAngle() ).withAnonymousClassBody( {
        initializer: function() {
          grow( 3 );
        }
      } ) );
    }
  } );
} );

