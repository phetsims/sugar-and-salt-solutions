// Copyright 2002-2012, University of Colorado
/**
 * This strategy dissolves crystals incrementally so that the concentration will be below or near the saturation point.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Option = require( 'edu.colorado.phet.common.phetcommon.util.Option' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var FREE_PARTICLE_SPEED = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/UpdateStrategy/FREE_PARTICLE_SPEED' );//static
  var PI = require( 'java.lang.Math.PI' );//static
  var random = require( 'java.lang.Math.random' );//static

  function CrystalDissolve( model ) {
    //Debugging tool to visualize the dissolving process

    //private
    this.lastDissolve = System.currentTimeMillis();

    //private
    this.model;
    this.model = model;
  }

  return inherit( Object, CrystalDissolve, {
//Dissolve the lattice incrementally so that we get as close as possible to the saturation point
    dissolve: function( crystals, crystal, saturated ) {
      while ( !saturated.get() && crystal.numberConstituents() > 0 && //Without this limit, crystals do not dissolve when they should
              System.currentTimeMillis() - lastDissolve > 2 && !model.isWaterBelowCrystalThreshold() ) {
        lastDissolve = System.currentTimeMillis();
        var toDissolve = crystal.getConstituentsToDissolve( model.solution.shape.get().getBounds2D() );
        if ( toDissolve.isSome() ) {
          dissolve( crystal, toDissolve.get() );
        }
      }
      //1-particle crystals should be avoided because it is unrealistic for an ion to hang out by itself in solid form; you need both an Na and a Cl to make a salt grain
      if ( crystal.numberConstituents() == 1 ) {
        removeConstituent( crystal, crystal.getConstituent( 0 ) );
      }
      //Remove the crystal from the list so it will no longer keep its constituents together
      if ( crystal.numberConstituents() == 0 ) {
        crystals.remove( crystal );
      }
    },
//Dissolve all specified elements from the crystal, used in incremental dissolving and the complete workaround dissolving by DissolveDisconnectedCrystals
    dissolve: function( crystal, elementsToDissolve ) {
      for ( var constituent in elementsToDissolve ) {
        removeConstituent( crystal, constituent );
      }
    },
//Remove the specified constituent from the containing crystal, by dissolving it off

    //private
    removeConstituent: function( crystal, constituent ) {
      //If the particle is above the water when dissolved off the crystal, then make sure it starts moving downward, otherwise it will "jump" into the air above the beaker
      var particleAboveWater = constituent.particle.getShape().getBounds2D().getMaxY() > model.solution.shape.get().getBounds2D().getMaxY();
      var velocityAngle = particleAboveWater ? 0 : random() * PI * 2;
      var velocity = new Vector2( 0, -1 ).times( FREE_PARTICLE_SPEED ).getRotatedInstance( velocityAngle );
      constituent.particle.velocity.set( velocity );
      //Remove the constituent from the crystal and instead make it move under a random walk
      crystal.removeConstituent( constituent );
      model.freeParticles.add( constituent.particle );
      constituent.particle.setUpdateStrategy( new FreeParticleStrategy( model ) );
    }
  } );
} );

