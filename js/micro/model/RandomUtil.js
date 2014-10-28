// Copyright 2002-2011, University of Colorado
/**
 * Utilities for creating random numbers
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var random = require( 'java.lang.Math.random' );//static


  return inherit( Object, RandomUtil, {
    randomAngle: function() {
      return random() * 2 * Math.PI;
    }
  } );
} );

