// Copyright 2014-2018, University of Colorado Boulder
/**
 * A single solid crystal (sugar or salt) that comes from a shaker and gets dissolved in the water.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Vector2} position
   * @param {number} moles
   * @param {number} volumePerMole
   * @constructor
   */
  function MacroCrystal( position, moles, volumePerMole ) {
    var self = this;

    self.mass = 1E-6;//kg
    self.positionProperty = new Property( position );
    self.velocityProperty = new Property( new Vector2( 0, 0 ) );
    self.acceleration = new Property( new Vector2( 0, 0 ) );

    // @private The number of moles of the crystal.  We couldn't just count the number of atoms since it would
    // overflow Long
    self.moles = moles;

    // Compute the length of a side
    var volume = volumePerMole * moles;

    // Length in m^3 of one side of the crystal, assuming it is perfectly cubic
    self.length = Math.pow( volume, 1.0 / 3.0 );

    // @private True of the salt has landed on the floor of the beaker.  In this case it won't move anymore and will
    // dissolve when liquid hits
    self.landed = false;

  }

  sugarAndSaltSolutions.register( 'MacroCrystal', MacroCrystal );

  return inherit( Object, MacroCrystal, {

    /**
     * Determine if the crystal landed on the bottom of the beaker or on any precipitate for
     * purposes of determining whether it should turn into solid
     * @returns {boolean|*}
     */
    isLanded: function() {
      return this.landed;
    },

    /**
     * propagate the crystal according to the specified applied forces, using euler integration
     * @param {Vector2} appliedForce
     * @param {number} dt
     * @param {kite.Line} leftBeakerWall
     * @param {kite.Line} rightBeakerWall
     * @param {kite.Line} beakerFloor
     * @param {kite.Line} topOfSolid
     */
    stepInTime: function( appliedForce, dt, leftBeakerWall, rightBeakerWall, beakerFloor, topOfSolid ) {
      if ( !this.landed ) {
        var originalPosition = this.positionProperty.get();

        this.acceleration.set( appliedForce.times( 1.0 / this.mass ) );
        this.velocityProperty.set( this.velocityProperty.get().plus( this.acceleration.get().times( dt ) ) );
        this.positionProperty.set( this.positionProperty.get().plus( this.velocityProperty.get().times( dt ) ) );

        // Intersect leftBeakerWall and RightBeakWall with Path, which is a line with originalPosition as start point and
        // current position as end Point.
        // Path that the particle took from previous time to current time, for purpose of collision detection with walls
        // for performance reasons using Util lineSegment instead of creating new Line Shapes

        var leftWallIntersection = Util.lineSegmentIntersection( originalPosition.x, originalPosition.y, this.positionProperty.get().x, this.positionProperty.get().y,
          leftBeakerWall.start.x, leftBeakerWall.start.y, leftBeakerWall.end.x, leftBeakerWall.end.y );

        var rightWallIntersection = Util.lineSegmentIntersection( originalPosition.x, originalPosition.y, this.positionProperty.get().x, this.positionProperty.get().y,
          rightBeakerWall.start.x, rightBeakerWall.start.y, rightBeakerWall.end.x, rightBeakerWall.end.y );

        // if the particle bounced off a wall, then reverse its velocity
        if ( leftWallIntersection || rightWallIntersection ) {
          this.velocityProperty.set( new Vector2( Math.abs( this.velocityProperty.get().x ), this.velocityProperty.get().y ) );

          // Rollback the previous update, and go the other way
          this.positionProperty.set( originalPosition );
          this.positionProperty.set( this.positionProperty.get().plus( this.velocityProperty.get().times( dt ) ) );
        }

        // Intersect beakerfloor and TopOfSolid with the new Path after accounting for bouncing off walls
        var beakerFloorIntersection = Util.lineSegmentIntersection( originalPosition.x, originalPosition.y, this.positionProperty.get().x, this.positionProperty.get().y,
          beakerFloor.start.x, beakerFloor.start.y, beakerFloor.end.x, beakerFloor.end.y );

        var topOfSolidIntersection = Util.lineSegmentIntersection( originalPosition.x, originalPosition.y, this.positionProperty.get().x, this.positionProperty.get().y,
          topOfSolid.start.x, topOfSolid.start.y, topOfSolid.end.x, topOfSolid.end.y );

        // See if it should land on the floor of the beaker
        if ( beakerFloorIntersection ) {
          this.positionProperty.set( new Vector2( this.positionProperty.get().x, 0 ) );
          this.landed = true;
        }
        // See if it should land on top of any precipitated solid in the beaker
        else if ( topOfSolidIntersection ) {

          // Move the crystal down a tiny bit so that it will be intercepted by the water on top of the solid
          // precipitate when water is added
          this.positionProperty.set( new Vector2( this.positionProperty.get().x, topOfSolid.getY1() - 1E-6 ) );
          this.landed = true;
        }
      }
    }

  } );

} );

// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.macro.model;
//
//import java.awt.geom.Line2D;
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction0;
//
///**
// * A single solid crystal (sugar or salt) that comes from a shaker and gets dissolved in the water.
// *
// * @author Sam Reid
// */
//public class MacroCrystal {
//    public final double mass = 1E-6;//kg
//    public final Property<Vector2D> position;
//    public final Property<Vector2D> velocity = new Property<Vector2D>( new Vector2D( 0, 0 ) );
//    public final Property<Vector2D> acceleration = new Property<Vector2D>( new Vector2D( 0, 0 ) );
//    private final ArrayList<VoidFunction0> removalListeners = new ArrayList<VoidFunction0>();
//


//

//
//    public MacroCrystal( Vector2D position, double moles, double volumePerMole ) {
//        this.position = new Property<Vector2D>( position );
//        this.moles = moles;
//
//        //Compute the length of a side
//        double volume = volumePerMole * moles;
//        length = Math.pow( volume, 1.0 / 3.0 );
//    }
//

//

//
//    //Add a listener which will be notified when this crystal is removed from the model
//    public void addRemovalListener( VoidFunction0 removalListener ) {
//        removalListeners.add( removalListener );
//    }
//
//    //Remove a removal listener
//    public void removeRemovalListener( VoidFunction0 removalListener ) {
//        removalListeners.remove( removalListener );
//    }
//
//    //Notify all removal listeners that this crystal is being removed from the model
//    public void remove() {
//        for ( VoidFunction0 removalListener : removalListeners ) {
//            removalListener.apply();
//        }
//    }
//
//    public double getMoles() {
//        return moles;
//    }
//
//    //Test to compute the length of a side of one gram of salt cube
//    public static void main( String[] args ) {
//        double liters = 1.0 / 2165;
//        double metersCubed = liters * 0.001;
//        double lengthOfASide = Math.pow( metersCubed, 1.0 / 3.0 );
//        System.out.println( "lengthOfASide = " + lengthOfASide );
//    }
//}
