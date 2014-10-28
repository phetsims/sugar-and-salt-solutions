// Copyright 2002-2011, University of Colorado
/**
 * The toolbox node that the conductivity tester gets dragged out of and back into.
 * There are 4 classes (ConductivityTesterNode,  SugarAndSaltSolutionsConductivityTesterNode, ConductivityTesterToolNode, ConductivityTesterToolboxNode)
 * needed to implement the conductivity tester feature.   To clarify the naming and conventions:
 * The ToolIcon is the icon drawn on the Toolbox, and used to create the tester node which is a ToolNode (Sugar and Salt Solutions Conductivity Tester Node is a sim-specific subclass).
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'java.awt.Image' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var Rectangle = require( 'KITE/Rectangle' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var ToolNode = require( 'edu.colorado.phet.common.piccolophet.nodes.ToolNode' );
  var VBox = require( 'edu.colorado.phet.common.piccolophet.nodes.layout.VBox' );
  var NodeFactory = require( 'edu.colorado.phet.common.piccolophet.nodes.toolbox.NodeFactory' );
  var ToolIconNode = require( 'edu.colorado.phet.common.piccolophet.nodes.toolbox.ToolIconNode' );
  var SugarAndSaltSolutionsResources = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources' );
  var BeakerAndShakerCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas' );
  var ShortCircuitTextNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/ShortCircuitTextNode' );
  var WhiteControlPanelNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/WhiteControlPanelNode' );
  var MacroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroModel' );
  var PText = require( 'edu.umd.cs.piccolo.nodes.PText' );
  var multiScaleToWidth = require( 'edu.colorado.phet.common.phetcommon.view.util.BufferedImageUtils.multiScaleToWidth' );//static
  var toBufferedImage = require( 'edu.colorado.phet.common.phetcommon.view.util.BufferedImageUtils.toBufferedImage' );//static
  var TITLE_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/TITLE_FONT' );//static


  // static class: ContentPanel
  var ContentPanel =
//Inner class for ContentPanel provided to avoid IDEA presentation compiler flagging inlined DBI version as a dbi scoping issue
    define( function( require ) {
      function ContentPanel( model, canvas, whiteBackground ) {
        //This is used by both the drag handler from the toolbox and by the node itself (after being dropped once, it gets a new drag handler)
        var getToolboxBounds = new Function0().withAnonymousClassBody( {
          apply: function() {
            return getParent().getGlobalFullBounds();
          }
        } );
        //Add title and a spacer below it
        addChild( new PText( SugarAndSaltSolutionsResources.Strings.CONDUCTIVITY ).withAnonymousClassBody( {
          initializer: function() {
            setFont( TITLE_FONT );
          }
        } ) );
        //Factory that creates the ConductivityTesterToolNode and positions it where the mouse is
        var conductivityNodeMaker = new NodeFactory().withAnonymousClassBody( {
          createNode: function( transform, visible, location ) {
            //Create and return the tool node, which reuses the same conductivityTesterNode
            return new ConductivityTesterToolNode( new SugarAndSaltSolutionsConductivityTesterNode( model.conductivityTester, transform, canvas.getRootNode(), location, whiteBackground ) );
          }
        } );
        //Create a thumbnail to be shown in the toolbox
        var thumbnail = new SugarAndSaltSolutionsConductivityTesterNode( model.conductivityTester, canvas.getModelViewTransform(), canvas.getRootNode(), new Vector2( 0, 0 ), whiteBackground ).createImage();
        //Add the tool icon node, which can be dragged out of the toolbox to create the full-sized conductivity tester node
        addChild( new ToolIconNode( multiScaleToWidth( toBufferedImage( thumbnail ), 130 ), model.conductivityTester.visible, canvas.getModelViewTransform(), canvas, conductivityNodeMaker, model, getToolboxBounds ).withAnonymousClassBody( {

          //private
          var shortCircuitTextNode,
          //Override addChild so that the created node will go behind the salt shaker, since the salt shaker should always be in front
          addChild: function( canvas, node ) {
            canvas.submergedInWaterNode.addChild( node );
            shortCircuitTextNode = new ShortCircuitTextNode( model.conductivityTester, (node).node.getLightBulbNode() );
            canvas.addChild( shortCircuitTextNode );
          },
          //Remove created tools from their parent node
          removeChild: function( canvas, node ) {
            canvas.submergedInWaterNode.removeChild( node );
            canvas.removeChild( shortCircuitTextNode );
          }
        } ) );
      }

      return inherit( VBox, ContentPanel, {
      } );
    } );
  ;
  function ConductivityTesterToolboxNode( model, canvas, whiteBackground ) {
    WhiteControlPanelNode.call( this, new ContentPanel( model, canvas, whiteBackground ) );
  }

  return inherit( WhiteControlPanelNode, ConductivityTesterToolboxNode, {
  } );
} );

