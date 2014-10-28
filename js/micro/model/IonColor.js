// Copyright 2002-2011, University of Colorado
/**
 * Color to show for the specified particle
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var IfElse = require( 'edu.colorado.phet.common.phetcommon.model.property.IfElse' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );

  function IonColor( microModel, particle ) {
    IfElse.call( this, microModel.showChargeColor, particle.chargeColor, particle.color );
  }

  return inherit( IfElse, IonColor, {
  } );
} );

