// Copyright 2015-2018, University of Colorado Boulder

/**
 * A data structure for 2 related objects.
 *
 * @author Sharfudeen Ashraf (For Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @param {Object} _1
   * @param {Object} _2
   * @constructor
   */
  function Pair( _1, _2 ) {
    this._1 = _1;
    this._2 = _2;
  }

  sugarAndSaltSolutions.register( 'Pair', Pair );
  return inherit( Object, Pair, {
    equals: function( obj ) {
      return _.isEqual( this, obj );
    }
  } );
} );
