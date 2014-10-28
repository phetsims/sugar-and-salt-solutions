// Copyright 2002-2011, University of Colorado
/**
 * Enum pattern for Salt and Sugar dispensers, to keep track of which one the user is using.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  var SALT = new DispenserType( 11, 17 );
  var SUGAR = new DispenserType( 6, 1, 8 );
  var GLUCOSE = new DispenserType( 6, 1, 8 );
  var SODIUM_NITRATE = new DispenserType( 11, 7, 8 );
  var CALCIUM_CHLORIDE = new DispenserType( 20, 17 );
//Enum pattern, so no other instances should be created

  //private
  function DispenserType( elementAtomicMasses ) {
    //List of elements comprising the solute

    //private
    this.elementAtomicMasses;
    this.elementAtomicMasses = elementAtomicMasses;
  }

  return inherit( Object, DispenserType, {
      getElementAtomicMasses: function() {
        return elementAtomicMasses;
      }
    },
//statics
    {
      SALT: SALT,
      SUGAR: SUGAR,
      GLUCOSE: GLUCOSE,
      SODIUM_NITRATE: SODIUM_NITRATE,
      CALCIUM_CHLORIDE: CALCIUM_CHLORIDE
    } );
} );

