// Copyright 2002-2012, University of Colorado
/**
 * The node for sugar crystals that will be shown in the bucket that the user can grab.
 * This class uses a list of compounds such as sucrose molecules or salt ions so that it works uniformly for crystals or lone compounds.
 * It translates all particles together so they retain their crystal structure (if any)
 * <p/>
 * This class is built on:
 * Sucrose made of many SphericalParticles
 * or
 * SaltIon made of one SphericalParticle
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2D = require( 'java.awt.geom.Dimension2D' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var Rectangle = require( 'KITE/Rectangle' );
  var PropertyChangeEvent = require( 'java.beans.PropertyChangeEvent' );
  var PropertyChangeListener = require( 'java.beans.PropertyChangeListener' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var Option = require( 'edu.colorado.phet.common.phetcommon.util.Option' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var CursorHandler = require( 'edu.colorado.phet.common.piccolophet.event.CursorHandler' );
  var BucketView = require( 'edu.colorado.phet.common.piccolophet.nodes.BucketView' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Compound' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var WaterModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterModel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PBasicInputEventHandler = require( 'edu.umd.cs.piccolo.event.PBasicInputEventHandler' );
  var PInputEvent = require( 'edu.umd.cs.piccolo.event.PInputEvent' );
  var PInputEventListener = require( 'edu.umd.cs.piccolo.event.PInputEventListener' );
  var PDimension = require( 'edu.umd.cs.piccolo.util.PDimension' );
  var asList = require( 'java.util.Arrays.asList' );//static

  function CompoundListNode( transform, model, bucketView, sugarBucketParticleLayer, canvas, //Methods for adding or removing the molecule to/from the model, called when the user drops or grabs the PNode
                             addToModel, removeFromModel, //Flag to indicate whether color is shown for charge or identity of the atom.  This is also used for the "show sugar atoms" feature
                             showChargeColor, //Optional label to show for each compound
                             label, //Likewise, fully formed NaCl crystals can be dragged from the bucket to the bucket, since that wouldn't leave any lone ions.
                             canReturnToBucket, //Flag to indicate whether partial charge symbols should be shown.  In this sim, they are optional for sucrose
                             showPartialCharges, //Whether the sim is running so that interaction can be disabled when the sim is paused
                             clockRunning, compounds ) {
    //Wrapped node that contains all the atoms
    this.atomLayer;
    //Transform from model (meters) to view (stage) coordinates

    //private
    this.transform;
    //The bucket, so the node can be moved back to the bucket hole

    //private
    this.bucketView;
    //The canvas this node will be displayed on, for purposes of converting global coordinates to stage for centering on the bucket

    //private
    this.canvas;
    //The list of compounds such as sucrose molecules or salt ions

    //private
    this.compounds;
    //Flag to keep track of whether the node was dragged from the bucket; if so, model elements will be created when dropped into the particle window
    this.inBucket = new Property( true );
    this.transform = transform;
    this.bucketView = bucketView;
    this.canvas = canvas;
    this.compounds = compounds;
    atomLayer = new Node();
    //2. grows larger
    var startedDragging = new Property( false );
    //Transform the particles from the crystal's molecule's particles into nodes
    for ( var compound in compounds ) {
      var compoundNode = new Node();
      for ( var atom in compound ) {
        compoundNode.addChild( new SphericalParticleNodeWithText( transform, atom, showChargeColor, showPartialCharges ) );
      }
      //If a label was specified, create and add it centered on the compound
      if ( label.isSome() ) {
        var labelNode = label.get().apply( compound );
        compoundNode.addChild( labelNode );
        var listener = new PropertyChangeListener().withAnonymousClassBody( {
          propertyChange: function( evt ) {
            //Remove the label before determining the bounds on which it should be centered, so it isn't accounted for in the bounds
            compoundNode.removeChild( labelNode );
            //Determine where to center the label
            var compoundCenter = compoundNode.getFullBounds().getCenter2D();
            //Add back the label
            compoundNode.addChild( labelNode );
            //Center it on the compound
            labelNode.centerFullBoundsOnPoint( compoundCenter.getX(), compoundCenter.getY() );
          }
        } );
        compoundNode.addPropertyChangeListener( PROPERTY_FULL_BOUNDS, listener );
        //Get the initial location correct
        listener.propertyChange( null );
      }
      atomLayer.addChild( compoundNode );
    }
    var listener1 = new CursorHandler();
    var listener2 = new PBasicInputEventHandler().withAnonymousClassBody( {
      mouseDragged: function( event ) {
        //When dragging, remove from the model (if it was in the model) so box2d won't continue to propagate it
        for ( var sucrose in compounds ) {
          removeFromModel.apply( sucrose );
        }
        //When the user drags the node initially, grow it to full size and move it to the top layer
        if ( !startedDragging.get() ) {
          startedDragging.set( true );
          setIcon( false );
          sugarBucketParticleLayer.removeChild( CompoundListNode.this );
          canvas.addChild( CompoundListNode.this );
          //Re-center the node since it will have a different location at its full scale
          if ( inBucket.get() ) {
            moveToBucket();
            inBucket.set( false );
          }
        }
        //Translate the node during the drag
        var modelDelta = transform.viewToModelDelta( event.getDeltaRelativeTo( getParent() ) );
        for ( var compound in compounds ) {
          compound.translate( modelDelta.getWidth(), modelDelta.getHeight() );
        }
      },
      //If contained within the particle window, drop it there and create it in the model, otherwise return to the sugar bucket
      mouseReleased: function( event ) {
        var modelBounds = transform.viewToModel( atomLayer.getFullBounds() ).getBounds2D();
        if ( model.particleWindow.contains( modelBounds ) ) {
          moveToModel( addToModel );
        }
        else {
          //Shrink the node and send it back to the bucket
          if ( canReturnToBucket ) {
            setIcon( true );
            moveToBucket();
            inBucket.set( true );
            canvas.removeChild( CompoundListNode.this );
            sugarBucketParticleLayer.addChild( CompoundListNode.this );
            //Initialize for dragging out of the bucket on next mouse press
            startedDragging.set( false );
          }
          else //For salt ions, send back to the play area
          {
            for ( var compound in compounds ) {
              compound.setPosition( model.particleWindow.getCenter() );
            }
            moveToModel( addToModel );
          }
        }
      }
    } );
    //Not allowed to drag when the sim is paused
    clockRunning.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( clockRunning ) {
        if ( clockRunning && !containsListener( listener1 ) ) {
          addInputEventListener( listener1 );
          addInputEventListener( listener2 );
        }
        else if ( !clockRunning && containsListener( listener1 ) ) {
          removeInputEventListener( listener1 );
          removeInputEventListener( listener2 );
        }
      }
    } ) );
    addChild( atomLayer );
    //By default, this node is used for the bucket, so it should start in small icon mode
    setIcon( true );
  }

  return inherit( Node, CompoundListNode, {
//Determine if this node contains the specified listener for purposes of toggling interaction when sim is paused

    //private
    containsListener: function( listener ) {
      return asList( getInputEventListeners() ).contains( listener );
    },

    //private
    moveToModel: function( addToModel ) {
      //Add each sucrose molecule to the model
      for ( var sucrose in compounds ) {
        addToModel.apply( sucrose );
      }
      //Remove the node the user was dragging
      canvas.removeChild( this );
    },
//Sets whether this node should be shown as a small icon (for use in the bucket) or shown as a large crystal while the user is dragging or while in the model/play area
    setIcon: function( icon ) {
      //Shrink it to be a small icon version so it will fit in the bucket
      atomLayer.setScale( icon ? 0.45 : 1 );
    },
//Center the node in the bucket, must be called after scaling and attaching to the parent.
    moveToBucket: function() {
      //Find out how far to translate the compounds to center on the top middle of the bucket hole
      var crystalCenter = atomLayer.getGlobalFullBounds().getCenter2D();
      var topCenterOfBucketHole = new Vector2( bucketView.getHoleNode().getGlobalFullBounds().getCenterX(), bucketView.getHoleNode().getGlobalFullBounds().getMinY() );
      var globalDelta = new Vector2( crystalCenter, topCenterOfBucketHole );
      //Convert to canvas coordinate frame (stage) to account for different frame sizes
      var canvasDelta = canvas.getRootNode().globalToLocal( new PDimension( globalDelta.getX(), globalDelta.getY() ) );
      //Convert to model and update the compound model positions
      var modelDelta = transform.viewToModelDelta( new Vector2( canvasDelta.getWidth(), canvasDelta.getHeight() ).times( 1.0 / atomLayer.getScale() ) );
      for ( var compound in compounds ) {
        compound.translate( modelDelta );
      }
    },
    setInBucket: function( inBucket ) {
      this.inBucket.set( inBucket );
    }
  } );
} );

