// Copyright 2014-2018, University of Colorado Boulder

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
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ParticleColorConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/ParticleColorConstants' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/SphericalParticle' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @param {Object} [options] for use by clients that need to support other partial charge models.
   * @constructor
   */
  function Carbon( options ) {

    options = _.defaults( options || {}, {
      radius: 77,
      chargeColor: ParticleColorConstants.NEUTRAL_COLOR,
      atomColor: Color.GRAY,
      charge: 0
    } );

    SphericalParticle.call( this, options );
  }

  sugarAndSaltSolutions.register( 'Carbon', Carbon );

  return inherit( SphericalParticle, Carbon, {} );

} );