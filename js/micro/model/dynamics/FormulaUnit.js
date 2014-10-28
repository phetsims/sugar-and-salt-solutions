// Copyright 2002-2012, University of Colorado
/**
 * Pair of matching particles that could potentially form a crystal together, if they are close enough together.  Order within the pair is irrelevant.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Vector2 = require( 'DOT/Vector2' );
  var Pair = require( 'edu.colorado.phet.common.phetcommon.util.Pair' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var FREE_PARTICLE_SPEED = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/UpdateStrategy/FREE_PARTICLE_SPEED' );//static

  function FormulaUnit( a, b ) {
    Pair.call( this, a, b );
  }

  return inherit( Pair, FormulaUnit, {
//Get the distance between the particles
    getDistance: function() {
      return _1.getPosition().distance( _2.getPosition() );
    },
//Move the particles closer together at the free particle speed
    moveTogether: function( dt ) {
      var unitVectorFromAToB = new Vector2( _1.getPosition(), _2.getPosition() ).normalized();
      var velocity = unitVectorFromAToB.times( FREE_PARTICLE_SPEED );
      _1.velocity.set( velocity );
      _2.velocity.set( velocity.times( -1 ) );
      _1.stepInTime( ZERO, dt );
      _2.stepInTime( ZERO, dt );
    },
    getParticles: function() {
      return [].withAnonymousClassBody( {
        initializer: function() {
          add( _1 );
          add( _2 );
        }
      } );
    }
  } );
} );

