// Copyright 2002-2014, University of Colorado Boulder

/**
 * A particle is an indivisible object with a position such as Na+ or a sugar molecule.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var Motionless = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/Motionless' );

  /**
   *
   * @param {Vector2} position
   * @constructor
   */
  function Particle( position ) {
    PropertySet.call( this, {
      position: position, //Interface for setting and observing the position
      velocity: new Vector2() //Interface for setting and observing the velocity
    } );

    // Strategy instance for updating the model when time passes
    this.updateStrategy = new Motionless();

    //Flag to indicate whether the particle has ever been submerged underwater.  If so, the model update will constrain the particle so it doesn't leave the water again
    //Note this does not mean the particle is currently submerged, since it could get fully submerged once, then the water could evaporate so the particle is only partly submerged
    //In this case it should still be prevented from leaving the water area
    this.isSubmerged = false;


  }

  return inherit( PropertySet, Particle, {
    /**
     * Given the specified acceleration from external forces (such as gravity),
     * perform an Euler integration step to move the particle forward in time
     * @param {Vector2} acceleration
     * @param {number} dt (optional, if dt is not passed as a seconds argument acceleration is assumed to be dt. This
     * is to handle function overloading)
     */
    stepInTime: function() {
      var acceleration = 0;
      var dt = 0;
      var args = Array.prototype.slice.call( arguments );
      if ( args.length === 2 ) {
        acceleration = args[ 0 ];
        dt = args[ 1 ];
        this.velocity.add( acceleration.times( dt ) );
        this.setPosition( this.position.plus( this.velocity.times( dt ) ) );
      }
      if ( args.length === 1 ) {
        dt = args[ 0 ];
        // Updates the particle according to its UpdateStrategy, the first argument is dt
        this.updateStrategy.stepInTime( this, dt );
      }
    },
    /**
     * @param {Vector2} location
     */
    setPosition: function( location ) {
      this.positionProperty.set( location );
    },
    /**
     * Convenience method to translate a particle by the specified model delta (in meters)
     * @param {Vector2 or number} delta
     * double {number} dy
     */
    translate: function( delta, dy ) {
      if ( dy ) {
        this.setPosition(this.position.plusXY( delta, dy ));
      }
      else {
        this.setPosition(this.position.plus( delta ));
      }
    },
    /**
     * Get a shape for the particle for purposes of collision detection with beaker solution and beaker walls
     * @return {Shape}
     */
    getShape: function() {
      throw new Error( 'getShape should be implemented in descendant classes.' );
    },
    getPosition: function() {
      return this.position;
    },
    addPositionObserver: function( listener ) {
      this.positionProperty.link( listener );
    },
    /**
     * Determines whether the particle has ever been submerged, for purposes of updating its location during the
     * physics update. See field documentation for more
     * @returns {boolean}
     */
    hasSubmerged: function() {
      return this.isSubmerged;
    },
    /**
     * Sets whether the particle has ever been submerged, for purposes of updating its location during the physics update.
     * See field documentation for more
     */
    setSubmerged: function() {
      this.isSubmerged = true;
    },
    /**
     * Sets the strategy this particle uses to move in time
     * @param {IUpdateStrategy} updateStrategy
     */
    setUpdateStrategy: function( updateStrategy ) {
      this.updateStrategy = updateStrategy;
    },
    /**
     * Gets the distance between the particles
     * @param {Particle} b
     * @returns {number}
     */
    getDistance: function( b ) {
      return this.getPosition().distance( b.getPosition() );
    }

  } );

} );
