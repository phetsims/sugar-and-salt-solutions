// Copyright 2014-2017, University of Colorado Boulder
/**
 * List containing all pairs of particles that could be used to seed a crystal
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var FormulaUnit = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/FormulaUnit' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ItemList' );

  /**
   *
   * @param {ItemList} freeParticles
   * @param {prototype.constructor} typeA
   * @param {prototype.constructor} typeB
   * @constructor
   */
  function AllPairs( freeParticles, typeA, typeB ) {
    ItemList.call( this, [] );
    var aList = freeParticles.filterByClass( typeA ).getArray();
    var bList = freeParticles.filterByClass( typeB ).getArray();
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

  return inherit( ItemList, AllPairs );
} );