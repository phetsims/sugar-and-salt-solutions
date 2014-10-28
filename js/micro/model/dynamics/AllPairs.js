// Copyright 2002-2011, University of Colorado
/**
 * List containing all pairs of particles that could be used to seed a crystal
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );

  function AllPairs( freeParticles, typeA, typeB ) {
    var aList = freeParticles.filter( typeA );
    var bList = freeParticles.filter( typeB );
    for ( var a in bList ) {
      for ( var b in aList ) {
        //Check for equality in case typeA==typeB, as in the case of Sucrose
        if ( a != b ) {
          add( new FormulaUnit( a, b ) );
        }
      }
    }
  }

  return inherit( ArrayList, AllPairs, {
  } );
} );

