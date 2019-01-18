// Copyright 2014-2018, University of Colorado Boulder
/**
 * Color to show for the specified particle
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  class IonColor extends DerivedProperty {
    /**
     *
     * @param {MicroModel} microModel
     * @param {SphericalParticle} particle
     * @constructor
     */
    constructor( microModel, particle ) {
      super( [ microModel.showChargeColorProperty ], showChargeColor => {
        return showChargeColor ? particle.chargeColor : particle.color;
      } );
    }
  }

  return sugarAndSaltSolutions.register( 'IonColor', IonColor );
} );