// Copyright 2002-2012, University of Colorado
/**
 * Member in a compound, including the particle and its relative offset
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Constituent( particle, relativePosition ) {
    //Relative location within the compound
    this.relativePosition;
    //Particle within the compound
    this.particle;
    this.relativePosition = relativePosition;
    this.particle = particle;
  }

  return inherit( Object, Constituent, {
  } );
} );

