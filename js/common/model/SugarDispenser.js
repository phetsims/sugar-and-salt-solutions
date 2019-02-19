// Copyright 2014-2018, University of Colorado Boulder
/**
 * Model element for the sugar dispenser, which includes its position and rotation.  Sugar is emitted from the
 * sugar dispenser only while the user is rotating it, and while it is at a good angle (quadrant III).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Dispenser' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var SugarDispenserNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SugarDispenserNode' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property.<boolean>} moreAllowed
   * @param {string} sugarDispenserName
   * @param {number} distanceScale
   * @param {Property.<DispenserType>} selectedType
   * @param {DispenserType} type
   * @param {SugarAndSaltSolutionsModel} model
   * @constructor
   */
  function SugarDispenser( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model ) {
    var self = this;
    Dispenser.call( self, x, y, Math.PI * 3 / 4, beaker, moreAllowed, sugarDispenserName, distanceScale,
      selectedType, type, model );
    self.model = model;
    //True if the flap on the top of the dispenser is open and sugar can flow out
    self.openProperty = new Property( false );
    //@private
    self.translating = false;
    //@private
    this.positions = []; // Vec2 instances

  }

  sugarAndSaltSolutions.register( 'SugarDispenser', SugarDispenser );

  return inherit( Dispenser, SugarDispenser, {

    /**
     * @Override
     * Create the sugar dispenser node which the user can use to add sugar to the model
     * @param {ModelViewTransform2} transform
     * @param {boolean} micro
     * @param {function} constraint
     * @returns {Node}
     */
    createNode: function( transform, micro, constraint ) {
      return new SugarDispenserNode( transform, this, micro, constraint );
    },

    /**
     * @abstract
     * @override
     * @param {Vector2} position
     */
    addSugarToModel: function( position ) {
      throw new Error( 'addSugarToModel should be implemented in descendant classes of SugarDispenser .' );
    },
    /**
     * @override
     */
    translate: function() {
      this.setTranslating( true );
    },

    /**
     * @private
     * @param {boolean} translating
     */
    setTranslating: function( translating ) {
      this.translating = translating;
      this.openProperty.set( translating );
    },

    /**
     * @override
     * Called when the model steps in time, and adds any sugar crystals to the sim if the dispenser is pouring
     */
    updateModel: function() {

      //Add the new position to the list, but keep the list short so there is no memory leak.  The list size also
      //determines the lag time for when the shaker rotates down and up
      this.positions.push( this.centerProperty.get() );
      while ( this.positions.length > 8 ) {
        this.positions.shift( 0 );
      }

      //Keep track of speeds, since we use a nonzero speed to rotate the dispenser
      var speeds = [];
      for ( var i = 0; i < this.positions.length - 1; i++ ) {
        var a = this.positions[ i ];
        var b = this.positions[ i + 1 ];
        speeds.push( a.minus( b ).magnitude );
      }

      //Compute the average speed over the last positions.size() time steps
      var sum = 0.0;
      _.each( speeds, function( speed ) {
        sum += speed;
      } );

      var avgSpeed = sum / speeds.length * this.distanceScale;

      //Should be considered to be translating only if it was moving fast enough
      this.setTranslating( avgSpeed > 1E-5 );

      //animate toward the target angle
      var tiltedDownAngle = 2.0;
      var tiltedUpAngle = 1.2;
      var targetAngle = this.translating ? tiltedDownAngle : tiltedUpAngle;
      var delta = 0;
      var deltaMagnitude = 0.25;
      if ( targetAngle > this.angleProperty.get() ) {
        delta = deltaMagnitude;
      }
      else if ( targetAngle < this.angleProperty.get() ) {
        delta = -deltaMagnitude;
      }

      //Make sure it doesn't go past the final angles or it will stutter
      var proposedAngle = this.angleProperty.get() + delta;
      if ( proposedAngle > tiltedDownAngle ) { proposedAngle = tiltedDownAngle; }
      if ( proposedAngle < tiltedUpAngle ) { proposedAngle = tiltedUpAngle; }
      this.angleProperty.set( proposedAngle );

      //Check to see if we should be emitting sugar crystals-- if the sugar is enabled and its top is open and it is rotating
      if ( this.enabledProperty.get() && this.translating && this.angleProperty.get() > Math.PI / 2 && this.moreAllowed.get() ) {

        //Then emit a number of crystals proportionate to the amount the dispenser was rotated so that vigorous rotation
        //emits more, but clamping it so there can't be too many
        var numCrystals = Util.clamp( avgSpeed * 5, 1, 5 );
        for ( i = 0; i < numCrystals; i++ ) {
          //Determine where the sugar should come out
          var outputPoint = this.centerProperty.get().plus( Vector2.createPolar( this.dispenserHeight / 2 * 0.85,
            this.angleProperty.get() + Math.PI / 2 * 1.23 + Math.PI ) );//Hand tuned to match up with the image, will
          // need to be re-tuned if the image changes

          this.addSugarToModel( outputPoint );
        }
      }
    },

    /**
     * @Override
     * Resets this SugarDispenser.
     */
    reset: function() {
      this.resetCommonElements();
      this.translating = false;
      this.positions = [];
    }

  } );

} );


// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.awt.geom.Dimension2D;
//import java.awt.geom.Point2D;
//import java.util.ArrayList;
//import java.util.Random;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.sugarandsaltsolutions.common.view.SugarDispenserNode;
//import edu.umd.cs.piccolo.PNode;
//
//import static edu.colorado.phet.common.phetcommon.math.vector.Vector2D.createPolar;
//
///**
// * Model element for the sugar dispenser, which includes its position and rotation.  Sugar is emitted from the sugar dispenser only
// * while the user is rotating it, and while it is at a good angle (quadrant III).
// *
// * @author Sam Reid
// */
//public abstract class SugarDispenser<T extends SugarAndSaltSolutionsModel> extends Dispenser<T> {
//

//    public final T model;
//
//    public SugarDispenser( double x, double y, Beaker beaker, ObservableProperty<Boolean> moreAllowed, final String sugarDispenserName, double distanceScale, ObservableProperty<DispenserType> selectedType, DispenserType type, T model ) {
//        super( x, y, 1.2, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
//        this.model = model;
//    }
//


//
//    @Override public void reset() {
//        super.reset();
//        //Additionally reset the user drag events so the user has to drag it again to create sugar
//        translating = false;
//        positions.clear();
//    }
//}
