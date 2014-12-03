// Copyright 2002-2014, University of Colorado Boulder

/**
 * These classes contains state information for particular  particles and
 * ions and permit matching in MicroModel for particle counting.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ParticleColorConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/ParticleColorConstants' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/SphericalParticle' );
  var Color = require( 'SCENERY/util/Color' );

  /**
   * @constructor
   */
  function Chloride() {

    var options = {
      radius: 181,
      chargeColor: ParticleColorConstants.NEGATIVE_COLOR,
      atomColor: Color.GREEN,
      charge: -1
    };

    SphericalParticle.call( this, options );
  }

  return inherit( SphericalParticle, Chloride, {

  } );

} );