// Copyright 2002-2011, University of Colorado
/**
 * Conductivity Tester Node specialized for Sugar and Salt Solutions.  This makes the light bulb draggable, and makes it possible to
 * drag into and out of the toolbox.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'java.awt.Image' );
  var Dimension2D = require( 'java.awt.geom.Dimension2D' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var Rectangle = require( 'KITE/Rectangle' );
  var Property = require( 'AXON/Property' );
  var UserComponents = require( 'edu.colorado.phet.common.phetcommon.simsharing.messages.UserComponents' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var PhetColorScheme = require( 'edu.colorado.phet.common.phetcommon.view.PhetColorScheme' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var CursorHandler = require( 'edu.colorado.phet.common.piccolophet.event.CursorHandler' );
  var ConductivityTesterNode = require( 'edu.colorado.phet.common.piccolophet.nodes.conductivitytester.ConductivityTesterNode' );
  var ConductivityTesterChangeListener = require( 'edu.colorado.phet.common.piccolophet.nodes.conductivitytester.IConductivityTester.ConductivityTesterChangeListener' );
  var CanvasBoundedDragHandler = require( 'edu.colorado.phet.common.piccolophet.nodes.toolbox.CanvasBoundedDragHandler' );
  var DragEvent = require( 'edu.colorado.phet.common.piccolophet.nodes.toolbox.DragEvent' );
  var ConductivityTester = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ConductivityTester' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PDimension = require( 'edu.umd.cs.piccolo.util.PDimension' );

  function SugarAndSaltSolutionsConductivityTesterNode( conductivityTester, transform, rootNode, location, whiteBackground ) {

    //private
    this.conductivityTester;

    //private
    this.transform;
    ConductivityTesterNode.call( this, UserComponents.conductivityTester, conductivityTester, transform, Color.lightGray, Color.lightGray, Color.lightGray, PhetColorScheme.RED_COLORBLIND, Color.green, Color.black, Color.black, false );
    this.conductivityTester = conductivityTester;
    this.transform = transform;
    //Set up the ConductivityTesterNode to work well against the selected background
    whiteBackground.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( whiteBackground ) {
        if ( whiteBackground ) {
          setAgainstWhiteBackground();
        }
        else {
          setAgainstDarkBackground();
        }
      }
    } ) );
    //Make it visible when the model shows the conductivity tester to be visible (i.e. enabled)
    conductivityTester.visible.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( visible ) {
        setVisible( visible );
      }
    } ) );
    //Make it possible to drag the light bulb, which translates all parts of the conductivity tester (including probes), but constrain to the canvas (same as for the ConductivityTesterToolNode)
    getLightBulbNode().addInputEventListener( new CursorHandler() );
    getLightBulbNode().addInputEventListener( new CanvasBoundedDragHandler( getLightBulbNode() ).withAnonymousClassBody( {
      dragNode: function( event ) {
        dragAll( event.delta );
      }
    } ) );
    //Drag the entire component by the battery, but constrain to the canvas (same as for the ConductivityTesterToolNode)
    getBatteryNode().addInputEventListener( new CursorHandler() );
    getBatteryNode().addInputEventListener( new CanvasBoundedDragHandler( getBatteryNode() ).withAnonymousClassBody( {
      dragNode: function( event ) {
        dragAll( event.delta );
      }
    } ) );
    // (to make sure icon looks consistent) and when dragged out of the toolbox
    var viewLocation = transform.modelToView( location );
    conductivityTester.setLocation( viewLocation.getX(), viewLocation.getY() );
    //Move the probes down to encourage the user to dip them in the water without dipping the light bulb/battery in the water too, which would short out the circuit
    var offsetY = 0.065;
    conductivityTester.setNegativeProbeLocation( location.getX() - 0.03, location.getY() - offsetY );
    conductivityTester.setPositiveProbeLocation( location.getX() + 0.07, location.getY() - offsetY );
    //In order to test for a short circuit when computing the bulb brightness
    conductivityTester.addConductivityTesterChangeListener( new ConductivityTesterChangeListener().withAnonymousClassBody( {
      brightnessChanged: function() {
      },
      positiveProbeLocationChanged: function() {
      },
      negativeProbeLocationChanged: function() {
      },
      locationChanged: function() {
        var batteryBounds = getBatteryNode().getGlobalFullBounds();
        batteryBounds = rootNode.globalToLocal( batteryBounds );
        conductivityTester.setBatteryRegion( transform.viewToModel( batteryBounds ) );
        var bulbBounds = getLightBulbNode().getGlobalFullBounds();
        bulbBounds = rootNode.globalToLocal( bulbBounds );
        conductivityTester.setBulbRegion( transform.viewToModel( bulbBounds ) );
      }
    } ) );
  }

  return inherit( ConductivityTesterNode, SugarAndSaltSolutionsConductivityTesterNode, {
//Used to create a thumbnail icon for use in the toolbox.
    createImage: function() {
      //Generate a thumbnail of the conductivity tester node.  This is done by making it visible, calling toImage() and then making it invisible
      var visible = conductivityTester.visible.get();
      conductivityTester.visible.set( true );
      var image = toImage();
      //Restore default value
      conductivityTester.visible.set( visible );
      return image;
    },
    dragAll: function( viewDelta ) {
      //Drag the conductivity tester in view coordinates
      conductivityTester.setLocation( conductivityTester.getLocationReference().getX() + viewDelta.getWidth(), conductivityTester.getLocationReference().getY() + viewDelta.getHeight() );
      //The probes drag in model coordinates
      var modelDelta = transform.viewToModelDelta( viewDelta );
      conductivityTester.setNegativeProbeLocation( conductivityTester.getNegativeProbeLocationReference().getX() + modelDelta.getWidth(), conductivityTester.getNegativeProbeLocationReference().getY() + modelDelta.getHeight() );
      conductivityTester.setPositiveProbeLocation( conductivityTester.getPositiveProbeLocationReference().getX() + modelDelta.getWidth(), conductivityTester.getPositiveProbeLocationReference().getY() + modelDelta.getHeight() );
      //The thing you are dragging should always go in front.  Have to move the parent in front since it is the child in the canvas.submergedInWaterNode
      getParent().moveToFront();
    },
//Only the bulb can be dropped back in the toolbox since it is the only part that translates the unit
    getDroppableComponents: function() {
      return new Node[]
      { getLightBulbNode(), getBatteryNode() }
      ;
    }
  } );
} );

