// Copyright 2002-2012, University of Colorado
/**
 * A particle is an indivisible object with a position such as Na+ or a sugar molecule.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var IUpdateStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/IUpdateStrategy' );
  var Motionless = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/Motionless' );

  function Particle( position ) {
    //Interface for setting and observing the position

    //private
    this.position;
    //Interface for setting and observing the velocity
    this.velocity;
    //Strategy instance for updating the model when time passes

    //private
    this.updateStrategy = new Motionless();
    //Flag to indicate whether the particle has ever been submerged underwater.  If so, the model update will constrain the particle so it doesn't leave the water again
    //Note this does not mean the particle is currently submerged, since it could get fully submerged once, then the water could evaporate so the particle is only partly submerged
    //In this case it should still be prevented from leaving the water area

    //private
    this.hasSubmerged = false;
    this.position = new Property( position );
    this.velocity = new Property( new Vector2() );
  }

  return inherit( Object, Particle, {
//Given the specified acceleration from external forces (such as gravity), perform an Euler integration step to move the particle forward in time
    stepInTime: function( acceleration, dt ) {
      velocity.set( velocity.get().plus( acceleration.times( dt ) ) );
      setPosition( position.get().plus( velocity.get().times( dt ) ) );
    },
    setPosition: function( location ) {
      position.set( location );
    },
//Convenience method to translate a particle by the specified model delta (in meters)
    translate: function( delta ) {
      translate( delta.getX(), delta.getY() );
    },
    translate: function( dx, dy ) {
      setPosition( position.get().plus( dx, dy ) );
    },
//Get a shape for the particle for purposes of collision detection with beaker solution and beaker walls
    getShape: function() {},
    getPosition: function() {
      return position.get();
    },
    addPositionObserver: function( listener ) {
      position.addObserver( listener );
    },
//Determines whether the particle has ever been submerged, for purposes of updating its location during the physics update.  See field documentation for more
    hasSubmerged: function() {
      return hasSubmerged;
    },
//Sets whether the particle has ever been submerged, for purposes of updating its location during the physics update.  See field documentation for more
    setSubmerged: function() {
      hasSubmerged = true;
    },
//Sets the strategy this particle uses to move in time
    setUpdateStrategy: function( updateStrategy ) {
      this.updateStrategy = updateStrategy;
    },
//Updates the particle according to its UpdateStrategy
    stepInTime: function( dt ) {
      updateStrategy.stepInTime( this, dt );
    },
//Gets the distance between the particles
    getDistance: function( b ) {
      return getPosition().distance( b.getPosition() );
    }
  } );
} );

