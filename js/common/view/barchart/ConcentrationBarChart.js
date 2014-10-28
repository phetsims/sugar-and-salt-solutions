/* Copyright 2002-2011, University of Colorado */
/**
 * Optional bar chart that shows bar charts for concentrations in macro and micro tab
 *
 * @author Sam Reid
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Color = require( 'SCENERY/util/Color' );
  var Line2D = require( 'java.awt.geom.Line2D' );
  var Rectangle = require( 'KITE/Rectangle' );
  var SettableProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.SettableProperty' );
  var PhetCommonResources = require( 'edu.colorado.phet.common.phetcommon.resources.PhetCommonResources' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var PropertyCheckBox = require( 'edu.colorado.phet.common.phetcommon.view.controls.PropertyCheckBox' );
  var CursorHandler = require( 'edu.colorado.phet.common.piccolophet.event.CursorHandler' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var VBox = require( 'edu.colorado.phet.common.piccolophet.nodes.layout.VBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PBasicInputEventHandler = require( 'edu.umd.cs.piccolo.event.PBasicInputEventHandler' );
  var PInputEvent = require( 'edu.umd.cs.piccolo.event.PInputEvent' );
  var PImage = require( 'edu.umd.cs.piccolo.nodes.PImage' );
  var PText = require( 'edu.umd.cs.piccolo.nodes.PText' );
  var PSwing = require( 'edu.umd.cs.piccolox.pswing.PSwing' );
  var setBackgroundDeep = require( 'edu.colorado.phet.common.phetcommon.view.util.SwingUtils.setBackgroundDeep' );//static
  var CONCENTRATION = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/CONCENTRATION' );//static
  var SHOW_VALUES = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/SHOW_VALUES' );//static
  var BeakerAndShakerCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas' );//static ///*

  function ConcentrationBarChart( showValues, visible, verticalSpacingForCaptions, showShowValuesCheckbox ) {
    this.abscissaY;
    this.background;
    var INSET = 5;
    //Background for the bar chart
    background = new PhetPPath( new Rectangle.Number( 0, 0, 220, 234 + verticalSpacingForCaptions ), WATER_COLOR, new BasicStroke( 1
    f
  ),
    Color.BLACK
  )
    ;
    addChild( background );
    //The x-axis, the baseline for the bars
    abscissaY = background.getFullBounds().getHeight() - 60 - verticalSpacingForCaptions;
    addChild( new PhetPPath( new Line2D.Number( INSET, abscissaY, background.getFullBounds().getWidth() - INSET, abscissaY ), new BasicStroke( 2 ), Color.black ) );
    //Show the title
    addChild( new PText( CONCENTRATION ).withAnonymousClassBody( {
      initializer: function() {
        setFont( TITLE_FONT );
        setOffset( ConcentrationBarChart.this.getFullBounds().getCenterX() - getFullBounds().getWidth() / 2, INSET );
      }
    } ) );
    //Add a minimize button that hides the bar chart (replaced with a "+" button which can be used to restore it
    addChild( new PImage( PhetCommonResources.getMinimizeButtonImage() ).withAnonymousClassBody( {
      initializer: function() {
        addInputEventListener( new CursorHandler() );
        addInputEventListener( new PBasicInputEventHandler().withAnonymousClassBody( {
          mousePressed: function( event ) {
            visible.set( false );
          }
        } ) );
        setOffset( background.getFullBounds().getWidth() - getFullBounds().getWidth() - INSET, INSET );
      }
    } ) );
    //Only show this bar chart if the user has opted to do so
    visible.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( visible ) {
        setVisible( visible );
      }
    } ) );
    //It is only shown in the first tab, since values are suppressed in the Micro tab
    if ( showShowValuesCheckbox ) {
      addChild( new VBox().withAnonymousClassBody( {
        initializer: function() {
          addChild( new PSwing( new PropertyCheckBox( SHOW_VALUES, showValues ).withAnonymousClassBody( {
            initializer: function() {
              setFont( CONTROL_FONT );
              setBackgroundDeep( this, WATER_COLOR );
            }
          } ) ) );
          setOffset( background.getFullBounds().getWidth() / 2 - getFullBoundsReference().width / 2, background.getHeight() - getFullBounds().getHeight() - INSET );
        }
      } ) );
    }
  }

  return inherit( Node, ConcentrationBarChart, {
  } );
} );

