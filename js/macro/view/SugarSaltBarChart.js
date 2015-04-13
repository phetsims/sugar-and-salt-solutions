// Copyright 2002-2014, University of Colorado Boulder
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


//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.macro.view;
//
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.SettableProperty;
//import edu.colorado.phet.common.phetcommon.util.Option.None;
//import edu.colorado.phet.sugarandsaltsolutions.common.view.barchart.Bar;
//import edu.colorado.phet.sugarandsaltsolutions.common.view.barchart.ConcentrationBarChart;
//import edu.umd.cs.piccolo.PNode;
//
//import static edu.colorado.phet.common.phetcommon.model.property.Property.property;
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Strings.SALT;
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Strings.SUGAR;
//import static java.awt.Color.white;
//
///**
// *
// *
// * @author Sam Reid
// */
//public class SugarSaltBarChart extends ConcentrationBarChart {
//    public SugarSaltBarChart( ObservableProperty<Double> saltConcentration, ObservableProperty<Double> sugarConcentration, final SettableProperty<Boolean> showValues, final SettableProperty<Boolean> visible, double scaleFactor ) {

//    }
//}
