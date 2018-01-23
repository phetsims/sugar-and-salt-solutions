// Copyright 2014-2017, University of Colorado Boulder

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
   * @constructor
   */
  function Calcium() {

    //Calcium should be a dark green
    var options = {
      radius: 100,
      chargeColor: ParticleColorConstants.POSITIVE_COLOR,
      atomColor: new Color( 6, 98, 23 ),
      charge: 1
    };

    SphericalParticle.call( this, options );
  }

  sugarAndSaltSolutions.register( 'Calcium', Calcium );

  return inherit( SphericalParticle, Calcium, {} );

} );