//  Copyright 2002-2014, University of Colorado Boulder

/**
 *  Control that allows the user to expand/collapse the concentration bar chart, also contains said bar chart.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var SugarSaltBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/view/SugarSaltBarChart' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var CONCENTRATION = require( 'string!SUGAR_AND_SALT_SOLUTIONS/concentration' );


  /**
   *
   * @param {Property<boolean>} showConcentrationBarChart
   * @param {Property<number>} saltConcentration
   * @param {Property<number>} sugarConcentration
   * @param {Property<boolean>} showConcentrationValues
   * @param {number} scaleFactor
   * @constructor
   */
  function ExpandableConcentrationBarChartNode( showConcentrationBarChart, saltConcentration, sugarConcentration, showConcentrationValues, scaleFactor ) {
    var thisNode = this;
    Node.call( thisNode, {fill: SugarAndSaltConstants.WATER_COLOR} );

    //The bar chart itself (when toggled to be visible)
    var barChartNode = new SugarSaltBarChart( saltConcentration, sugarConcentration, showConcentrationValues,
      showConcentrationBarChart, scaleFactor );
    var titleNode = new Text( CONCENTRATION, { font: SugarAndSaltConstants.TITLE_FONT } );

    var accordionBoxNode = new AccordionBox( barChartNode, {
      //Node that says "concentration" and has a "+" button to expand the concentration bar chart
      titleNode: titleNode,
      fill: SugarAndSaltConstants.WATER_COLOR,
      contentAlign: 'center',
      titleAlign: 'center',
      buttonAlign: 'right',
      titleYMargin: 4,
      contentXMargin: 10,
      buttonXMargin: 8,
      buttonLength: 20,
      contentYSpacing: 2,
      contentYMargin: 2,
      expandedProperty: showConcentrationBarChart //Only show this bar chart if the user has opted to do so
    } );

    thisNode.addChild( accordionBoxNode );
  }

  return inherit( Node, ExpandableConcentrationBarChartNode );

} );

//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.macro.view;
//
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.model.property.SettableProperty;
//import edu.colorado.phet.sugarandsaltsolutions.common.view.MinimizedConcentrationBarChart;
//import edu.umd.cs.piccolo.PNode;
//
///**
// *
// *
// * @author Sam Reid
// */
//public class ExpandableConcentrationBarChartNode extends PNode {
//    public ExpandableConcentrationBarChartNode( final Property<Boolean> showConcentrationBarChart, ObservableProperty<Double> saltConcentration,
//                                                ObservableProperty<Double> sugarConcentration, SettableProperty<Boolean> showConcentrationValues, double scaleFactor ) {
//


//    }
//}
