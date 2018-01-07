// Copyright 2014-2017, University of Colorado Boulder

/**
 * Optional bar chart that shows bar charts for concentrations in macro and micro tab
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var showValuesString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/showValues' );

  //Insets to be used for padding between edge of canvas and controls, or between controls
  var INSET = 10;

  /**
   *
   * @param {Property<boolean>} showValues
   * @param {Property<boolean>} visible
   * @param {number} verticalSpacingForCaptions
   * @param {boolean} showShowValuesCheckbox
   * @constructor
   */
  function ConcentrationBarChart( showValues, visible, verticalSpacingForCaptions, showShowValuesCheckbox ) {
    var self = this;
    Node.call( self );

    //@protected Background for the bar chart
    self.background = new Path( Shape.rectangle( 0, 0, 180, 170 + verticalSpacingForCaptions ), {
      fill: SugarAndSaltConstants.WATER_COLOR//Background for the bar chart
    } );
    self.addChild( self.background );

    self.barChartContentNode = new Node();
    self.addChild( self.barChartContentNode );

    //The x-axis, the baseline for the bars
    //@protected
    self.abscissaY = self.background.bounds.getHeight() - 60 - verticalSpacingForCaptions;
    self.barChartContentNode.addChild( new Path( Shape.lineSegment( 0, self.abscissaY,
      self.background.bounds.getWidth(), self.abscissaY ), {
      lineWidth: 1,
      stroke: Color.BLACK
    } ) );

    //Add a checkbox that lets the user toggle on and off whether actual values are shown
    //It is only shown in the first tab, since values are suppressed in the Micro tab
    if ( showShowValuesCheckbox ) {
      var showValuesCheckbox = new CheckBox( new Text( showValuesString, { font: SugarAndSaltConstants.CONTROL_FONT } ),
        showValues, {
          boxWidth: 20
        } );
      self.barChartContentNode.addChild( showValuesCheckbox );
      showValuesCheckbox.x = self.bounds.getWidth() / 2 - showValuesCheckbox.bounds.width / 2;
      showValuesCheckbox.y = self.getHeight() - showValuesCheckbox.bounds.getHeight() - INSET;
    }

    //Only show this bar chart if the user has opted to do so
    visible.linkAttribute( self, 'visible' );
  }

  return inherit( Node, ConcentrationBarChart, {
    //@protected
    addBar: function( barNode ) {
      this.barChartContentNode.addChild( barNode );
    }
  } );

} );


///* Copyright 2002-2011, University of Colorado */
//
//package edu.colorado.phet.sugarandsaltsolutions.common.view.barchart;
//
//import java.awt.BasicStroke;
//import java.awt.Color;
//import java.awt.geom.Line2D;
//import java.awt.geom.Rectangle2D;
//
//import edu.colorado.phet.common.phetcommon.model.property.SettableProperty;
//import edu.colorado.phet.common.phetcommon.resources.PhetCommonResources;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.controls.PropertyCheckBox;
//import edu.colorado.phet.common.piccolophet.event.CursorHandler;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.common.piccolophet.nodes.layout.VBox;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.event.PBasicInputEventHandler;
//import edu.umd.cs.piccolo.event.PInputEvent;
//import edu.umd.cs.piccolo.nodes.PImage;
//import edu.umd.cs.piccolo.nodes.PText;
//import edu.umd.cs.piccolox.pswing.PSwing;
//
//import static edu.colorado.phet.common.phetcommon.view.util.SwingUtils.setBackgroundDeep;
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Strings.CONCENTRATION;
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Strings.SHOW_VALUES;
//import static edu.colorado.phet.sugarandsaltsolutions.common.view.BeakerAndShakerCanvas.*;
//
///**
// * Optional bar chart that shows bar charts for concentrations in macro and micro tab
// *
// * @author Sam Reid
// * @author John Blanco
// */
//public class ConcentrationBarChart extends PNode {
//
//    protected final double abscissaY;
//    protected final PNode background;
//
//    public ConcentrationBarChart( final SettableProperty<Boolean> showValues, final SettableProperty<Boolean> visible, int verticalSpacingForCaptions, boolean showShowValuesCheckbox ) {
//        final int INSET = 5;
//
//        //Background for the bar chart
//        background = new PhetPPath( new Rectangle2D.Double( 0, 0, 220, 234 + verticalSpacingForCaptions ), WATER_COLOR, new BasicStroke( 1f ), Color.BLACK );
//        addChild( background );
//
//        //The x-axis, the baseline for the bars
//        abscissaY = background.getFullBounds().getHeight() - 60 - verticalSpacingForCaptions;
//        addChild( new PhetPPath( new Line2D.Double( INSET, abscissaY, background.getFullBounds().getWidth() - INSET, abscissaY ), new BasicStroke( 2 ), Color.black ) );
//
//        //Show the title
//        addChild( new PText( CONCENTRATION ) {{
//            setFont( TITLE_FONT );
//            setOffset( ConcentrationBarChart.this.getFullBounds().getCenterX() - getFullBounds().getWidth() / 2, INSET );
//        }} );
//
//        //Add a minimize button that hides the bar chart (replaced with a "+" button which can be used to restore it
//        addChild( new PImage( PhetCommonResources.getMinimizeButtonImage() ) {{
//            addInputEventListener( new CursorHandler() );
//            addInputEventListener( new PBasicInputEventHandler() {
//                @Override public void mousePressed( PInputEvent event ) {
//                    visible.set( false );
//                }
//            } );
//            setOffset( background.getFullBounds().getWidth() - getFullBounds().getWidth() - INSET, INSET );
//        }} );
//

//

//    }
//}
