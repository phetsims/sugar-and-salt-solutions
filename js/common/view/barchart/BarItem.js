// Copyright 2002-2011, University of Colorado
/**
 * Item that can be shown in the bar chart, along with concentration, color, caption and icon
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Property = require( 'AXON/Property' );
  var Option = require( 'edu.colorado.phet.common.phetcommon.util.Option' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var SoluteConstituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/SoluteConstituent' );
  var Node = require( 'SCENERY/nodes/Node' );

  function BarItem( constituent, caption, icon ) {
    this.concentration;
    this.color;
    this.caption;
    //Icons to be shown beneath the bar.  Functions are used to create new icons for each kit since giving the same PNode multiple parents caused layout problems
    this.icon;
    //The concentration to show on the bar chart should be the the display concentration instead of the true concentration because the value must be held constant when draining out the drain
    this.concentration = constituent.concentrationToDisplay;
    this.color = constituent.color;
    this.caption = caption;
    this.icon = icon;
  }

  return inherit( Object, BarItem, {
  } );
} );

