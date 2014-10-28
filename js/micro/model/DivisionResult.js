// Copyright 2002-2011, University of Colorado
/**
 * Result of dividing int by int, which has an int quotient and int remainder.  This class was created to help compare crystals to the given formula ratios (such as CaCl2)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  function DivisionResult( numerator, denominator ) {
    this.quotient;
    this.remainder;
    this.quotient = numerator / denominator;
    this.remainder = numerator % denominator;
  }

  return inherit( Object, DivisionResult, {
//IDEA-generated equals
    equals: function( o ) {
      if ( this == o ) {
        return true;
      }
      if ( o == null || getClass() != o.getClass() ) {
        return false;
      }
      var that = o;
      return quotient == that.quotient && remainder == that.remainder;
    },
//IDEA-generated (and hence correct) hashCode, used for hashing in Crystal
    hashCode: function() {
      var result = quotient;
      result = 31 * result + remainder;
      return result;
    },
    toString: function() {
      return "DivisionResult{" + "quotient=" + quotient + ", remainder=" + remainder + '}';
    }
  } );
} );

