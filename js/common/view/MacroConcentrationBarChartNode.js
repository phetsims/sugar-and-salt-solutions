// Copyright 2014-2017, University of Colorado Boulder

/**
 *  Control that allows the user to expand/collapse the concentration bar chart, also contains said bar chart.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var SugarSaltBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/view/SugarSaltBarChart' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var concentrationString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/concentration' );

  /**
   *
   * @param {Property<boolean>} showConcentrationBarChart
   * @param {Property<number>} saltConcentration
   * @param {Property<number>} sugarConcentration
   * @param {Property<boolean>} showConcentrationValues
   * @param {number} scaleFactor
   * @constructor
   */
  function MacroConcentrationBarChartNode( showConcentrationBarChart, saltConcentration, sugarConcentration, showConcentrationValues, scaleFactor ) {
    var self = this;
    Node.call( self, { fill: SugarAndSaltConstants.WATER_COLOR } );

    //The bar chart itself (when toggled to be visible)
    var barChartNode = new SugarSaltBarChart( saltConcentration, sugarConcentration, showConcentrationValues,
      showConcentrationBarChart, scaleFactor );
    var titleNode = new Text( concentrationString, { font: SugarAndSaltConstants.TITLE_FONT } );

    var accordionBoxNode = new AccordionBox( barChartNode, {
      //Node that says "concentration" and has a "+" button to expand the concentration bar chart
      titleNode: titleNode,
      fill: SugarAndSaltConstants.WATER_COLOR,
      contentAlign: 'center',
      titleAlignX: 'center',
      buttonAlign: 'right',
      titleYMargin: 4,
      contentXMargin: 10,
      buttonXMargin: 8,
      buttonTouchAreaXDilation: 16,
      buttonTouchAreaYDilation: 16,
      buttonLength: 20,
      contentYSpacing: 2,
      contentYMargin: 2,
      expandedProperty: showConcentrationBarChart //Only show this bar chart if the user has opted to do so
    } );

    self.addChild( accordionBoxNode );
  }

  sugarAndSaltSolutions.register( 'MacroConcentrationBarChartNode', MacroConcentrationBarChartNode );

  return inherit( Node, MacroConcentrationBarChartNode );

} );

