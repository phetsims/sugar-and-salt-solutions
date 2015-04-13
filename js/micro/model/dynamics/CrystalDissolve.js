// Copyright 2002-2014, University of Colorado Boulder
/**
 * This strategy dissolves crystals incrementally so that the concentration will be below or near the saturation point.
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var FreeParticleStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/FreeParticleStrategy' );
  var DynamicsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DynamicsConstants' );

  /**
   *
   * @param {MicroModel} model
   * @constructor
   */
  function CrystalDissolve( model ) {
    this.model = model;

    //@private Debugging tool to visualize the dissolving process
    this.lastDissolve = new Date().getTime();
  }

  return inherit( Object, CrystalDissolve, {

    /**
     * Dissolve the lattice incrementally so that we get as close as possible to the saturation point
     * This  is a overloaded function
     * if the arguments count is  2, we consider args[0] to be {Crystal} crystal and args[1] to be elementsToDissolve
     * if the arguments count is  3, we consider args[0] to be {ItemList} crystals and args[1]
     * to be {Crystal} crystal and args[2] to be {Property} saturated
     */
    dissolve: function() {
      var args = Array.prototype.slice.call( arguments );
      if ( args.length === 2 ) {
        return this.incrementalDissolve( args[ 0 ], args[ 1 ] );
      }

      var crystals = args[ 0 ];
      var crystal = args[ 1 ];
      var saturated = args[ 2 ];
      //For some unknown reason, limiting this to one dissolve element per step fixes bugs in dissolving the lattices
      //Without this limit, crystals do not dissolve when they should
      while ( !saturated.get() && crystal.numberConstituents() > 0 && new Date().getTime() -
                                                                      this.lastDissolve > 2 && !this.model.isWaterBelowCrystalThreshold() ) {
        this.lastDissolve = new Date().getTime();
        var toDissolve = crystal.getConstituentsToDissolve( this.model.solution.shape.get().bounds );
        if ( toDissolve.length ) {
          this.dissolve( crystal, toDissolve );
        }
      }

      //If the crystal has only one constituent, then dissolve it and remove the crystal.
      //Note that this is the only place in the code where crystals are reduced, so as long as crystals are always created with 2
      //or more constituents,
      //this will guarantee that there are never any 1-particle crystals.
      //1-particle crystals should be avoided because it is unrealistic for an ion to hang out by itself in solid form;
      // you need both an Na and a Cl to make a salt grain
      if ( crystal.numberConstituents() === 1 ) {
        this.removeConstituent( crystal, crystal.getConstituent( 0 ) );
      }

      //Remove the crystal from the list so it will no longer keep its constituents together
      if ( crystal.numberConstituents() === 0 ) {
        crystals.remove( crystal );
      }
    },

    /**
     * Dissolve all specified elements from the crystal, used in incremental dissolving and the complete workaround
     * dissolving by DissolveDisconnectedCrystals
     * @param {Crystal} crystal
     * @param {Array<Constituent>} elementsToDissolve
     */
    incrementalDissolve: function( crystal, elementsToDissolve ) {
      var self = this;
      _.each( elementsToDissolve, function( constituent ) {
        self.removeConstituent( crystal, constituent );
      } );
    },

    /**
     * @private
     * Remove the specified constituent from the containing crystal, by dissolving it off
     * @param {Crystal} crystal
     * @param {Constituent} constituent
     */
    removeConstituent: function( crystal, constituent ) {

      //If the particle is above the water when dissolved off the crystal, then make sure it starts moving downward,
      //otherwise it will "jump" into the air above the beaker
      var particleAboveWater = constituent.particle.getShape().bounds.getMaxY() >
                               this.model.solution.shape.get().bounds.getMaxY();
      var velocityAngle = particleAboveWater ? 0 : Math.random() * Math.PI * 2;
      var velocity = new Vector2( 0, -1 ).times( DynamicsConstants.FREE_PARTICLE_SPEED ).rotated( velocityAngle );
      constituent.particle.velocity.set( velocity );

      //Remove the constituent from the crystal and instead make it move under a random walk
      crystal.removeConstituent( constituent );
      this.model.freeParticles.add( constituent.particle );
      constituent.particle.setUpdateStrategy( new FreeParticleStrategy( this.model ) );
    }


  } );


} );


