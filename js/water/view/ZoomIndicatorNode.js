// Copyright 2002-2011, University of Colorado
/**
 * This node draws a box around a small rectangle in the mini beaker, with lines to the ParticleWindowNode to indicate that is the magnified region.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Color = require( 'SCENERY/util/Color' );
  var Stroke = require( 'java.awt.Stroke' );
  var Line2D = require( 'java.awt.geom.Line2D' );
  var Rectangle = require( 'KITE/Rectangle' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var Node = require( 'SCENERY/nodes/Node' );

  function ZoomIndicatorNode( lineColor, miniBeakerNode, particleWindowNode ) {
    //Get the bounds of the relevant regions
    var miniBeakerBounds = miniBeakerNode.getFullBounds();
    var particleWindowBounds = particleWindowNode.getFullBounds();
    //Invisible rectangle that the zoom lines will be pointing at
    var size = 3;
    var zoomRect = new Rectangle.Number( miniBeakerBounds.getCenterX() - size / 2, (miniBeakerBounds.getCenterY() + miniBeakerBounds.getMaxY()) / 2 - size / 2, size, size );
    //Make it wide enough to be seen on a projector in a lit classroom
    var zoomLineStroke = new BasicStroke( 3, BasicStroke.CAP_BUTT, BasicStroke.JOIN_MITER, 1, new float[]
    { 20, 10 }
  ,
    0
  )
    ;
    addChild( new PhetPPath( new Line2D.Number( zoomRect.getCenterX(), zoomRect.getY(), particleWindowBounds.getMaxX(), particleWindowBounds.getY() ), zoomLineStroke, lineColor.get() ).withAnonymousClassBody( {
      initializer: function() {
        lineColor.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( color ) {
            setStrokePaint( color );
          }
        } ) );
      }
    } ) );
    addChild( new PhetPPath( new Line2D.Number( zoomRect.getCenterX(), zoomRect.getMaxY(), particleWindowBounds.getMaxX(), particleWindowBounds.getMaxY() ), zoomLineStroke, lineColor.get() ).withAnonymousClassBody( {
      initializer: function() {
        lineColor.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( color ) {
            setStrokePaint( color );
          }
        } ) );
      }
    } ) );
  }

  return inherit( Node, ZoomIndicatorNode, {
  } );
} );

