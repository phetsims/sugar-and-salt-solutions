
//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Base class for  for sugar or salt shakers.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );

  // constants
  var DEBUG = false;

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Dispenser} model
   * @param {Bounds2} constraint
   * @constructor
   */
  function DispenserNode( modelViewTransform, model, constraint ) {
    var thisNode = this;
    Node.call( thisNode, { cursor: 'pointer'} );

    //@private
    thisNode.modelViewTransform = modelViewTransform;
    //@private
    thisNode.model = model;

    //Show the image of the shaker, with the text label on the side of the dispenser
    //@protected
    thisNode.imageNode = new Node();// The actual Image node will be set as a child by the overriding classes of Dispenser Node
    thisNode.addChild( thisNode.imageNode );

    //Show a rectangle at the rotation point of the shaker
    if ( DEBUG ) {
      var debugRectNode = new Path( new Shape.rectangle( 0, 0, 10, 10 ), {
          fill: Color.BLUE}
      );
      thisNode.addChild( debugRectNode );
      Property.multilink( [ model.center, model.angle ], function() {
        var viewCenterPos = modelViewTransform.modelToViewPosition( model.center.get() );
        debugRectNode.x = viewCenterPos.x;
        debugRectNode.y = viewCenterPos.y;
      } );
    }

    //Text label that shows "Sugar" or "Salt" along the axis of the dispenser.  It is a child of the image node so it
    //will move and rotate with the image node.
    //The Text Label will be added after the actual Image node which are dynamically set based on moreAllowed property
    // see SugarDispenserNode / SaltShaker Node
    thisNode.textLabel = new Text( model.name, {
      font: new PhetFont( { size: 30} ),
      fill: 'black',
      rotation: Math.PI / 2
    } );

    //Update the AffineTransform for the image when the model changes
    Property.lazyMultilink( [ model.center, model.angle ], function() {
      thisNode.updateTransform();
    } );

    thisNode.addInputListener( new MovableDragHandler( thisNode.model.center, {
      dragBounds: constraint,
      modelViewTransform: thisNode.modelViewTransform
    } ) );

    thisNode.model.center.link( function() {
      //Set the model height of the dispenser so the model will be able to emit
      //crystals in the right location (at the output part of the image)
      thisNode.model.setDispenserHeight( thisNode.modelViewTransform.viewToModelDeltaY( thisNode.imageNode.bounds.getHeight() ) );
      thisNode.model.translate();

    } );


  }

  return inherit( Node, DispenserNode, {

    //@protected
    updateTransform: function() {

      //Clear the transform to start over
      this.imageNode.resetTransform();

      //Update the location of the text label to remain centered in the image since the image could have changed size
      this.textLabel.x = this.imageNode.bounds.getWidth() / 2 - this.textLabel.bounds.getWidth() / 2;
      this.textLabel.y = this.imageNode.bounds.getHeight() / 2 - this.textLabel.bounds.getWidth() / 2;

      //Find the view coordinates of the rotation point of the model (its center)
      var viewPoint = this.modelViewTransform.modelToViewPosition( this.model.center.get() );

      //Rotate by the correct angle: Note: This angle doesn't get mapped into the right coordinate frame, so could be backwards
      this.imageNode.rotate( -this.model.angle.get() );

      //Center on the view point
      this.imageNode.setCenter( viewPoint );

    }

  } );


} );

//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.view;
//
//import java.awt.Color;
//import java.awt.geom.AffineTransform;
//import java.awt.geom.Point2D;
//import java.awt.geom.Rectangle2D;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.util.RichSimpleObserver;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.common.phetcommon.view.util.PhetFont;
//import edu.colorado.phet.common.piccolophet.event.CursorHandler;
//import edu.colorado.phet.common.piccolophet.event.RelativeDragHandler;
//import edu.colorado.phet.common.piccolophet.nodes.HTMLNode;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Dispenser;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SugarAndSaltSolutionModel;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.event.PInputEvent;
//import edu.umd.cs.piccolo.nodes.PImage;
//
///**
// * Base class for Piccolo nodes for sugar or salt shakers.
// *
// * @author Sam Reid
// */
//public class DispenserNode<U extends SugarAndSaltSolutionModel, T extends Dispenser<U>> extends PNode {
//    private final boolean debug = false;
//    protected final PImage imageNode;
//    private final ModelViewTransform transform;
//    private final T model;
//    private final PNode textLabel;
//
//    public DispenserNode( final ModelViewTransform transform, final T model, Function1<Point2D, Point2D> dragConstraint ) {


//

//
//        //Translate the shaker when dragged
//        addInputEventListener( new RelativeDragHandler( this, transform, model.center, dragConstraint ) {
//            @Override public void mouseDragged( PInputEvent event ) {
//
//                //Set the model height of the dispenser so the model will be able to emit crystals in the right location (at the output part of the image)
//                model.setDispenserHeight( transform.viewToModelDeltaY( imageNode.getFullBounds().getHeight() ) );
//
//                //Handle super drag after setting the dispenser height in case crystals are emitted
//                super.mouseDragged( event );
//
//                //The thing you are dragging should always go in front.
//                moveToFront();
//            }
//
//            //Override the setModelPosition to use a call to translate, since that is the call used to shake out crystals
//            @Override protected void setModelPosition( Point2D constrained ) {
//                Vector2D initialPoint = model.center.get();
//                Vector2D finalPoint = new Vector2D( constrained );
//                Vector2D delta = finalPoint.minus( initialPoint );
//                model.translate( delta.toDimension() );
//            }
//        } );
//
//        //Show a hand cursor when over the dispenser
//        addInputEventListener( new CursorHandler() );
//    }
//

//}
