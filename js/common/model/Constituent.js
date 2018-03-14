// Copyright 2014-2015, University of Colorado Boulder

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
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @param {Particle} particle
   * @param {Vector2} relativePosition
   * @constructor
   */
  function Constituent( particle, relativePosition ) {
    assert && assert( !isNaN( relativePosition.x ), 'x should be a number' );
    assert && assert( !isNaN( relativePosition.y ), 'y should be a number' );

    //Relative location within the compound
    this.relativePosition = relativePosition;
    //Particle within the compound
    this.particle = particle;
  }

  sugarAndSaltSolutions.register( 'Constituent', Constituent );

  return inherit( Particle, Constituent, {} );
} );
