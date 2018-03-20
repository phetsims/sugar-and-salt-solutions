// Copyright 2015-2018, University of Colorado Boulder

/**
 * Constants related dynamics
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  var DynamicsConstants = {
    FREE_PARTICLE_SPEED: 6E-10,//Speed at which freely moving particles should random walk

    //Particle mass, used in stepping forward in time according to newton's 2nd law.
    //This number was obtained by guessing and checking to find a value that looked good for accelerating the
    // particles out of the shaker
    PARTICLE_MASS: 1E10
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( DynamicsConstants ); }

  sugarAndSaltSolutions.register( 'DynamicsConstants', DynamicsConstants );

  return DynamicsConstants;

} );