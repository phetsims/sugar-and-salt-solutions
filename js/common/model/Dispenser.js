// Copyright 2014-2015, University of Colorado Boulder
/**
 * Base class for sugar and salt dispensers.  To clarify the terminology in the subclasses,
 * salt is created by "shakers" (a refinement of this dispenser class) and sugar is created by "dispensers"
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} angle
   * @param {Beaker} beaker
   * @param {Property<Boolean>} moreAllowed
   * @param {string} name
   * @param {number} distanceScale
   * @param {Property<DispenserType>} selectedType
   * @param {DispenserType} type
   * @param {SugarAndSaltSolutionModel} model
   * @constructor
   */
  function Dispenser( x, y, angle, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    var thisDispenser = this;

    //True if the user has selected this dispenser type
    thisDispenser.enabled = new Property( false );

    //Beaker into which the solute will be dispensed
    //@protected
    thisDispenser.beaker = beaker;

    //True if the user is allowed to add more solute, false if the limit has been reached (10 moles per solute).
    thisDispenser.moreAllowed = moreAllowed;

    //The name of the dispenser contents, to be displayed on the side of the dispenser node
    thisDispenser.name = name;

    //A reference to the model for adding particles to it
    thisDispenser.model = model;

    //Model the angle of rotation, 0 degrees is straight up (not tilted)
    thisDispenser.angle = new Property( angle );

    //Start centered above the fluid
    thisDispenser.center = new Property( new Vector2( x, y ) );

    //The amount to scale model translations so that micro tab emits solute at the appropriate time.  Without this factor,
    //the tiny (1E-9 meters) drag motion in the Micro tab wouldn't be enough to emit solute
    thisDispenser.distanceScale = distanceScale;

    //The height of the dispenser in meters, for purposes of making sure the crystals come out at the right location
    //relative to the image. This is used since we want to keep the view the same in each module, but to have different
    //actual model dimensions
    //@protected
    thisDispenser.dispenserHeight = 0;

    //Wire up the Dispenser so it is enabled when the model has the right type dispenser selected
    selectedType.link( function( dispenserType ) {
      thisDispenser.enabled.set( dispenserType === type );
    } );

  }

  return inherit( Object, Dispenser, {
    /**
     * @abstract
     */
    translate: function() {
      throw new Error( 'translate should be implemented in descendant classes of Dispenser' );
    },
    /**
     * @protected Give the crystal an appropriate velocity when it comes out so it arcs.  This method is used by
     * subclasses when creating crystals
     * @param {Vector2} outputPoint
     * @returns {Vector2}
     */
    getCrystalVelocity: function( outputPoint ) {
      var directionVector = outputPoint.minus( this.center.get() );
      var anglePastTheHorizontal = this.angle.get() - Math.PI / 2;
      var magnitudeRatio = (0.2 + 0.3 * Math.sin( anglePastTheHorizontal )) / directionVector.magnitude();
      return directionVector.times( magnitudeRatio );
    },
    /**
     * After time has passed, update the model by adding any crystals that should be emitted
     */
    updateModel: function() {
      throw new Error( 'updateModel should be implemented in descendant classes of Dispenser' );
    },
    /**
     * Method for creating a PNode such as a SugarDispenserNode or SaltShakerNode to display this Dispenser and allow
     * the user to interact with it
     * @param {ModelViewTransform2} transform
     * @param {boolean} micro
     * @param {function} constraint
     */
    createNode: function( transform, micro, constraint ) {
      throw new Error( 'createNode should be implemented in descendant classes of Dispenser' );
    },

    //Set the height of the dispenser, used to emit crystals in the right location relative to the image
    setDispenserHeight: function( dispenserHeight ) {
      this.dispenserHeight = dispenserHeight;
    }

  } );

} )
;

//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.awt.geom.Dimension2D;
//import java.awt.geom.Point2D;
//
//import edu.colorado.phet.common.phetcommon.math.MathUtil;
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.umd.cs.piccolo.PNode;
//
///**
// * Base class for sugar and salt dispensers.  To clarify the terminology in the subclasses, salt is created by "shakers" (a refinement of this dispenser class) and sugar is created by "dispensers"
// *
// * @author Sam Reid
// */
//public abstract class Dispenser<T extends SugarAndSaltSolutionModel> {
//
//

//

//
//    //Reset the dispenser's position and orientation
//    public void reset() {
//
//        //Only need to set the primary properties, others (e.g., open/enabled) are derived and will auto-reset
//        center.reset();
//        angle.reset();
//    }
//

//
//    //After time has passed, update the model by adding any crystals that should be emitted
//    public abstract void updateModel();

//}
