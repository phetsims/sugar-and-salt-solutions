// Copyright 2002-2011, University of Colorado
/**
 * Keep track of how many moles of crystal are in the air, since we need to prevent user from adding more than 10 moles to the system
 * That is, we need to shut off salt/sugar when there is salt/sugar in the air that could get added to the solution
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var CompositeDoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.CompositeDoubleProperty' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var MacroCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroCrystal' );

  function AirborneCrystalMoles( list ) {
    CompositeDoubleProperty.call( this, new Function0().withAnonymousClassBody( {
      apply: function() {
        //Sum up the total amount of moles of crystals that are in the air
        var sum = 0;
        for ( var crystal in list ) {
          // count toward the amount in the play area since they could get added to the solution
          if ( crystal.position.get().getY() >= 0 ) {
            sum += crystal.getMoles();
          }
        }
        return sum;
      }
    } ) );
  }

  return inherit( CompositeDoubleProperty, AirborneCrystalMoles, {
  } );
} );

