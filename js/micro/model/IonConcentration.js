// Copyright 2002-2011, University of Colorado
/**
 * Observable property that gives the concentration in mol/m^3 for specific dissolved components (such as Na+ or sucrose)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CompositeDoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.CompositeDoubleProperty' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var numberToMoles = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Units/numberToMoles' );//static

  function IonConcentration( microModel, type ) {
    CompositeDoubleProperty.call( this, new Function0().withAnonymousClassBody( {
      apply: function() {
        //If there is no water, there is no solution and hence no concentration
        return microModel.waterVolume.get() == 0 ? 0.0 : numberToMoles( microModel.freeParticles.count( type ) ) / microModel.waterVolume.get();
      }
    } ), microModel.waterVolume );
    var listener = new VoidFunction1().withAnonymousClassBody( {
      apply: function( particle ) {
        notifyIfChanged();
      }
    } );
    microModel.freeParticles.addElementAddedObserver( listener );
    microModel.freeParticles.addElementRemovedObserver( listener );
  }

  return inherit( CompositeDoubleProperty, IonConcentration, {
  } );
} );

