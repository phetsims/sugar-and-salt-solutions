// Copyright 2014-2015, University of Colorado Boulder
/**
 * Color to show for the specified particle
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {MicroModel} microModel
   * @param {SphericalParticle} particle
   * @constructor
   */
  function IonColor( microModel, particle ) {
    DerivedProperty.call( this, [ microModel.showChargeColor ], function( showChargeColor ) {
      return showChargeColor ? particle.chargeColor : particle.color;
    } );
  }

  return inherit( DerivedProperty, IonColor );
} );

