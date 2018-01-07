// Copyright 2014-2017, University of Colorado Boulder
/**
 * Property that identifies the number of molecules in crystal form, for making sure the user doesn't exceed the allowed maximum
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
   * @param {ItemList} crystals
   * @constructor
   */
  function CrystalMoleculeCount( crystals ) {
    DerivedProperty.call( this, [ crystals.lengthProperty ], function() {
      // When the number of crystals changes, update the number of constituents in the crystals
      // This watches the number of crystals but not the number of constituents in each crystal, but this hasn't
      // caused any known problems so far
      var count = 0;
      crystals.forEach( function( crystal ) {
        count = count + crystal.numberConstituents();
      } );

      return count | 0; // int

    } );

  }

  return inherit( DerivedProperty, CrystalMoleculeCount );
} );
// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.micro.model;
//
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.SimpleObserver;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Crystal;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ItemList;
//
///**
// * Property that identifies the number of molecules in crystal form, for making sure the user doesn't exceed the allowed maximum
// * Should be rewritten with Property<Integer> but there is currently no good compositional support for it (using plus(), greaterThan(), etc)
// *
// * @author Sam Reid
// */
//public class CrystalMoleculeCount<T extends Crystal<?>> extends Property<Double> {
//    public CrystalMoleculeCount( final ItemList<T> crystals ) {
//        super( 0.0 );
//
//        //When the number of crystals changes, update the number of constituents in the crystals
//        //This watches the number of crystals but not the number of constituents in each crystal, but this hasn't caused any known problems so far
//        crystals.size.addObserver( new SimpleObserver() {
//            public void update() {
//                int count = 0;
//                for ( T crystal : crystals ) {
//                    count = count + crystal.numberConstituents();
//                }
//                set( count + 0.0 );
//            }
//        } );
//    }
//}
