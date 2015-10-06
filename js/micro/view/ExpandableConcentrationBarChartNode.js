// Copyright 2002-2014, University of Colorado Boulder
/**
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
  define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var AccordionBox = require( 'SUN/AccordionBox' );
    var MicroConcentrationBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/MicroConcentrationBarChart' );
    var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
    var Text = require( 'SCENERY/nodes/Text' );

    // strings
    var CONCENTRATION = require( 'string!SUGAR_AND_SALT_SOLUTIONS/concentration' );

    /**
     *
     * @param {Property<boolean>} showConcentrationBarChart
     * @param {Property<boolean>} showConcentrationbValues
     * @param {Array<Bar>} bars
     * @constructor
     */
    function ExpandableConcentrationBarChartNode( showConcentrationBarChart,
                                                  showConcentrationValues ) {
      var thisNode = this;
      Node.call( thisNode, { fill: SugarAndSaltConstants.WATER_COLOR } );

      //The bar chart itself (when toggled to be visible)
      this.microConcentrationBarChart = new MicroConcentrationBarChart( showConcentrationBarChart, showConcentrationValues );
      var titleNode = new Text( CONCENTRATION, { font: SugarAndSaltConstants.TITLE_FONT } );
      var accordionBoxNode = new AccordionBox( this.microConcentrationBarChart , {
        //Node that says "concentration" and has a "+" button to expand the concentration bar chart
        titleNode: titleNode,
        fill: SugarAndSaltConstants.WATER_COLOR,
        contentAlign: 'center',
        titleAlignX: 'center',
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

    return inherit( Node, ExpandableConcentrationBarChartNode, {
      //Clear the previous bars and display the specified bars
      setBars: function( bars ) {
        this.microConcentrationBarChart.setBars( bars );
      }
    } );
  } );
