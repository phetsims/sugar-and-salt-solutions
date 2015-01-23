//  Copyright 2002-2014, University of Colorado Boulder
/**
 * List containing all pairs of particles that could be used to seed a crystal
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var FormulaUnit = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/dynamics/FormulaUnit' );

  /**
   *
   * @param {ItemList} freeParticles
   * @param {prototype.constructor} typeA
   * @param {prototype.constructor} typeB
   * @constructor
   */
  function AllPairs( freeParticles, typeA, typeB ) {
    var aList = freeParticles.filter( typeA ).getArray();
    var bList = freeParticles.filter( typeB ).getArray();
    var self = this;
    _.each( bList, function( a ) {
      _.each( aList, function( b ) {
        //Check for equality in case typeA==typeB, as in the case of Sucrose
        if ( a !== b ) {
          self.add( new FormulaUnit( a, b ) );
        }
      } );
    } );

  }
  return inherit( ObservableArray, AllPairs );
} );