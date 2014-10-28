// Copyright 2002-2012, University of Colorado
/**
 * A single solid crystal (sugar or salt) that comes from a shaker and gets dissolved in the water.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line2D = require( 'java.awt.geom.Line2D' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );

  function MacroCrystal( position, moles, volumePerMole ) {
    //kg
    this.mass = 1E-6;
    this.position;
    this.velocity = new Property( new Vector2( 0, 0 ) );
    this.acceleration = new Property( new Vector2( 0, 0 ) );

    //private
    this.removalListeners = [];
    //The number of moles of the crystal.  We couldn't just count the number of atoms since it would overflow Long

    //private
    this.moles;
    //True of the salt has landed on the floor of the beaker.  In this case it won't move anymore and will dissolve when liquid hits

    //private
    this.landed = false;
    //Length in m^3 of one side of the crystal, assuming it is perfectly cubic
    this.length;
    this.position = new Property( position );
    this.moles = moles;
    //Compute the length of a side
    var volume = volumePerMole * moles;
    length = Math.pow( volume, 1.0 / 3.0 );
  }

  return inherit( Object, MacroCrystal, {
//propagate the crystal according to the specified applied forces, using euler integration
    stepInTime: function( appliedForce, dt, leftBeakerWall, rightBeakerWall, beakerFloor, topOfSolid ) {
      if ( !landed ) {
        var originalPosition = position.get();
        acceleration.set( appliedForce.times( 1.0 / mass ) );
        velocity.set( velocity.get().plus( acceleration.get().times( dt ) ) );
        position.set( position.get().plus( velocity.get().times( dt ) ) );
        //Path that the particle took from previous time to current time, for purpose of collision detection with walls
        var path = new Line2D.Number( originalPosition.toPoint2D(), position.get().toPoint2D() );
        //if the particle bounced off a wall, then reverse its velocity
        if ( path.intersectsLine( leftBeakerWall ) || path.intersectsLine( rightBeakerWall ) ) {
          velocity.set( new Vector2( Math.abs( velocity.get().getX() ), velocity.get().getY() ) );
          //Rollback the previous update, and go the other way
          position.set( originalPosition );
          position.set( position.get().plus( velocity.get().times( dt ) ) );
        }
        //Compute the new path after accounting for bouncing off walls
        var newPath = new Line2D.Number( originalPosition.toPoint2D(), position.get().toPoint2D() );
        //See if it should land on the floor of the beaker
        if ( newPath.intersectsLine( beakerFloor ) ) {
          position.set( new Vector2( position.get().getX(), 0 ) );
          landed = true;
        }
        else //See if it should land on top of any precipitated solid in the beaker
        if ( newPath.intersectsLine( topOfSolid ) ) {
          //Move the crystal down a tiny bit so that it will be intercepted by the water on top of the solid precipitate when water is added
          position.set( new Vector2( position.get().getX(), topOfSolid.getY1() - 1E-6 ) );
          landed = true;
        }
      }
    },
//Determine if the crystal landed on the bottom of the beaker or on any precipitate for purposes of determining whether it should turn into solid
    isLanded: function() {
      return landed;
    },
//Add a listener which will be notified when this crystal is removed from the model
    addRemovalListener: function( removalListener ) {
      removalListeners.add( removalListener );
    },
//Remove a removal listener
    removeRemovalListener: function( removalListener ) {
      removalListeners.remove( removalListener );
    },
//Notify all removal listeners that this crystal is being removed from the model
    remove: function() {
      for ( var removalListener in removalListeners ) {
        removalListener.apply();
      }
    },
    getMoles: function() {
      return moles;
    },
//Test to compute the length of a side of one gram of salt cube
    main: function( args ) {
      var liters = 1.0 / 2165;
      var metersCubed = liters * 0.001;
      var lengthOfASide = Math.pow( metersCubed, 1.0 / 3.0 );
      console.log( "lengthOfASide = " + lengthOfASide );
    }
  } );
} );

