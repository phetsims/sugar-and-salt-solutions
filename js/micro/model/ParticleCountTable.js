// Copyright 2002-2011, University of Colorado
/**
 * To get the same ratio (100 g/1 L) of salt and sugar in the micro tab, use the number of particles in the ParticleCountTable

 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  var NUMBER_SOLUTE_FORMULAE = 10;
  var ParticleCountTable = {
    // The number of formula (such as NaCl or CaCl3) that the user can add to the solution,
    // chosen to be this value so that the user can only add 1.0 mol / L by default
    NUMBER_SOLUTE_FORMULAE: NUMBER_SOLUTE_FORMULAE,
    MAX_SODIUM_CHLORIDE: NUMBER_SOLUTE_FORMULAE,
    MAX_SODIUM_NITRATE: NUMBER_SOLUTE_FORMULAE,
    MAX_SUCROSE: NUMBER_SOLUTE_FORMULAE,
    MAX_GLUCOSE: NUMBER_SOLUTE_FORMULAE,
    MAX_CALCIUM_CHLORIDE: NUMBER_SOLUTE_FORMULAE
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( ParticleCountTable ); }

  return ParticleCountTable;
} );

