// Copyright 2002-2011, University of Colorado
/**
 * Bar chart that shows Na+ and Cl- concentrations for table salt.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SettableProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.SettableProperty' );
  var Bar = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/barchart/Bar' );
  var BarItem = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/barchart/BarItem' );
  var ConcentrationBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/barchart/ConcentrationBarChart' );
  var Node = require( 'SCENERY/nodes/Node' );

  function MicroConcentrationBarChart( visible, showValues, bars ) {

    //private
    this.barLayer = new Node();

    //private
    this.showValues;
    ConcentrationBarChart.call( this, showValues, visible, //It is also okay that this is hard-coded since translations typically expand horizontally instead of vertically
      0, false );
    addChild( barLayer );
    this.showValues = showValues;
    setBars( bars );
  }

  return inherit( ConcentrationBarChart, MicroConcentrationBarChart, {
//Clear the previous bars and display the specified bars
    setBars: function( bars ) {
      barLayer.removeAllChildren();
      //Convert from model units (mol/L) to stage units by multiplying by this scale factor
      var verticalAxisScale = 8 / 1000.0;
      //Add the bar node for each of the specified bars
      var spacing = background.getFullBounds().getWidth() / (bars.length + 1);
      var barX = spacing;
      for ( var bar in bars ) {
        var finalBarX = barX;
        //Use a StandardizedNodeX here to center the bars on the desired points horizontally so the bars will be equidistant
        barLayer.addChild( new StandardizedNodeX( new Bar( bar.color, bar.caption, bar.icon.apply(), bar.concentration, showValues, verticalAxisScale, true ) ).withAnonymousClassBody( {
          initializer: function() {
            setOffset( finalBarX - getFullBoundsReference().width / 2, abscissaY );
          }
        } ) );
        barX = barX + spacing;
      }
    }
  } );
} );

