// Copyright 2014-2015, University of Colorado Boulder
/**
 * This bar chart shows the concentrations for both salt and sugar (if any)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ConcentrationBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/barchart/ConcentrationBarChart' );
  var Bar = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/barchart/Bar' );
  var Color = require( 'SCENERY/util/Color' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var Property = require( 'AXON/Property' );

  // strings
  var SALT = require( 'string!SUGAR_AND_SALT_SOLUTIONS/salt' );
  var SUGAR = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sugar' );

  /**
   * @param {Property<boolean>} showConcentrationBarChart
   * @param {Property<number>} saltConcentration
   * @param {Property<number>} sugarConcentration
   * @param {Property<boolean>} showValues
   * @param {Property<boolean>}visible
   * @param {number} scaleFactor
   * @constructor
   */
  function SugarSaltBarChart( saltConcentration, sugarConcentration, showValues, visible, scaleFactor ) {

    var thisChart = this;
    ConcentrationBarChart.call( thisChart, showValues, visible, 0, true );

    //Convert from model units (Mols) to stage units by multiplying by this scale factor
    var verticalAxisScale = 160 * 1E-4 * scaleFactor;

    //Add a Salt concentration bar
    var saltBar = new Bar( new Property( Color.WHITE ), SALT, saltConcentration, showValues, verticalAxisScale, false );
    thisChart.addBar( saltBar );
    saltBar.x = thisChart.background.bounds.getWidth() * 0.25 - SugarAndSaltConstants.BAR_WIDTH / 2;
    saltBar.y = thisChart.abscissaY;

    //Add a Sugar concentration bar
    var sugarBar = new Bar( new Property( Color.WHITE ), SUGAR, sugarConcentration, showValues, verticalAxisScale, false );
    thisChart.addBar( sugarBar );
    sugarBar.x = thisChart.background.bounds.getWidth() * 0.75 - SugarAndSaltConstants.BAR_WIDTH / 2;
    sugarBar.y = thisChart.abscissaY;
  }

  return inherit( ConcentrationBarChart, SugarSaltBarChart );
} );
