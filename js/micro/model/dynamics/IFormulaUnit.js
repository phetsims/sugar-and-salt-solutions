// Copyright 2002-2011, University of Colorado
/**
 * Pair of matching particles that could potentially form a crystal together, if they are close enough together.  Order within the pair is irrelevant.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );


  return inherit( Object, IFormulaUnit, {
//Get the distance between the particles
    getDistance: function() {},
//Move the particles closer together at the free particle speed
    moveTogether: function( dt ) {},
//List all particles for purposes of iteration to add to a crystal
    getParticles: function() {}
  } );
} );

