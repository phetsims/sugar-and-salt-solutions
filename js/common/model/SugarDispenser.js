//  Copyright 2002-2014, University of Colorado Boulder
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
  var inherit = require( 'PHET_CORE/inherit' );
  var Dispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Dispenser' );
  var SugarDispenserNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SugarDispenserNode' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<Boolean>} moreAllowed
   * @param {string} sugarDispenserName
   * @param {number} distanceScale
   * @param {Property<DispenserType>} selectedType
   * @param {DispenserType} type
   * @param {*} model
   * @constructor
   */
  function SugarDispenser( x, y, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model ) {
    var thisShaker = this;
    Dispenser.call( thisShaker, x, y, Math.PI * 3 / 4, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
    thisShaker.model = model;

    //True if the flap on the top of the dispenser is open and sugar can flow out
    thisShaker.open = new Property( false );
  }

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

    }
  } );

} );


//// Copyright 2002-2012, University of Colorado
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
//public abstract class SugarDispenser<T extends SugarAndSaltSolutionModel> extends Dispenser<T> {
//
//    //True if the flap on the top of the dispenser is open and sugar can flow out
//    public final Property<Boolean> open = new Property<Boolean>( false );
//
//    //Randomness for the outgoing crystal velocity
//    public final Random random = new Random();
//
//    private boolean translating = false;
//    private final ArrayList<Vector2D> positions = new ArrayList<Vector2D>();
//    public final T model;
//
//    public SugarDispenser( double x, double y, Beaker beaker, ObservableProperty<Boolean> moreAllowed, final String sugarDispenserName, double distanceScale, ObservableProperty<DispenserType> selectedType, DispenserType type, T model ) {
//        super( x, y, 1.2, beaker, moreAllowed, sugarDispenserName, distanceScale, selectedType, type, model );
//        this.model = model;
//    }
//
//    @Override public void translate( Dimension2D delta ) {
//        super.translate( delta );
//        setTranslating( true );
//    }
//
//    private void setTranslating( boolean translating ) {
//        this.translating = translating;
//        open.set( translating );
//    }
//
//    //Called when the model steps in time, and adds any sugar crystals to the sim if the dispenser is pouring
//    public void updateModel() {
//
//        //Add the new position to the list, but keep the list short so there is no memory leak.  The list size also determines the lag time for when the shaker rotates down and up
//        positions.add( center.get() );
//        while ( positions.size() > 8 ) {
//            positions.remove( 0 );
//        }
//
//        //Keep track of speeds, since we use a nonzero speed to rotate the dispenser
//        ArrayList<Double> speeds = new ArrayList<Double>();
//        for ( int i = 0; i < positions.size() - 1; i++ ) {
//            Vector2D a = positions.get( i );
//            Vector2D b = positions.get( i + 1 );
//            speeds.add( a.minus( b ).magnitude() );
//        }
//
//        //Compute the average speed over the last positions.size() time steps
//        double sum = 0.0;
//        for ( Double speed : speeds ) {
//            sum += speed;
//        }
//        double avgSpeed = sum / speeds.size() * distanceScale;
//
//        //Should be considered to be translating only if it was moving fast enough
//        setTranslating( avgSpeed > 1E-5 );
//
//        //animate toward the target angle
//        double tiltedDownAngle = 2.0;
//        double tiltedUpAngle = 1.2;
//        double targetAngle = translating ? tiltedDownAngle : tiltedUpAngle;
//        double delta = 0;
//        double deltaMagnitude = 0.25;
//        if ( targetAngle > angle.get() ) {
//            delta = deltaMagnitude;
//        }
//        else if ( targetAngle < angle.get() ) {
//            delta = -deltaMagnitude;
//        }
//
//        //Make sure it doesn't go past the final angles or it will stutter
//        double proposedAngle = angle.get() + delta;
//        if ( proposedAngle > tiltedDownAngle ) { proposedAngle = tiltedDownAngle; }
//        if ( proposedAngle < tiltedUpAngle ) { proposedAngle = tiltedUpAngle; }
//        angle.set( proposedAngle );
//
//        //Check to see if we should be emitting sugar crystals-- if the sugar is enabled and its top is open and it is rotating
//        if ( enabled.get() && translating && angle.get() > Math.PI / 2 && moreAllowed.get() ) {
//
//            //Then emit a number of crystals proportionate to the amount the dispenser was rotated so that vigorous rotation emits more, but clamping it so there can't be too many
//            int numCrystals = MathUtil.clamp( 1, (int) avgSpeed * 5, 5 );
//            for ( int i = 0; i < numCrystals; i++ ) {
//                //Determine where the sugar should come out
//                final Vector2D outputPoint = center.get().plus( createPolar( dispenserHeight / 2 * 0.85, angle.get() + Math.PI / 2 * 1.23 + Math.PI ) );//Hand tuned to match up with the image, will need to be re-tuned if the image changes
//
//                addSugarToModel( outputPoint );
//            }
//        }
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
