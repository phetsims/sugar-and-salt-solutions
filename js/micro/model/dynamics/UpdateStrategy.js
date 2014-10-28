// Copyright 2002-2011, University of Colorado
/**
 * Strategy pattern for updating particles in their different states, such as "flowing toward drain", "random walk", "flowing out of drain", "dropping from the crystal shaker"
 * Using the strategy pattern here provides the following benefits:
 * 1. Modularize the code for updating particles, split into smaller files
 * 2. No particle can belong to two strategies
 * 3. A good place to store state for each particle (such as speed of flow to drain, etc)
 * <p/>
 * There are, however, the following disadvantages:
 * 1. More difficult to mix and match several facets of different behavior
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var Solution = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Solution' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );

//Speed at which freely moving particles should random walk
  var FREE_PARTICLE_SPEED = 6E-10;
//Particle mass, used in stepping forward in time according to newton's 2nd law.
//This number was obtained by guessing and checking to find a value that looked good for accelerating the particles out of the shaker
  var PARTICLE_MASS = 1E10;

  function UpdateStrategy( model ) {
    this.model;
    this.solution;
    this.waterVolume;
    this.model = model;
    solution = model.solution;
    waterVolume = model.waterVolume;
  }

  return inherit( Object, UpdateStrategy, {
      stepInTime: function( particle, dt ) {}
    },
//statics
    {
      FREE_PARTICLE_SPEED: FREE_PARTICLE_SPEED,
      PARTICLE_MASS: PARTICLE_MASS
    } );
} );

