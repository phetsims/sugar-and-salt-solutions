// Copyright 2002-2011, University of Colorado
/**
 * Represents a formula ratio for constructive units for crystals.  NaCl is 1Na + 1Cl, NaNO3 is 1Na + 1 NO3.  Sucrose crystals just have a repeating unit of 1 sucrose molecule.
 * CaCl2 is 2 Ca + 2 Cl.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var HashMap = require( 'java.util.HashMap' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Calcium' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Chloride' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Sodium' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/Sucrose' );
  var Glucose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/glucose/Glucose' );
  var Nitrate = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumnitrate/Nitrate' );

//Formulae used in Sugar and Salt Solutions
  var SODIUM_CHLORIDE = new Formula( Sodium.class, Chloride.class );
  var SUCROSE = new Formula( Sucrose.class );
  var GLUCOSE = new Formula( Glucose.class );
  var SODIUM_NITRATE = new Formula( Sodium.class, Nitrate.class );
//The formula for calcium chloride must return Calcium first, otherwise the crystal growing procedure can run into too many dead ends
  var CALCIUM_CHLORIDE = new Formula( Calcium.class, Chloride.class, 2 ).withAnonymousClassBody( {
    getTypes: function() {
      return [].withAnonymousClassBody( {
        initializer: function() {
          add( Calcium.class );
          add( Chloride.class );
        }
      } );
    }
  } );
//Convenience constructor for making a formula unit of 1:1
  function Formula( a, b ) {
    this.map;
    this( a, b, 1 );
  }

//Convenience constructor for making a formula unit of 1:N, as in CaCl2
  function Formula( a, b, bCount ) {
    this.map;
    this( new HashMap().withAnonymousClassBody( {
      initializer: function() {
        put( a, 1 );
        put( b, bCount );
      }
    } ) );
  }

//Convenience constructor for making a formula unit of 1 such as in Sucrose or Glucose
  function Formula( type ) {
    this.map;
    this( new HashMap().withAnonymousClassBody( {
      initializer: function() {
        put( type, 1 );
      }
    } ) );
  }

//Create a formula by giving an explicit map
  function Formula( map ) {
    this.map;
    this.map = map;
  }

  return inherit( Object, Formula, {
//List the different types used in the formula
      getTypes: function() {
        return new ArrayList( map.keySet() );
      },
//Determine the count for the building block of the specified type
      getFactor: function( type ) {
        return map.get( type );
      },
//Determine if this formula contains the specified type of particle
      contains: function( type ) {
        return getTypes().contains( type );
      },
//Duplicates classes according to the formula counts, to facilitate iteration
      getFormulaUnit: function() {
        var list = [];
        for ( var type in getTypes() ) {
          for ( var i = 0; i < getFactor( type ); i++ ) {
            list.add( type );
          }
        }
        return list;
      },
      toString: function() {
        return map.toString();
      },
//Auto-generated equality test
      equals: function( o ) {
        if ( this == o ) {
          return true;
        }
        if ( o == null || getClass() != o.getClass() ) {
          return false;
        }
        var formula = o;
        if ( !map.equals( formula.map ) ) {
          return false;
        }
        return true;
      },
//Auto-generated hashCode
      hashCode: function() {
        return map.hashCode();
      }
    },
//statics
    {
      SODIUM_CHLORIDE: SODIUM_CHLORIDE,
      SUCROSE: SUCROSE,
      GLUCOSE: GLUCOSE,
      SODIUM_NITRATE: SODIUM_NITRATE,
      CALCIUM_CHLORIDE: CALCIUM_CHLORIDE
    } );
} );

