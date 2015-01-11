// Copyright 2002-2014, University of Colorado Boulder

/**
 * Represents a formula ratio for constructive units for crystals.  NaCl is 1Na + 1Cl, NaNO3 is 1Na + 1 NO3.  Sucrose
 * crystals just have a repeating unit of 1 sucrose molecule.
 * CaCl2 is 2 Ca + 2 Cl.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Sodium' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Calcium' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Chloride' );
  var Map = require( 'SUGAR_AND_SALT_SOLUTIONS/utils/Map' );


  /**
   * @param {Map} map
   * @constructor
   */
  function Formula( map ) {
    this.map = map;
  }

  return inherit( Object, Formula, {
      /**
       * Determine the count for the building block of the specified type
       * @param {function} type
       * @returns {number}
       */
      getFactor: function( type ) {
        return this.map.get( type );
      },

      /**
       * List the different types used in the formula
       * @returns {Array<function>}
       */
      getTypes: function() {
        return  this.map.keySet();
      },

      /**
       * Determine if this formula contains the specified type of particle
       * @param {function} type
       * @returns {boolean}
       */
      contains: function( type ) {
        return this.getTypes().contains( type );
      },

      /**
       * Duplicates classes according to the formula counts, to facilitate iteration
       * @returns {Array}
       */
      getFormulaUnit: function() {
        var list = [];
        _.each( this.getTypes, function( type ) {
          list.push( this.getFactor( type ) );
        } );
        return list;
      },

      /**
       *
       * @returns {string}
       */
      getClass: function() {
        return Object.prototype.toString.call( this );
      },

      equals: function( o ) {
        if ( this === o ) { return true; }
        if ( o === null || this.getClass() !== o.getClass() ) { return false; }

        var formula = o;
        if ( !this.map.equals( formula.map ) ) { return false; }
        return true;
      }
    },

    //static
    {
      /**
       * Factory method  for making a formula unit of 1:1
       * @param {constructor} a
       * @param {constructor} b
       * @return {Formula}
       */
      formula_1By1: function( a, b ) {
        return this.formula_1ByN( a, b, 1 );
      },

      /**
       * Factory method  for making a formula unit of 1:N, as in CaCl2
       * @param {constructor} a
       * @param {constructor} b
       * @param {number} bCount
       * @return {Formula}
       */
      formula_1ByN: function( a, b, bCount ) {
        var particleMap = new Map();
        particleMap.put( a, 1 );
        particleMap.put( b, bCount );
        return this.formula_ByMap( particleMap );
      },

      /**
       * Factory method  for making a formula unit of 1 such as in Sucrose or Glucose
       * @param {function} type
       * @return {Formula}
       */
      formula_By1: function( type ) {
        var particleMap = new Map();
        particleMap.put( type, 1 );
        return this.formula_ByMap( particleMap );
      },

      /**
       * Create a formula by giving an explicit map
       * @param map
       * @return {Formula}
       */
      formula_ByMap: function( map ) {
        var formula = new Formula( map );
        return formula;
      },

      /**
       * The formula for calcium chloride must return Calcium first, otherwise the crystal
       * growing procedure can run into too many dead ends
       * @return {Formula}
       */
      createCalciumChloride: function() {
        var formula = this.formula_1ByN( Calcium, Chloride, 2 );

        //override getTypes
        formula.getTypes = function() {
          var types = [];
          types.push( Calcium );
          types.push( Chloride );
          return types;
        };
        return formula;
      },

      //Formulae used in Sugar and Salt Solutions
      SODIUM_CHLORIDE: this.formula_1By1( Sodium, Chloride ),
      CALCIUM_CHLORIDE: this.createCalciumChloride()
    } );
} );

//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Calcium;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Chloride;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle.Sodium;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.sucrose.Sucrose;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.glucose.Glucose;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.sodiumnitrate.Nitrate;
//
///**

// *
// * @author Sam Reid
// */
//public class Formula {

//   public static final Formula SUCROSE = new Formula( Sucrose.class );
//   public static final Formula GLUCOSE = new Formula( Glucose.class );
//   public static final Formula SODIUM_NITRATE = new Formula( Sodium.class, Nitrate.class );
//
//    //Convenience constructor for making a formula unit of 1:1
//    public Formula( final Class<? extends Particle> a, final Class<? extends Particle> b ) {
//        this( a, b, 1 );
//    }
//
//    //Convenience constructor for making a formula unit of 1:N, as in CaCl2
//    public Formula( final Class<? extends Particle> a, final Class<? extends Particle> b, final int bCount ) {
//        this( new HashMap<Class<? extends Particle>, Integer>() {{
//            put( a, 1 );
//            put( b, bCount );
//        }} );
//    }
//
//    //Convenience constructor for making a formula unit of 1 such as in Sucrose or Glucose
//    public Formula( final Class<? extends Particle> type ) {
//        this( new HashMap<Class<? extends Particle>, Integer>() {{
//            put( type, 1 );
//        }} );
//    }
//
//    //Create a formula by giving an explicit map
//    public Formula( HashMap<Class<? extends Particle>, Integer> map ) {
//        this.map = map;
//    }
//

//

//

//
//    @Override public String toString() {
//        return map.toString();
//    }
//

//
//    //Auto-generated hashCode
//    @Override public int hashCode() {
//        return map.hashCode();
//    }
//}
