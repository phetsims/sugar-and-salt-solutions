// Copyright 2014-2015, University of Colorado Boulder
/**
 * Constants for Salt and Sugar dispensers, to keep track of which one the user is using.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  function DispenserType() {
    //List of elements comprising the solute
    this.elementAtomicMasses = Array.prototype.slice.call( arguments, 0 );
  }

  return Object.freeze( {
    'SALT': new DispenserType( 11, 17 ),
    'SUGAR': new DispenserType( 6, 1, 8 ),
    'GLUCOSE': new DispenserType( 6, 1, 8 ),
    'SODIUM_NITRATE': new DispenserType( 11, 7, 8 ),
    'CALCIUM_CHLORIDE': new DispenserType( 20, 17 )
  } );

} );

