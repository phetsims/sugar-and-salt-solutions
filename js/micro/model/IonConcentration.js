// Copyright 2014-2018, University of Colorado Boulder
/**
 * Observable property that gives the concentration in mol/m^3 for specific dissolved
 * components (such as Na+ or sucrose)
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  const Units = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Units' );

  class IonConcentration extends DerivedProperty {

    /**
     * @param {MicroModel} microModel
     * @param {prototype.constructor} type
     *
     * @constructor
     */
    constructor( microModel, type ) {
      super( [ microModel.waterVolumeProperty ], function() {
        //If there is no water, there is no solution and hence no concentration
        return microModel.waterVolumeProperty.get() === 0 ? 0.0 :
               Units.numberToMoles( microModel.freeParticles.countByClass( type ) ) / microModel.waterVolumeProperty.get();
      } );

      const listener = particle => this.notifyListenersStatic();

      microModel.freeParticles.addItemAddedListener( listener );
      microModel.freeParticles.removeItemAddedListener( listener );
    }
  }

  return sugarAndSaltSolutions.register( 'IonConcentration', IonConcentration );
} );

