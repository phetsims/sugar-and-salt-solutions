// Copyright 2002-2011, University of Colorado
/**
 * Shared configuration for changing colors in all tabs with a control in the developer menu
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Property = require( 'AXON/Property' );
  var white = require( 'java.awt.Color.white' );//static

//Background color for the sim when not set to white background.
//Color recommendation from KL so that white sugar and salt will show against it.  Same color as geometric optics background

  //private
  var background = new Color( 0, 51, 153 );

  return inherit( Object, SugarAndSaltSolutionsColorScheme, {
  } );
} );