//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics;
//
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.util.Option;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Constituent;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Crystal;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ItemList;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroModel;
//
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.UpdateStrategy.FREE_PARTICLE_SPEED;
//import static java.lang.Math.PI;
//import static java.lang.Math.random;
//
///**
// * This strategy dissolves crystals incrementally so that the concentration will be below or near the saturation point.
// *
// * @author Sam Reid
// */
//public class CrystalDissolve<T extends Particle> {
//
//    //Debugging tool to visualize the dissolving process
//    private long lastDissolve = System.currentTimeMillis();
//
//    private final MicroModel model;
//
//    public CrystalDissolve( MicroModel model ) {
//        this.model = model;
//    }
//
//    //Dissolve the lattice incrementally so that we get as close as possible to the saturation point
//    public void dissolve( ItemList<Crystal<T>> crystals, final Crystal<T> crystal, ObservableProperty<Boolean> saturated ) {
//        while ( !saturated.get() && crystal.numberConstituents() > 0
//
//                //For some unknown reason, limiting this to one dissolve element per step fixes bugs in dissolving the lattices
//                //Without this limit, crystals do not dissolve when they should
//                && System.currentTimeMillis() - lastDissolve > 2 && !model.isWaterBelowCrystalThreshold() ) {
//            lastDissolve = System.currentTimeMillis();
//            Option<ArrayList<Constituent<T>>> toDissolve = crystal.getConstituentsToDissolve( model.solution.shape.get().getBounds2D() );
//            if ( toDissolve.isSome() ) {
//                dissolve( crystal, toDissolve.get() );
//            }
//        }
//
//        //If the crystal has only one constituent, then dissolve it and remove the crystal.
//        //Note that this is the only place in the code where crystals are reduced, so as long as crystals are always created with 2 or more constituents,
//        //this will guarantee that there are never any 1-particle crystals.
//        //1-particle crystals should be avoided because it is unrealistic for an ion to hang out by itself in solid form; you need both an Na and a Cl to make a salt grain
//        if ( crystal.numberConstituents() == 1 ) {
//            removeConstituent( crystal, crystal.getConstituent( 0 ) );
//        }
//
//        //Remove the crystal from the list so it will no longer keep its constituents together
//        if ( crystal.numberConstituents() == 0 ) {
//            crystals.remove( crystal );
//        }
//    }
//
//    //Dissolve all specified elements from the crystal, used in incremental dissolving and the complete workaround dissolving by DissolveDisconnectedCrystals
//    public void dissolve( Crystal<T> crystal, ArrayList<Constituent<T>> elementsToDissolve ) {
//        for ( Constituent<T> constituent : elementsToDissolve ) {
//            removeConstituent( crystal, constituent );
//        }
//    }
//
//    //Remove the specified constituent from the containing crystal, by dissolving it off
//    private void removeConstituent( Crystal<T> crystal, Constituent<T> constituent ) {
//
//        //If the particle is above the water when dissolved off the crystal, then make sure it starts moving downward, otherwise it will "jump" into the air above the beaker
//        boolean particleAboveWater = constituent.particle.getShape().getBounds2D().getMaxY() > model.solution.shape.get().getBounds2D().getMaxY();
//        double velocityAngle = particleAboveWater ? 0 : random() * PI * 2;
//        Vector2D velocity = new Vector2D( 0, -1 ).times( FREE_PARTICLE_SPEED ).getRotatedInstance( velocityAngle );
//        constituent.particle.velocity.set( velocity );
//
//        //Remove the constituent from the crystal and instead make it move under a random walk
//        crystal.removeConstituent( constituent );
//        model.freeParticles.add( constituent.particle );
//        constituent.particle.setUpdateStrategy( new FreeParticleStrategy( model ) );
//    }
//}
