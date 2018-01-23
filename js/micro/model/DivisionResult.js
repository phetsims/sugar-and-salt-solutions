// Copyright 2014-2015, University of Colorado Boulder

/**
 * Result of dividing int by int, which has an int quotient and int remainder.
 * This class was created to help compare crystals to the given formula ratios (such as CaCl2)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {number} numerator
   * @param {number} denominator
   * @constructor
   */
  function DivisionResult( numerator, denominator ) {
    this.quotient = numerator / denominator;
    this.remainder = ( numerator % denominator ) | 0; // convert float to integer using bitwise operator
  }

  sugarAndSaltSolutions.register( 'DivisionResult', DivisionResult );
  return inherit( Object, DivisionResult );

} );


// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.micro.model;
//
///**
// *
// *
// * @author Sam Reid
// */
//public class DivisionResult {
//    public final int quotient;
//    public final int remainder;
//
//    public DivisionResult( int numerator, int denominator ) {
//        this.quotient = numerator / denominator;
//        this.remainder = numerator % denominator;
//    }
//
//    //IDEA-generated equals
//    @Override public boolean equals( Object o ) {
//        if ( this == o ) { return true; }
//        if ( o == null || getClass() != o.getClass() ) { return false; }
//
//        DivisionResult that = (DivisionResult) o;
//
//        return quotient == that.quotient && remainder == that.remainder;
//    }
//
//    //IDEA-generated (and hence correct) hashCode, used for hashing in Crystal
//    @Override public int hashCode() {
//        int result = quotient;
//        result = 31 * result + remainder;
//        return result;
//    }
//
//    @Override public String toString() {
//        return "DivisionResult{" + "quotient=" + quotient + ", remainder=" + remainder + '}';
//    }
//}
