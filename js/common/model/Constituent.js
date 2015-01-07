// Copyright 2002-2014, University of Colorado Boulder

/**
 * Member in a compound, including the particle and its relative offset
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Particle' );

  /**
   * @param {Particle} particle
   * @param {Vector2D} relativePosition
   * @constructor
   */
  function Constituent( particle, relativePosition ) {
    //Relative location within the compound
    this.relativePosition = relativePosition;
    //Particle within the compound
    this.particle = particle;
  }

  return inherit( Particle, Constituent, {
  } );
} );
