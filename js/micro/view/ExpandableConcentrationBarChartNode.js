// Copyright 2014-2015, University of Colorado Boulder
/**
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
  define( function( require ) {
    'use strict';

    // modules
    var AccordionBox = require( 'SUN/AccordionBox' );
    var inherit = require( 'PHET_CORE/inherit' );
    var MicroConcentrationBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/MicroConcentrationBarChart' );
    var Node = require( 'SCENERY/nodes/Node' );
    var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
    var Text = require( 'SCENERY/nodes/Text' );

    // strings
    var concentrationString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/concentration' );

    /**
     *
     * @param {Property<boolean>} showConcentrationBarChart
     * @param {Property<boolean>} showConcentrationbValues
     * @param {Array<Bar>} bars
     * @constructor
     */
    function ExpandableConcentrationBarChartNode( showConcentrationBarChart,
                                                  showConcentrationValues ) {
      var self = this;
      Node.call( self, { fill: SugarAndSaltConstants.WATER_COLOR } );

      //The bar chart itself (when toggled to be visible)
      this.microConcentrationBarChart = new MicroConcentrationBarChart( showConcentrationBarChart, showConcentrationValues );
      var titleNode = new Text( concentrationString, { font: SugarAndSaltConstants.TITLE_FONT } );
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
        buttonTouchAreaXDilation: 16,
        buttonTouchAreaYDilation: 16,
        contentYSpacing: 2,
        contentYMargin: 2,
        expandedProperty: showConcentrationBarChart //Only show this bar chart if the user has opted to do so
      } );

      self.addChild( accordionBoxNode );

    }

    return inherit( Node, ExpandableConcentrationBarChartNode, {
      //Clear the previous bars and display the specified bars
      setBars: function( bars ) {
        this.microConcentrationBarChart.setBars( bars );
      }
    } );
  } );
