// Copyright 2014-2015, University of Colorado Boulder
/**
 * Item that can be shown in the bar chart, along with concentration, color, caption and icon
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {SoluteConstituent} constituent
   * @param {string} caption
   * @param icon
   * @constructor
   */
  function BarItem( constituent, caption, icon ) {
    //The concentration to show on the bar chart should be the the display concentration instead of the true concentration because the value must be held constant when draining out the drain
    this.concentration = constituent.concentrationToDisplay;
    this.color = constituent.color;
    this.caption = caption;
    //Icons to be shown beneath the bar.  Functions are used to create new icons for each kit since giving
    // the same PNode multiple parents caused layout problems
    this.icon = icon;
  }

  sugarAndSaltSolutions.register( 'BarItem', BarItem );

  return inherit( Object, BarItem );

} );
