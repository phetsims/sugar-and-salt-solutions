// Copyright 2002-2013, University of Colorado Boulder
/**
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  //constants
  var DEBUG_LOG = false;

  /**
   * @constructor
   */
  function Logger() {
  }

  return inherit( Object, Logger, {},
    //static
    {
      fine: function( stat ) {
        if ( DEBUG_LOG ) {
          console.log( stat );
        }
      }

    } );
} );