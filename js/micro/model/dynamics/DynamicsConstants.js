// Copyright 2002-2014, University of Colorado Boulder

/**
 * Constants related dynamics
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  var DynamicsConstants = {
    FREE_PARTICLE_SPEED: 6E-10,//Speed at which freely moving particles should random walk

    //Particle mass, used in stepping forward in time according to newton's 2nd law.
    //This number was obtained by guessing and checking to find a value that looked good for accelerating the
    // particles out of the shaker
    PARTICLE_MASS: 1E10
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( DynamicsConstants ); }

  return DynamicsConstants;

} );