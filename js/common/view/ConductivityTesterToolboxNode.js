// Copyright 2015-2018, University of Colorado Boulder

/**
 * The toolbox node that the conductivity tester gets dragged out of and back into.
 * There are 4 classes (ConductivityTesterNode,  SugarAndSaltSolutionsConductivityTesterNode, ConductivityTesterToolNode, ConductivityTesterToolboxNode)
 * needed to implement the conductivity tester feature.   To clarify the naming and conventions:
 * The ToolIcon is the icon drawn on the Toolbox, and used to create the tester node which is a
 * ToolNode (Sugar and Salt Solutions Conductivity Tester Node is a sim-specific subclass).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConductivityTesterNode = require( 'SCENERY_PHET/ConductivityTesterNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var SugarAndSaltSolutionsConductivityTesterNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SugarAndSaltSolutionsConductivityTesterNode' );
  var SugarAndSaltSolutionsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var conductivityString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/conductivity' );

  /**
   * @param {Node} submergedInWaterNode
   * @param {ConductivityTester} conductivityTester
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ConductivityTesterToolboxNode( submergedInWaterNode, conductivityTester, modelViewTransform ) {
    var self = this;
    var conductivityTesterIconNode = ConductivityTesterNode.createIcon( 0, 85, -40, 60, {
      bulbImageScale: 0.35,
      batteryImageScale: 0.4,
      negativeProbeFill: 'green',
      // common to both probes
      probeSize: new Dimension2( 16, 22 ), // {Dimension2} probe dimensions, in view coordinates
      bulbToBatteryWireLength: 15 // length of the wire between bulb and battery, in view coordinates
    } );

    var titleNode = new Text( conductivityString, { font: SugarAndSaltSolutionsConstants.TITLE_FONT } );
    var vBox = new VBox( {
      children: [ titleNode, conductivityTesterIconNode ],
      spacing: 0
    } );

    var sugarAndSaltSolutionsConductivityTesterNode = new SugarAndSaltSolutionsConductivityTesterNode( conductivityTester, modelViewTransform );
    submergedInWaterNode.addChild( sugarAndSaltSolutionsConductivityTesterNode );

    var startOffset; // where the drag started, relative to the Movable's origin, in parent view coordinates
    sugarAndSaltSolutionsConductivityTesterNode.addInputListener( new SimpleDragHandler(
      {
        // Allow moving a finger (touch) across a node to pick it up.
        allowTouchSnag: true,
        // note where the drag started
        start: function( event ) {
          var location = modelViewTransform.modelToViewPosition( conductivityTester.locationProperty.get() );
          startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( location );
        },

        // change the location, adjust for starting offset
        drag: function( event ) {
          var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
          var location = modelViewTransform.viewToModelPosition( parentPoint );
          conductivityTester.locationProperty.set( location );
        },

        end: function( event ) {
          //if the user has dragged the ConductivityTesterNode into the panel, hide the ConductivityTesterNode
          var droppableNodeBounds = sugarAndSaltSolutionsConductivityTesterNode.getDroppableComponent().getGlobalBounds();
          var panelGlobalBounds = self.getGlobalBounds();
          if ( panelGlobalBounds.intersectsBounds( droppableNodeBounds ) ) {
            conductivityTester.visibleProperty.value = false;
          }
        }
      } ) );


    conductivityTester.visibleProperty.link( function( visible ) {
      sugarAndSaltSolutionsConductivityTesterNode.visible = visible;
      conductivityTesterIconNode.visible = !visible;
    } );

    sugarAndSaltSolutionsConductivityTesterNode.visible = false;

    // Add a listener that will allow the user to click on the Icon and make
    // the sugarAndSaltSolutionsConductivityTesterNode visible
    var iconDragListener = new SimpleDragHandler( {
      start: function( event ) {
        var conductivityTesterWidth = Math.abs( conductivityTester.positiveProbeLocationProperty.value.x - conductivityTester.negativeProbeLocationProperty.value.x );
        var conductivityTesterStartingPosition = modelViewTransform.viewToModelPosition( event.pointer.point );
        //adjust the location such that the bulb appears on the clicked position
        conductivityTesterStartingPosition.x -= conductivityTesterWidth * 1.1;
        conductivityTester.setLocation( conductivityTesterStartingPosition );
        conductivityTester.visibleProperty.value = true;
        sugarAndSaltSolutionsConductivityTesterNode.moveToFront();

      }
    } );
    conductivityTesterIconNode.addInputListener( iconDragListener );

    // put everything in a panel
    Panel.call( self, vBox, {
        fill: 'white',
        yMargin: 6,
        xMargin: 6,
        lineWidth: 1,
        cursor: 'pointer',
        stroke: 'gray',
        cornerRadius: 2,
        backgroundPickable: true
      }
    );

    //initial Location, the ConductivityTesterNode uses oldLocation while doing Translation so set the initial location in alignment with Panel
    var initialLocation = modelViewTransform.viewToModelPosition( self.bounds.center );
    conductivityTester.setLocation( initialLocation );
  }

  sugarAndSaltSolutions.register( 'ConductivityTesterToolboxNode', ConductivityTesterToolboxNode );

  return inherit( Panel, ConductivityTesterToolboxNode, {} );

} );

