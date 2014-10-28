// Copyright 2002-2012, University of Colorado
/**
 * One formula unit of particles to be used as a seed for creating a crystal that starts with 3 elements, such as CaCl2.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Vector2 = require( 'DOT/Vector2' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var IFormulaUnit = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/IFormulaUnit' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var FREE_PARTICLE_SPEED = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/UpdateStrategy/FREE_PARTICLE_SPEED' );//static

  function ThreeParticleFormulaUnit( a, b, c ) {

    //private
    this.a;

    //private
    this.b;

    //private
    this.c;
    this.a = a;
    this.b = b;
    this.c = c;
  }

  return inherit( Object, ThreeParticleFormulaUnit, {
//Determine how far apart all constituents are
    getDistance: function() {
      var ab = a.getDistance( b );
      var bc = b.getDistance( c );
      var ac = a.getDistance( c );
      return (ab + bc + ac) / 3;
    },
//Move the constituents closer to their centroid so they can form a crystal
    moveTogether: function( dt ) {
      var centroid = (a.getPosition().plus( b.getPosition() ).plus( c.getPosition() )).times( 1.0 / 3 );
      moveToCentroid( a, centroid, dt );
      moveToCentroid( b, centroid, dt );
      moveToCentroid( c, centroid, dt );
    },
//Move a particle to the centroid so the particles can get closer together to form a crystal

    //private
    moveToCentroid: function( particle, centroid, dt ) {
      var unitVectorToCentroid = new Vector2( particle.getPosition(), centroid ).normalized();
      var velocity = unitVectorToCentroid.times( FREE_PARTICLE_SPEED );
      particle.velocity.set( velocity );
      particle.stepInTime( ZERO, dt );
    },
//Get the three particles in the unit
    getParticles: function() {
      return [].withAnonymousClassBody( {
        initializer: function() {
          add( a );
          add( b );
          add( c );
        }
      } );
    }
  } );
} );

