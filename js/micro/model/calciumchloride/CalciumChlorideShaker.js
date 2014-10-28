// Copyright 2002-2012, University of Colorado
/**
 * This shaker adds calcium chloride to the model when shaken
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

  function CalciumChlorideShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    MicroShaker.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
  }

  return inherit( MicroShaker, CalciumChlorideShaker, {
    addCrystal: function( model, outputPoint ) {
      model.addCalciumChlorideCrystal( new CalciumChlorideCrystal( outputPoint, randomAngle() ).withAnonymousClassBody( {
        initializer: function() {
          grow( 6 );
        }
      } ) );
    },
//Test for creating calcium chloride crystals, which are susceptible to dead ends.  Make sure there are enough successes
    main: function( args ) {
      for ( var i = 0; i < 10000; i++ ) {
        console.log( "creating " + i );
        var finalI = i;
        new CalciumChlorideCrystal( Vector2.ZERO, randomAngle() ).withAnonymousClassBody( {
          initializer: function() {
            var success = grow( 6 );
            if ( !success ) {
              console.log( "Failed to grow at i=" + finalI );
            }
          }
        } );
      }
    }
  } );
} );

