// Copyright 2015, University of Colorado Boulder
/**
 * This "map" utility supports HashMap like  functionality by allowing any object to be used as key.
 * Equality is by reference not by value
 *
 * TODO: If and when development resumes on this simulation, this Map function should be replaced with  native JS
 * implementation of Map, see https://github.com/phetsims/gene-expression-essentials/issues/63 for more information.
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
        this.values[ index ] = value;
      }
    },

    get: function( key ) {
      return this.values[ this.keys.indexOf( key ) ];
    },

    contains: function( key ) {
      return this.keys.indexOf( key ) !== -1;
    },

    remove: function( key ) {
      delete this.values[ this.keys.indexOf( key ) ];
      delete this.keys[ this.keys.indexOf( key ) ];
    },

    keySet: function() {
      return this.keys;
    },
    equals: function( obj ) {
      return _.isEqual( this, obj );
    },
    clear: function() {
      this.keys = [];
      this.values = [];
    }
  } );

} );