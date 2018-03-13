// Copyright 2014-2017, University of Colorado Boulder
/**
 * Bar chart that shows Na+ and Cl- concentrations for table salt.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bar = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/barchart/Bar' );
  var ConcentrationBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/barchart/ConcentrationBarChart' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StandardizedNodeX = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/StandardizedNodeX' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );


  /**
   *
   * @param {Property<boolean>} visible
   * @param {Property<boolean>} showValues
   * @constructor
   */
  function MicroConcentrationBarChart( visible, showValues ) {
    ConcentrationBarChart.call( this, showValues, visible,
      // Leave enough space for the captions.  This is hard coded since the value is difficult to compute dynamically:
      // largest of all (insets + text + insets + caption + insets)
      // It is also okay that this is hard-coded since translations typically expand horizontally instead of vertically
      0, true );

    this.showValues = showValues;
  }

  sugarAndSaltSolutions.register( 'MicroConcentrationBarChart', MicroConcentrationBarChart );
  return inherit( ConcentrationBarChart, MicroConcentrationBarChart, {

    //Clear the previous bars and display the specified bars
    setBars: function( bars ) {
      var self = this;
      self.removeAllChildren();

      //Convert from model units (mol/L) to stage units by multiplying by this scale factor
      var verticalAxisScale = 8 / 1000.0;

      //Add the bar node for each of the specified bars
      var spacing = self.background.bounds.getWidth() / ( bars.length + 1 );
      var barX = spacing;

      _.each( bars, function( bar ) {
        var finalBarX = barX;
        var standardizedNode = new StandardizedNodeX( new Bar( bar.color, bar.caption,
          bar.concentration, self.showValues, verticalAxisScale, true, bar.icon ) );

        //Use a StandardizedNodeX here to center the bars on the desired points horizontally so the bars will be equidistant
        // Ashraf TODO  self.addChild( standardizedNode );
        standardizedNode.x = finalBarX - standardizedNode.bounds.width / 2;
        standardizedNode.y = self.abscissaY;
        barX = barX + spacing;

      } );
    }
  } );
} );
