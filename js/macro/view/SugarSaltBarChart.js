// Copyright 2002-2011, University of Colorado
/**
 * This bar chart shows the concentrations for both salt and sugar (if any)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SettableProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.SettableProperty' );
  var None = require( 'edu.colorado.phet.common.phetcommon.util.Option.None' );
  var Bar = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/barchart/Bar' );
  var ConcentrationBarChart = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/barchart/ConcentrationBarChart' );
  var Node = require( 'SCENERY/nodes/Node' );
  var property = require( 'edu.colorado.phet.common.phetcommon.model.property.Property.property' );//static
  var SALT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/SALT' );//static
  var SUGAR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/SUGAR' );//static
  var white = require( 'java.awt.Color.white' );//static

  function SugarSaltBarChart( saltConcentration, sugarConcentration, showValues, visible, scaleFactor ) {
    ConcentrationBarChart.call( this, showValues, visible, 0, true );
    //Convert from model units (Mols) to stage units by multiplying by this scale factor
    var verticalAxisScale = 160 * 1E-4 * scaleFactor;
    //Add a Salt concentration bar
    addChild( new Bar( property( white ), SALT, new None(), saltConcentration, showValues, verticalAxisScale, false ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( background.getFullBounds().getWidth() * 0.25 - WIDTH / 2, abscissaY );
      }
    } ) );
    //Add a Sugar concentration bar
    addChild( new Bar( property( white ), SUGAR, new None(), sugarConcentration, showValues, verticalAxisScale, false ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( background.getFullBounds().getWidth() * 0.75 - WIDTH / 2, abscissaY );
      }
    } ) );
  }

  return inherit( ConcentrationBarChart, SugarSaltBarChart, {
  } );
} );

