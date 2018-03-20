// Copyright 2014-2018, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  var SugarAndSaltSolutionsSharedProperties = {
    sizeScale: new Property( 1 )
  };
  sugarAndSaltSolutions.register( 'SugarAndSaltSolutionsSharedProperties', SugarAndSaltSolutionsSharedProperties );
  return SugarAndSaltSolutionsSharedProperties;
} );