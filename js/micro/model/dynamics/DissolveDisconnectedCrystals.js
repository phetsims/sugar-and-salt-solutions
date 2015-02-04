//  Copyright 2002-2014, University of Colorado Boulder
/**
 *
 * Workaround for completely dissolving any crystals that have become disconnected as a result of partial dissolving
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Map = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/Map' );
  var Logger = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/Logger' );
  var CrystalDissolve = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystalDissolve' );

  /**
   *
   * @param {MicroModel} model
   * @constructor
   */
  function DissolveDisconnectedCrystals( model ) {
    this.model = model;
    //Map that keeps track of the number of steps that a crystal has been identified as disconnected.If it is
    //disconnected too long, it will be completely dissolved.
    this.numberStepsDisconnected = new Map(); // {key:Crystal, value:Integer>}
  }

  return inherit( Object, DissolveDisconnectedCrystals, {

    /**
     * If any crystal has been disconnected too long, it will be completely dissolved
     * @param {ItemList}
     */
    apply: function( crystalItemList ) {
      var self = this;
      _.each( crystalItemList.getArray(), function( crystal ) {
        if ( crystal.isConnected() ) {
          //Clean up the map to prevent memory leak and reset for next time
          self.numberStepsDisconnected.remove( crystal );
        }
        else {

          //Increment the counts in the map
          var newCount = self.numberStepsDisconnected.contains( crystal ) ? self.numberStepsDisconnected.get( crystal ) + 1 : 1;
          self.put( crystal, newCount );

          //If it has been disconnected for too long, dissolve it completely
          if ( newCount > 30 ) {
            Logger.fine( "Crystal disconnected for " + newCount + " steps, dissolving..." );
            new CrystalDissolve( self.model ).dissolve( crystal, crystal.getConstituents() );
            crystalItemList.remove( crystal );
          }
        }
      } );

      //Prevent memory leak
      if ( self.numberStepsDisconnected.keySet().length > 100 ) {
        self.numberStepsDisconnected.clear();
      }
    }

  } );
} );
//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics;
//
//import java.util.IdentityHashMap;
//import java.util.logging.Logger;
//
//import edu.colorado.phet.common.phetcommon.util.logging.LoggingUtils;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Crystal;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ItemList;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroModel;
//
///**
// * Workaround for completely dissolving any crystals that have become disconnected as a result of partial dissolving
// *
// * @author Sam Reid
// */
//public class DissolveDisconnectedCrystals {
//    private final MicroModel model;
//
//    //Map that keeps track of the number of steps that a crystal has been identified as disconnected.  If it is disconnected too long, it will be completely dissolved.
//    private final IdentityHashMap<Crystal, Integer> numberStepsDisconnected = new IdentityHashMap<Crystal, Integer>();
//
//    private static final Logger LOGGER = LoggingUtils.getLogger( DissolveDisconnectedCrystals.class.getCanonicalName() );
//
//    public DissolveDisconnectedCrystals( MicroModel model ) {
//        this.model = model;
//    }
//
//    //If any crystal has been disconnected too long, it will be completely dissolved
//    public <T extends Particle, U extends Crystal<T>> void apply( ItemList<U> crystalItemList ) {
//        for ( Crystal<T> crystal : crystalItemList.toList() ) {
//
//            if ( crystal.isConnected() ) {
//
//                //Clean up the map to prevent memory leak and reset for next time
//                numberStepsDisconnected.remove( crystal );
//            }
//            else {
//
//                //Increment the counts in the map
//                final int newCount = numberStepsDisconnected.containsKey( crystal ) ? numberStepsDisconnected.get( crystal ) + 1 : 1;
//                numberStepsDisconnected.put( crystal, newCount );
//
//                //If it has been disconnected for too long, dissolve it completely
//                if ( newCount > 30 ) {
//                    LOGGER.fine( "Crystal disconnected for " + newCount + " steps, dissolving..." );
//                    new CrystalDissolve<T>( model ).dissolve( crystal, crystal.getConstituents().toList() );
//                    crystalItemList.remove( crystal );
//                }
//            }
//        }
//
//        //Prevent memory leak
//        if ( numberStepsDisconnected.keySet().size() > 100 ) {
//            numberStepsDisconnected.clear();
//        }
//    }
//}
