//  Copyright 2002-2014, University of Colorado Boulder
/**
 * This class represents the bars in the bar chart.  They grow upwards in the Y direction from a baseline offset of y=0.
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
  var Color = require( 'SCENERY/util/Color' );
  var Shape = require( 'KITE/Shape' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );

  // strings
  var PATTERN__MOLES_PER_LITER = require( 'string!SUGAR_AND_SALT_SOLUTIONS/pattern.molesPerLiter' );
  var PATTERN__MOLES_PER_LITER_MULTILINE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/pattern.molesPerLiterMultiline' );

  // constants
  var WIDTH = 40;
  //Insets to be used for padding between edge of canvas and controls, or between controls
  var CAPTION_INSET = 18;

  /**
   *
   * @param {Property<Color>} colorProperty
   * @param {string} caption
   * @param {Property<number>} valueProperty
   * @param {Property<boolean>} showValueProperty
   * @param {number} verticalAxisScale
   * @param {boolean} multiLineReadout
   * @param {Node} icon // optional
   * @constructor
   */
  function Bar( colorProperty, caption, valueProperty, showValueProperty, verticalAxisScale, multiLineReadout, icon ) {
    var thisBar = this;
    Node.call( thisBar );

    // Create and add the bar itself.
    var bar = new Path( new Shape(), { lineWidth: 1, stroke: Color.BLACK, fill: colorProperty.get() } );
    thisBar.addChild( bar );

    colorProperty.link( function( color ) {
      bar.fill = color;
    } );

    // Wire up the bar to change size based on the observable entity.
    valueProperty.link( function( value ) {
      var height = ( value * verticalAxisScale );
      //Graphics problems occur if you let the bar go too high, so clamp it
      var maxBarHeight = 130;
      if ( height > maxBarHeight || isNaN( height ) || !_.isFinite( height ) ) {
        height = maxBarHeight;
      }
      bar.setShape( Shape.rectangle( 0, -height, WIDTH, height ) );
    } );

    // Create and add the caption.
    var captionNode = new HTMLText( caption, { font: SugarAndSaltConstants.CONTROL_FONT } );

    // Position so that it is centered under the bar.
    thisBar.addChild( captionNode );
    captionNode.x = WIDTH / 2 - captionNode.bounds.width / 2;
    captionNode.y = CAPTION_INSET;

    if ( icon ) {
      //If specified, show an icon below the caption (to save horizontal space)
      thisBar.addChild( icon );
      icon.x = captionNode.bounds.getCenterX() - icon.bounds.getWidth() / 2;
      icon.y = captionNode.bounds.getMaxY();
    }

    //Optionally show the readout of the exact value above the bar itself
    var valueReadout = new HTMLText( "", { font: SugarAndSaltConstants.CONTROL_FONT } );
    thisBar.addChild( valueReadout );
    valueProperty.link( function( molesPerMeterCubed ) {

      //Convert to Moles per Liter from SI
      //See: http://wiki.answers.com/Q/How_many_metres_cubed_are_in_a_litre
      var litersPerCubicMeter = 1000;
      var molesPerLiter = molesPerMeterCubed / litersPerCubicMeter;

      //Update the text
      //Use multiline in tabs with 3+ bars, otherwise readouts will overlap each other
      var valueStr = Util.toFixed( molesPerLiter, 2 );
      valueReadout.text = StringUtils.format( multiLineReadout ? PATTERN__MOLES_PER_LITER_MULTILINE :
                                              PATTERN__MOLES_PER_LITER, valueStr );

      //Show the label centered above the bar, even if bar is zero height
      valueReadout.x = bar.bounds.getCenterX() - valueReadout.bounds.getWidth() / 2;
      valueReadout.y = bar.bounds.getMinY() - valueReadout.bounds.getHeight();

    } );

    //Only show the readout if the user has opted to do so
    showValueProperty.link( function( showValue ) {
      valueReadout.visible = showValue;
    } );

  }

  return inherit( Node, Bar );

} );

//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.view.barchart;
//
//import java.awt.BasicStroke;
//import java.awt.Color;
//import java.text.DecimalFormat;
//import java.text.MessageFormat;
//
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.util.Option;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.piccolophet.nodes.HTMLNode;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.common.piccolophet.nodes.kit.ZeroOffsetNode;
//import edu.umd.cs.piccolo.PNode;
//import edu.umd.cs.piccolo.nodes.PPath;
//
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Strings.PATTERN__MOLES_PER_LITER;
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Strings.PATTERN__MOLES_PER_LITER_MULTILINE;
//import static edu.colorado.phet.sugarandsaltsolutions.common.view.BeakerAndShakerCanvas.CONTROL_FONT;
//import static java.lang.Float.isInfinite;
//import static java.lang.Float.isNaN;
//
///**
// * This class represents the bars in the bar chart.  They grow upwards in the Y direction from a baseline offset of y=0.
// *
// * @author Sam Reid
// */
//public class Bar extends PNode {
// protected final PNode valueReadout;
//
//    public Bar( final ObservableProperty<Color> color,
//                final String caption,
//                final Option<PNode> icon,
//                final ObservableProperty<Double> value,
//                final ObservableProperty<Boolean> showValue,
//                final double verticalAxisScale,
//                final boolean multiLineReadout ) {
//

//


//

//

//    }
//}
