// Copyright 2002-2014, University of Colorado Boulder

/**
 * Abstract class since oxygen ions and oxygen in sucrose/glucose must have different colors
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


  /**
   * @param options (or empty) // for use by clients that need to support other partial charge models.
   * @constructor
   */
  function Oxygen( options ) {

    options = _.defaults( options || {}, {
      radius: 73,
      atomColor: ParticleColorConstants.RED_COLORBLIND,
      charge: -2
    } );

    SphericalParticle.call( this, options );
  }

  return inherit( SphericalParticle, Oxygen, {

  } );

} );