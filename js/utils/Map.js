// Copyright 2002-2014, University of Colorado Boulder

/**
 *  This "map" utility supports HashMap like  functionality by allowing any object to be used as key.
 *
 *
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @returns {{put: put, get: get, contains: contains, keySet: keySet}}
   * @constructor
   */
  function Map() {
    //@private
    this.keys = [];
    //@private
    this.values = [];
  }

  return inherit( Object, Map, {
    put: function( key, value ) {
      var index = this.keys.indexOf( key );
      if ( index === -1 ) {
        this.keys.push( key );
        this.values.push( value );
      }
      else {
        this.values[index] = value;
      }
    },

    get: function( key ) {
      return this.values[this.keys.indexOf( key )];
    },

    contains: function( key ) {
      return this.keys.indexOf( key ) !== -1;
    },

    keySet: function() {
      return this.keys;
    },
    equals: function( obj ) {
      return _.isEqual( this, obj );
    }
  } );

} );