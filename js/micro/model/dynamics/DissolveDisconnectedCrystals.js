// Copyright 2002-2011, University of Colorado
/**
 * Workaround for completely dissolving any crystals that have become disconnected as a result of partial dissolving
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IdentityHashMap = require( 'java.util.IdentityHashMap' );
  var Logger = require( 'java.util.logging.Logger' );
  var LoggingUtils = require( 'edu.colorado.phet.common.phetcommon.util.logging.LoggingUtils' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );


  //private
  var LOGGER = LoggingUtils.getLogger( DissolveDisconnectedCrystals.class.getCanonicalName() );

  function DissolveDisconnectedCrystals( model ) {

    //private
    this.model;
    //Map that keeps track of the number of steps that a crystal has been identified as disconnected.  If it is disconnected too long, it will be completely dissolved.

    //private
    this.numberStepsDisconnected = new IdentityHashMap();
    this.model = model;
  }

  return inherit( Object, DissolveDisconnectedCrystals, {
//If any crystal has been disconnected too long, it will be completely dissolved
    apply: function( crystalItemList ) {
      for ( var crystal in crystalItemList.toList() ) {
        if ( crystal.isConnected() ) {
          //Clean up the map to prevent memory leak and reset for next time
          numberStepsDisconnected.remove( crystal );
        }
        else {
          //Increment the counts in the map
          var newCount = numberStepsDisconnected.containsKey( crystal ) ? numberStepsDisconnected.get( crystal ) + 1 : 1;
          numberStepsDisconnected.put( crystal, newCount );
          //If it has been disconnected for too long, dissolve it completely
          if ( newCount > 30 ) {
            LOGGER.fine( "Crystal disconnected for " + newCount + " steps, dissolving..." );
            new CrystalDissolve( model ).dissolve( crystal, crystal.getConstituents().toList() );
            crystalItemList.remove( crystal );
          }
        }
      }
      //Prevent memory leak
      if ( numberStepsDisconnected.keySet().size() > 100 ) {
        numberStepsDisconnected.clear();
      }
    }
  } );
} );

