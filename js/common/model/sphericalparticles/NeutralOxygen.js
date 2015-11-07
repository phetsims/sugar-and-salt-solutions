// Copyright 2014-2015, University of Colorado Boulder
/**
 * When participating in sucrose or glucose or other neutral crystals oxygen atoms should be shown as neutral
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Oxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Oxygen' );
  var ParticleColorConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/ParticleColorConstants' );

  /**
   * @constructor
   */
  function NeutralOxygen() {
    Oxygen.call( this, {
      chargeColor: ParticleColorConstants.NEUTRAL_COLOR
    } );
  }

  return inherit( Oxygen, NeutralOxygen, {

  } );

} );