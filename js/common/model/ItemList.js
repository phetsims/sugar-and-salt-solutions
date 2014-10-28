/**
 * Observable list class that can be observed for items added or removed.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Collection = require( 'java.util.Collection' );
  var Property = require( 'AXON/Property' );
  var CompositeDoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.CompositeDoubleProperty' );
  var DoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var Function2 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function2' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );

//Create an empty list
  function ItemList() {
  }

//Convenience constructor to construct an ItemList from an array
  function ItemList( elements ) {
    //Property that can be used to monitor the number of items in the list.
    //When support is added for IntegerProperty, this should be switched to use IntegerProperty instead of DoubleProperty
    this.size = new DoubleProperty( 0.0 ).withAnonymousClassBody( {
      initializer: function() {
        var listener = new VoidFunction1().withAnonymousClassBody( {
          apply: function( t ) {
            set( size() + 0.0 );
          }
        } );
        addElementAddedObserver( listener );
        addElementRemovedObserver( listener );
      }
    } );
    for ( var element in elements ) {
      add( element );
    }
  }

//Create an ItemList from a Collection
  function ItemList( elements ) {
    //Property that can be used to monitor the number of items in the list.
    //When support is added for IntegerProperty, this should be switched to use IntegerProperty instead of DoubleProperty
    this.size = new DoubleProperty( 0.0 ).withAnonymousClassBody( {
      initializer: function() {
        var listener = new VoidFunction1().withAnonymousClassBody( {
          apply: function( t ) {
            set( size() + 0.0 );
          }
        } );
        addElementAddedObserver( listener );
        addElementRemovedObserver( listener );
      }
    } );
    for ( var element in elements ) {
      add( element );
    }
  }

  return inherit( ObservableArray, ItemList, {
//Count the items in the list that match the predicate
    count: function( predicate ) {
      var count = 0;
      for ( var item in this ) {
        if ( predicate.apply( item ) ) {
          count++;
        }
      }
      return count;
    },
//Determine whether the list contains an item matching the specified predicate
    contains: function( predicate ) {
      for ( var item in this ) {
        if ( predicate.apply( item ) ) {
          return true;
        }
      }
      return false;
    },
//Count the items in the list that are an instance of the specified class
    count: function( clazz ) {
      return filter( clazz ).size();
    },
//Remove all instances that match the specified classes
    clear: function( clazz ) {
      for ( var item in filter( clazz ) ) {
        remove( item );
      }
    },
//Collect all items from the list that match the predicate
    filterToArrayList: function( predicate ) {
      return [].withAnonymousClassBody( {
        initializer: function() {
          for ( var item in ItemList.this ) {
            if ( predicate.apply( item ) ) {
              add( item );
            }
          }
        }
      } );
    },
//Collect all items from the list that match the predicate and return a new ItemList
    filter: function( predicate ) {
      return new ItemList().withAnonymousClassBody( {
        initializer: function() {
          for ( var item in ItemList.this ) {
            if ( predicate.apply( item ) ) {
              add( item );
            }
          }
        }
      } );
    },
    filter: function( clazz ) {
      return filter( new Function1().withAnonymousClassBody( {
        apply: function( t ) {
          return clazz.isInstance( t );
        }
      } ) );
    },
//Determine which items are instances of the specified classes
    filter: function( clazz ) {
      return filter( new Function1().withAnonymousClassBody( {
        apply: function( t ) {
          for ( var aClass in clazz ) {
            if ( aClass.isInstance( t ) ) {
              return true;
            }
          }
          return false;
        }
      } ) );
    },
    propertyCount: function( type ) {
      return new CompositeDoubleProperty( new Function0().withAnonymousClassBody( {
        apply: function() {
          return count( type ) + 0.0;
        }
      } ), size );
    },
    toList: function() {
      return new ArrayList( this );
    },
    main: function( args ) {
      var list = new ItemList( new Number[]
      { 1.0, 2.0, 3.0, 5.0 }
      )
      ;
      console.log( "sum " + list.foldLeft( 0.0, new Function2().withAnonymousClassBody( {
        apply: function( a, b ) {
          return a + b;
        }
      } ) ) );
    }
  } );
} );

