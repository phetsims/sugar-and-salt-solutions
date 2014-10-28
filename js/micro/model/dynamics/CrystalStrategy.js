// Copyright 2002-2012, University of Colorado
/**
 * Update the crystals by moving them about and possibly dissolving them
 * Dissolve the crystals if they are below the saturation points
 * In CaCl2, the factor of 2 accounts for the fact that CaCl2 needs 2 Cl- for every 1 Ca2+
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );

  function CrystalStrategy( model, crystals, saturated ) {
    //Strategy rule to use for dissolving the crystals
    this.crystalDissolve;

    //private
    this.crystals;

    //private
    this.saturated;
    UpdateStrategy.call( this, model );
    this.crystals = crystals;
    this.saturated = saturated;
    crystalDissolve = new CrystalDissolve( model );
  }

  return inherit( UpdateStrategy, CrystalStrategy, {
    stepInTime: function( particle, dt ) {
      var crystal = particle;
      //If the crystal has ever gone underwater, set a flag so that it can be kept from leaving the top of the water
      if ( solution.shape.get().contains( crystal.getShape().getBounds2D() ) ) {
        crystal.setSubmerged();
      }
      //Cache the value to improve performance by 30% when number of particles is large
      var anyPartUnderwater = model.isAnyPartUnderwater( crystal );
      //If any part touched the water, the lattice should slow down and move at a constant speed
      if ( anyPartUnderwater ) {
        crystal.velocity.set( new Vector2( 0, -1 ).times( 0.25E-9 ) );
      }
      //Collide with the bottom of the beaker before doing underwater check so that crystals will dissolve
      model.boundToBeakerBottom( crystal );
      //If completely underwater, lattice should prepare to dissolve
      if ( !crystal.isUnderwaterTimeRecorded() && !model.isCrystalTotallyAboveTheWater( crystal ) ) {
        crystal.setUnderwater( model.getTime() );
      }
      //This number was obtained by guessing and checking to find a value that looked good for accelerating the particles out of the shaker
      var mass = 1E10;
      crystal.stepInTime( model.getExternalForce( anyPartUnderwater ).times( 1.0 / mass ), dt );
      //Collide with the bottom of the beaker
      model.boundToBeakerBottom( crystal );
      var dissolve = false;
      //Determine whether it is time for the lattice to dissolve
      if ( crystal.isUnderwaterTimeRecorded() ) {
        var timeUnderwater = model.getTime() - crystal.getUnderWaterTime();
        //Make sure it has been underwater for a certain period of time (in seconds)
        if ( timeUnderwater > 0.5 ) {
          dissolve = true;
        }
      }
      //Keep the particle within the beaker solution bounds
      model.preventFromLeavingBeaker( crystal );
      //for "no dissolving while evaporating" workaround, only apply the workaround if concentration is above the saturation point.  This will allow newly dropped crystals to dissolve instead of staying crystallized.
      var evaporationAndConcentrationAllowsDissolve = model.evaporationRate.get() > 0 && saturated.get();
      if ( dissolve || evaporationAndConcentrationAllowsDissolve ) {
        crystalDissolve.dissolve( crystals, crystal, saturated );
      }
    }
  } );
} );

