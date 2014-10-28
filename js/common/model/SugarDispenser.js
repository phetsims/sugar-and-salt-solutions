// Copyright 2002-2012, University of Colorado
/**
 * Model element for the sugar dispenser, which includes its position and rotation.  Sugar is emitted from the sugar dispenser only
 * while the user is rotating it, and while it is at a good angle (quadrant III).
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2D = require( 'java.awt.geom.Dimension2D' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Random = require( 'java.util.Random' );
  var MathUtil = require( 'edu.colorado.phet.common.phetcommon.math.MathUtil' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var SugarDispenserNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SugarDispenserNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var createPolar = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.createPolar' );//static

  function SugarDispenser( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model ) {
    //True if the flap on the top of the dispenser is open and sugar can flow out
    this.open = new Property( false );
    //Randomness for the outgoing crystal velocity
    this.random = new Random();

    //private
    this.translating = false;

    //private
    this.positions = [];
    this.model;
    Dispenser.call( this, x, y, 1.2, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
    this.model = model;
  }

  return inherit( Dispenser, SugarDispenser, {
    translate: function( delta ) {
      super.translate( delta );
      setTranslating( true );
    },

    //private
    setTranslating: function( translating ) {
      this.translating = translating;
      open.set( translating );
    },
//Called when the model steps in time, and adds any sugar crystals to the sim if the dispenser is pouring
    updateModel: function() {
      //Add the new position to the list, but keep the list short so there is no memory leak.  The list size also determines the lag time for when the shaker rotates down and up
      positions.add( center.get() );
      while ( positions.size() > 8 ) {
        positions.remove( 0 );
      }
      //Keep track of speeds, since we use a nonzero speed to rotate the dispenser
      var speeds = [];
      for ( var i = 0; i < positions.size() - 1; i++ ) {
        var a = positions.get( i );
        var b = positions.get( i + 1 );
        speeds.add( a.minus( b ).magnitude() );
      }
      //Compute the average speed over the last positions.size() time steps
      var sum = 0.0;
      for ( var speed in speeds ) {
        sum += speed;
      }
      var avgSpeed = sum / speeds.size() * distanceScale;
      //Should be considered to be translating only if it was moving fast enough
      setTranslating( avgSpeed > 1E-5 );
      //animate toward the target angle
      var tiltedDownAngle = 2.0;
      var tiltedUpAngle = 1.2;
      var targetAngle = translating ? tiltedDownAngle : tiltedUpAngle;
      var delta = 0;
      var deltaMagnitude = 0.25;
      if ( targetAngle > angle.get() ) {
        delta = deltaMagnitude;
      }
      else if ( targetAngle < angle.get() ) {
        delta = -deltaMagnitude;
      }
      //Make sure it doesn't go past the final angles or it will stutter
      var proposedAngle = angle.get() + delta;
      if ( proposedAngle > tiltedDownAngle ) {
        proposedAngle = tiltedDownAngle;
      }
      if ( proposedAngle < tiltedUpAngle ) {
        proposedAngle = tiltedUpAngle;
      }
      angle.set( proposedAngle );
      //Check to see if we should be emitting sugar crystals-- if the sugar is enabled and its top is open and it is rotating
      if ( enabled.get() && translating && angle.get() > Math.PI / 2 && moreAllowed.get() ) {
        //Then emit a number of crystals proportionate to the amount the dispenser was rotated so that vigorous rotation emits more, but clamping it so there can't be too many
        var numCrystals = MathUtil.clamp( 1, avgSpeed * 5, 5 );
        for ( var i = 0; i < numCrystals; i++ ) {
          //Hand tuned to match up with the image, will need to be re-tuned if the image changes
          var outputPoint = center.get().plus( createPolar( dispenserHeight / 2 * 0.85, angle.get() + Math.PI / 2 * 1.23 + Math.PI ) );
          addSugarToModel( outputPoint );
        }
      }
    },
    addSugarToModel: function( position ) {},
//Create the sugar dispenser node which the user can use to add sugar to the model
    createNode: function( transform, micro, constraint ) {
      return new SugarDispenserNode( transform, this, micro, constraint );
    },
    reset: function() {
      super.reset();
      //Additionally reset the user drag events so the user has to drag it again to create sugar
      translating = false;
      positions.clear();
    }
  } );
} );

