// Copyright 2014-2015, University of Colorado Boulder
/**
 * Observable property that gives the concentration in mol/m^3 for specific dissolved
 * components (such as Na+ or sucrose)
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Units = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Units' );

  /**
   *
   * @param {MicroModel} microModel
   * @param {prototype.constructor} type
   *
   * @constructor
   */
  function IonConcentration( microModel, type ) {
    var self = this;
    DerivedProperty.call( self, [ microModel.waterVolume ], function() {
      //If there is no water, there is no solution and hence no concentration
      return microModel.waterVolume.get() === 0 ? 0.0 :
             Units.numberToMoles( microModel.freeParticles.countByClass( type ) ) / microModel.waterVolume.get();
    } );

    var listener = function( particle ) {
      self.notifyObserversStatic();
    };

    microModel.freeParticles.addItemAddedListener( listener );
    microModel.freeParticles.removeItemAddedListener( listener );

  }

  return inherit( DerivedProperty, IonConcentration );
} );

