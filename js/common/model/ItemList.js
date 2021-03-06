// Copyright 2014-2018, University of Colorado Boulder
/**
 * Observable list class that can be observed for items added or removed.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @param {Array} elements
   * @constructor
   */
  function ItemList( elements ) {
    ObservableArray.call( this, elements || [] );
  }

  sugarAndSaltSolutions.register( 'ItemList', ItemList );

  return inherit( ObservableArray, ItemList, {
    /**
     * Count the items in the list that match the predicate
     * @param {function} predicate
     * @returns {number}
     */
    count: function( predicate ) {
      var countValue = 0;
      this.forEach( function( item ) {
        if ( predicate( item ) ) {
          countValue++;
        }
      } );
      return countValue;
    },

    /**
     * Determine whether the list contains an item matching the specified predicate
     * @param {function} predicate
     * @returns {boolean}
     */
    contains: function( predicate ) {

      if ( _.isFunction( predicate ) ) {
        this.forEach( function( item ) {

          if ( predicate( item ) ) {
            return true;
          }
        } );
        return false;
      }

      var item = predicate;
      return this.indexOf( item ) !== -1;

    },

    /**
     * Count the items in the list that are an instance of the specified class
     * @param {function.prototype.constructor} clazz
     * @returns {number}
     */
    countByClass: function( clazz ) {
      return this.filterByClass( clazz ).length;
    },

    /**
     * Remove all instances that match the specified classes
     * @param {function.prototype.constructor} clazz
     */
    clear: function( clazz ) {
      if ( !clazz ) {
        ObservableArray.prototype.clear.call( this );
        return;
      }
      var filteredItems = this.filterByClass( clazz );
      filteredItems.forEach( function( item ) {
        this.remove( item );
      } );
    },

    /**
     * Collect all items from the list that match the predicate and return a new ItemList
     * @param {function} predicate
     */
    filter: function( predicate ) {
      var itemList = new ItemList( [] );
      this.forEach( function( item ) {
        if ( predicate( item ) ) {
          itemList.add( item );
        }
      } );

      return itemList;
    },

    /**
     * @param {function.prototype.constructor} clazz
     * @returns {*}
     */
    filterByClass: function( clazz ) {
      return this.filter( function( item ) {
        return item instanceof clazz;
      } );
    },

    /**
     *
     * @param {prototype.constructor} type
     * @returns {DerivedProperty}
     */
    propertyCount: function( type ) {
      var self = this;
      return new DerivedProperty( [ this.lengthProperty ], function() {
        return self.countByClass( type ) | 0;//int
      } );
    },

    isEmpty: function() {
      return this.length === 0;
    }

  } );
} );


//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.util.ArrayList;
//import java.util.Collection;
//
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.doubleproperty.CompositeDoubleProperty;
//import edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty;
//import edu.colorado.phet.common.phetcommon.util.ObservableList;
//import edu.colorado.phet.common.phetcommon.util.function.Function0;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.util.function.Function2;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//
///**
// * Observable list class that can be observed for items added or removed.
// *
// * @author Sam Reid
// */
//public class ItemList<T> extends ObservableList<T> {
//
//    //Property that can be used to monitor the number of items in the list.
//    //When support is added for IntegerProperty, this should be switched to use IntegerProperty instead of DoubleProperty
//    public final ObservableProperty.<Double> size = new DoubleProperty( 0.0 ) {{
//        VoidFunction1<T> listener = new VoidFunction1<T>() {
//            public void apply( T t ) {
//                set( size() + 0.0 );
//            }
//        };
//        addElementAddedObserver( listener );
//        addElementRemovedObserver( listener );
//    }};
//
//    //Create an empty list
//    public ItemList() {
//    }
//
//    //Convenience constructor to construct an ItemList from an array
//    public ItemList( T[] elements ) {
//        for ( T element : elements ) {
//            add( element );
//        }
//    }
//
//    //Create an ItemList from a Collection
//    public ItemList( Collection<T> elements ) {
//        for ( T element : elements ) {
//            add( element );
//        }
//    }
//

//


//
//    //Collect all items from the list that match the predicate
//    public ArrayList<T> filterToArrayList( final Function1<T, Boolean> predicate ) {
//        return new ArrayList<T>() {{
//            for ( T item : ItemList.this ) {
//                if ( predicate.apply( item ) ) {
//                    add( item );
//                }
//            }
//        }};
//    }
//


//
//    public CompositeDoubleProperty propertyCount( final Class<? extends T> type ) {
//        return new CompositeDoubleProperty( new Function0<Double>() {
//            public Double apply() {
//                return count( type ) + 0.0;
//            }
//        }, size );
//    }
//
//    public ArrayList<T> toList() {
//        return new ArrayList<T>( this );
//    }
//
//    public static void main( String[] args ) {
//        ItemList<Double> list = new ItemList<Double>( new Double[] { 1.0, 2.0, 3.0, 5.0 } );
//        System.out.println( "sum " + list.foldLeft( 0.0, new Function2<Double, Double, Double>() {
//            public Double apply( Double a, Double b ) {
//                return a + b;
//            }
//        } ) );
//    }
//}
