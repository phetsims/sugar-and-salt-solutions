// Copyright 2015-2018, University of Colorado Boulder

/**
 * Utilities for creating random numbers
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  function RandomUtil() {}

  sugarAndSaltSolutions.register( 'RandomUtil', RandomUtil );
  return inherit( Object, RandomUtil, {},
    //static
    {
      randomAngle: function() {
        return Math.random() * 2 * Math.PI;
      },

      nextRandomSign: function() {
        var randomNumber = Math.random() >= 0.5;
        return randomNumber ? 1 : -1;
      }


    } );
} );
