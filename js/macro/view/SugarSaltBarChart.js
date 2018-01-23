// Copyright 2014-2017, University of Colorado Boulder
/**
 * This bar chart shows the concentrations for both salt and sugar (if any)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bar = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/barchart/Bar' );
  var Color = require( 'SCENERY/util/Color' );
  var ConcentrationBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/barchart/ConcentrationBarChart' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  // strings
  var saltString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/salt' );
  var sugarString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sugar' );

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

    var self = this;
    ConcentrationBarChart.call( self, showValues, visible, 0, true );

    //Convert from model units (Mols) to stage units by multiplying by this scale factor
    var verticalAxisScale = 160 * 1E-4 * scaleFactor;

    //Add a Salt concentration bar
    var saltBar = new Bar( new Property( Color.WHITE ), saltString, saltConcentration, showValues, verticalAxisScale, false );
    self.addBar( saltBar );
    saltBar.x = self.background.bounds.getWidth() * 0.25 - SugarAndSaltConstants.BAR_WIDTH / 2;
    saltBar.y = self.abscissaY;

    //Add a Sugar concentration bar
    var sugarBar = new Bar( new Property( Color.WHITE ), sugarString, sugarConcentration, showValues, verticalAxisScale, false );
    self.addBar( sugarBar );
    sugarBar.x = self.background.bounds.getWidth() * 0.75 - SugarAndSaltConstants.BAR_WIDTH / 2;
    sugarBar.y = self.abscissaY;
  }

  sugarAndSaltSolutions.register( 'SugarSaltBarChart', SugarSaltBarChart );
  return inherit( ConcentrationBarChart, SugarSaltBarChart );
} );
