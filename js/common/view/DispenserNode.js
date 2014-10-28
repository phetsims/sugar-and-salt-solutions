// Copyright 2002-2012, University of Colorado
/**
 * Base class for Piccolo nodes for sugar or salt shakers.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var AffineTransform = require( 'java.awt.geom.AffineTransform' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var Rectangle = require( 'KITE/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );
  var RichSimpleObserver = require( 'edu.colorado.phet.common.phetcommon.util.RichSimpleObserver' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetFont = require( 'edu.colorado.phet.common.phetcommon.view.util.PhetFont' );
  var CursorHandler = require( 'edu.colorado.phet.common.piccolophet.event.CursorHandler' );
  var RelativeDragHandler = require( 'edu.colorado.phet.common.piccolophet.event.RelativeDragHandler' );
  var HTMLNode = require( 'edu.colorado.phet.common.piccolophet.nodes.HTMLNode' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var Dispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Dispenser' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PInputEvent = require( 'edu.umd.cs.piccolo.event.PInputEvent' );
  var PImage = require( 'edu.umd.cs.piccolo.nodes.PImage' );

  function DispenserNode( transform, model, dragConstraint ) {

    //private
    this.debug = false;
    this.imageNode;

    //private
    this.transform;

    //private
    this.model;

    //private
    this.textLabel;
    this.transform = transform;
    this.model = model;
    //Show the image of the shaker, with the text label on the side of the dispenser
    imageNode = new PImage();
    addChild( imageNode );
    //Text label that shows "Sugar" or "Salt" along the axis of the dispenser.  It is a child of the image node so it will move and rotate with the image node.
    textLabel = new Node().withAnonymousClassBody( {
      initializer: function() {
        addChild( new HTMLNode( model.name ).withAnonymousClassBody( {
          initializer: function() {
            setFont( new PhetFont( 30 ) );
            rotateInPlace( Math.PI / 2 );
          }
        } ) );
      }
    } );
    imageNode.addChild( textLabel );
    //Update the AffineTransform for the image when the model changes
    new RichSimpleObserver().withAnonymousClassBody( {
      update: function() {
        updateTransform();
      }
    } ).observe( model.center, model.angle );
    //Show a rectangle at the rotation point of the shaker
    if ( debug ) {
      addChild( new PhetPPath( new Rectangle.Number( 0, 0, 10, 10 ), Color.blue ).withAnonymousClassBody( {
        initializer: function() {
          new RichSimpleObserver().withAnonymousClassBody( {
            update: function() {
              setOffset( transform.modelToView( model.center.get() ).toPoint2D() );
            }
          } ).observe( model.center, model.angle );
        }
      } ) );
    }
    //Translate the shaker when dragged
    addInputEventListener( new RelativeDragHandler( this, transform, model.center, dragConstraint ).withAnonymousClassBody( {
      mouseDragged: function( event ) {
        //Set the model height of the dispenser so the model will be able to emit crystals in the right location (at the output part of the image)
        model.setDispenserHeight( transform.viewToModelDeltaY( imageNode.getFullBounds().getHeight() ) );
        //Handle super drag after setting the dispenser height in case crystals are emitted
        super.mouseDragged( event );
        //The thing you are dragging should always go in front.
        moveToFront();
      },
      //Override the setModelPosition to use a call to translate, since that is the call used to shake out crystals
      setModelPosition: function( constrained ) {
        var initialPoint = model.center.get();
        var finalPoint = new Vector2( constrained );
        var delta = finalPoint.minus( initialPoint );
        model.translate( delta.toDimension() );
      }
    } ) );
    //Show a hand cursor when over the dispenser
    addInputEventListener( new CursorHandler() );
  }

  return inherit( Node, DispenserNode, {
    updateTransform: function() {
      //Clear the transform to start over
      imageNode.setTransform( new AffineTransform() );
      //Find the view coordinates of the rotation point of the model (its center)
      var viewPoint = transform.modelToView( model.center.get() ).toPoint2D();
      //Rotate by the correct angle: Note: This angle doesn't get mapped into the right coordinate frame, so could be backwards
      imageNode.rotate( -model.angle.get() );
      //Center on the view point
      imageNode.centerFullBoundsOnPoint( viewPoint.x, viewPoint.y );
      //Update the location of the text label to remain centered in the image since the image could have changed size
      textLabel.setOffset( imageNode.getWidth() / 2 - textLabel.getFullBounds().getWidth() / 2, imageNode.getHeight() / 2 - textLabel.getFullBounds().getWidth() / 2 );
    }
  } );
} );

