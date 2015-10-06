// Copyright 2002-2014, University of Colorado Boulder

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

  /**
   * @param {Object} _1
   * @param {Object} _2
   * @constructor
   */
  function Pair( _1, _2 ) {
    this._1 = _1;
    this._2 = _2;
  }
  return inherit( Object, Pair, {
    equals: function( obj ) {
      return _.isEqual( this, obj );
    }
  } );
} );
