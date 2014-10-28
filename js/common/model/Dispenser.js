// Copyright 2002-2012, University of Colorado
/**
 * Base class for sugar and salt dispensers.  To clarify the terminology in the subclasses, salt is created by "shakers" (a refinement of this dispenser class) and sugar is created by "dispensers"
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2D = require( 'java.awt.geom.Dimension2D' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var MathUtil = require( 'edu.colorado.phet.common.phetcommon.math.MathUtil' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var DoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var Node = require( 'SCENERY/nodes/Node' );

  function Dispenser( x, y, angle, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    //Start centered above the fluid
    this.center;
    //Model the angle of rotation, 0 degrees is straight up (not tilted)
    this.angle;
    //True if the user has selected this dispenser type
    this.enabled = new Property( false );
    //Beaker into which the solute will be dispensed
    this.beaker;
    //True if the user is allowed to add more solute, false if the limit has been reached (10 moles per solute).
    this.moreAllowed;
    //The name of the dispenser contents, to be displayed on the side of the dispenser node
    this.name;
    //The amount to scale model translations so that micro tab emits solute at the appropriate time.  Without this factor, the tiny (1E-9 meters) drag motion in the Micro tab wouldn't be enough to emit solute
    this.distanceScale;
    //The height of the dispenser in meters, for purposes of making sure the crystals come out at the right location relative to the image
    //This is used since we want to keep the view the same in each module, but to have different actual model dimensions
    this.dispenserHeight;
    //A reference to the model for adding particles to it
    this.model;
    this.beaker = beaker;
    this.moreAllowed = moreAllowed;
    this.name = name;
    this.model = model;
    this.angle = new DoubleProperty( angle );
    center = new Property( new Vector2( x, y ) );
    this.distanceScale = distanceScale;
    //Wire up the Dispenser so it is enabled when the model has the right type dispenser selected
    selectedType.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( dispenserType ) {
        enabled.set( dispenserType == type );
      }
    } ) );
  }

  return inherit( Object, Dispenser, {
//Translate the dispenser by the specified delta in model coordinates
    translate: function( delta ) {
      //Translate the center, but make sure it doesn't go out of bounds
      var proposedPoint = center.get().plus( delta );
      var y = MathUtil.clamp( beaker.getTopY(), proposedPoint.getY(), Number.POSITIVE_INFINITY );
      center.set( new Vector2( proposedPoint.getX(), y ) );
    },
//Reset the dispenser's position and orientation
    reset: function() {
      //Only need to set the primary properties, others (e.g., open/enabled) are derived and will auto-reset
      center.reset();
      angle.reset();
    },
//Give the crystal an appropriate velocity when it comes out so it arcs.  This method is used by subclasses when creating crystals
    getCrystalVelocity: function( outputPoint ) {
      var directionVector = outputPoint.minus( center.get() );
      var anglePastTheHorizontal = angle.get() - Math.PI / 2;
      return directionVector.getInstanceOfMagnitude( 0.2 + 0.3 * Math.sin( anglePastTheHorizontal ) );
    },
//After time has passed, update the model by adding any crystals that should be emitted
    updateModel: function() {},
//Method for creating a PNode such as a SugarDispenserNode or SaltShakerNode to display this Dispenser and allow the user to interact with it
    createNode: function( transform, micro, constraint ) {},
//Set the height of the dispenser, used to emit crystals in the right location relative to the image
    setDispenserHeight: function( dispenserHeight ) {
      this.dispenserHeight = dispenserHeight;
    }
  } );
} );

