// Copyright 2002-2011, University of Colorado
/**
 * Control that allows the user to expand/collapse the concentration bar chart, also contains said bar chart.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var SettableProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.SettableProperty' );
  var MinimizedConcentrationBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/MinimizedConcentrationBarChart' );
  var Node = require( 'SCENERY/nodes/Node' );

  function ExpandableConcentrationBarChartNode( showConcentrationBarChart, saltConcentration, sugarConcentration, showConcentrationValues, scaleFactor ) {
    //The bar chart itself (when toggled to be visible)
    addChild( new SugarSaltBarChart( saltConcentration, sugarConcentration, showConcentrationValues, showConcentrationBarChart, scaleFactor ) );
    //Panel that says "concentration" and has a "+" button to expand the concentration bar chart
    addChild( new MinimizedConcentrationBarChart( showConcentrationBarChart ) );
  }

  return inherit( Node, ExpandableConcentrationBarChartNode, {
  } );
} );

