// Copyright 2002-2011, University of Colorado
/**
 * Control bar that shows when the concentration bar chart is minimized and allows the user to maximized the concentration bar chart.
 * This class is necessary so that it will have the same width and layout metrics as the expanded bar chart.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'KITE/Rectangle' );
  var BufferedImage = require( 'java.awt.image.BufferedImage' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var CursorHandler = require( 'edu.colorado.phet.common.piccolophet.event.CursorHandler' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var SugarAndSaltSolutionsResources = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PBasicInputEventHandler = require( 'edu.umd.cs.piccolo.event.PBasicInputEventHandler' );
  var PInputEvent = require( 'edu.umd.cs.piccolo.event.PInputEvent' );
  var PImage = require( 'edu.umd.cs.piccolo.nodes.PImage' );
  var PText = require( 'edu.umd.cs.piccolo.nodes.PText' );
  var getMaximizeButtonImage = require( 'edu.colorado.phet.common.phetcommon.resources.PhetCommonResources.getMaximizeButtonImage' );//static
  var TITLE_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/TITLE_FONT' );//static
  var WATER_COLOR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/WATER_COLOR' );//static

  function MinimizedConcentrationBarChart( barChartVisible ) {
    this.INSET = 5;
    var maximizeButtonImage = getMaximizeButtonImage();
    var totalWidth = 220;
    //Show the title
    var title = new PText( SugarAndSaltSolutionsResources.Strings.CONCENTRATION ).withAnonymousClassBody( {
      initializer: function() {
        setFont( TITLE_FONT );
      }
    } );
    //Only show this bar chart if the user has opted to do so
    barChartVisible.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( barChartVisible ) {
        setVisible( !barChartVisible );
      }
    } ) );
    var background = new PhetPPath( new Rectangle.Number( 0, 0, totalWidth, Math.max( title.getFullBounds().getHeight(), maximizeButtonImage.getHeight() ) + INSET * 2 ), WATER_COLOR, new BasicStroke( 1
    f
  ),
    Color.BLACK
  )
    ;
    //Add a maximized button that shows the bar chart
    var maximizeButton = new PImage( maximizeButtonImage ).withAnonymousClassBody( {
      initializer: function() {
        addInputEventListener( new CursorHandler() );
        addInputEventListener( new PBasicInputEventHandler().withAnonymousClassBody( {
          mousePressed: function( event ) {
            barChartVisible.set( true );
          }
        } ) );
      }
    } );
    addChild( background );
    addChild( maximizeButton );
    addChild( title );
    title.setOffset( MinimizedConcentrationBarChart.this.getFullBounds().getCenterX() - title.getFullBounds().getWidth() / 2, INSET );
    maximizeButton.setOffset( background.getFullBounds().getWidth() - maximizeButton.getFullBounds().getWidth() - INSET, INSET );
  }

  return inherit( Node, MinimizedConcentrationBarChart, {
  } );
} );

