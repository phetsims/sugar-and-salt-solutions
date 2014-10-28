/**
 * To get the same ratio (100 g/1 L) of salt and sugar in the micro tab, use the number of particles in the ParticleCountTable
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

//The number of formula (such as NaCl or CaCl3) that the user can add to the solution, chosen to be this value so that the user can only add 1.0 mol / L by default

  //private
  var NUMBER_SOLUTE_FORMULAE = 10;
  var MAX_SODIUM_CHLORIDE = NUMBER_SOLUTE_FORMULAE;
  var MAX_SODIUM_NITRATE = NUMBER_SOLUTE_FORMULAE;
  var MAX_SUCROSE = NUMBER_SOLUTE_FORMULAE;
  var MAX_GLUCOSE = NUMBER_SOLUTE_FORMULAE;
  var MAX_CALCIUM_CHLORIDE = NUMBER_SOLUTE_FORMULAE;

  return inherit( Object, ParticleCountTable, {
    },
//statics
    {
      MAX_SODIUM_CHLORIDE: MAX_SODIUM_CHLORIDE,
      MAX_SODIUM_NITRATE: MAX_SODIUM_NITRATE,
      MAX_SUCROSE: MAX_SUCROSE,
      MAX_GLUCOSE: MAX_GLUCOSE,
      MAX_CALCIUM_CHLORIDE: MAX_CALCIUM_CHLORIDE
    } );
} );

