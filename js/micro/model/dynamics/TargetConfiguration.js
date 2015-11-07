// Copyright 2014-2015, University of Colorado Boulder

/**
 * A TargetConfiguration indicates target positions and matching crystal lattice sites for each member of a formula unit
 * so that a crystal can be grown by one formula unit at a time so that it will never become unbalanced
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Particle' );

  /**
   * @param {ItemList<CrystallizationMatch>} list
   * @constructor
   */
  function TargetConfiguration( list ) {
    this.list = list;

    var listItems = list.getArray();
    //Combine the specified initial value with all elements from the list using the specified combination function
    this.distance = _.reduce( listItems, function( runningTotal, match ) {
      return match.distance + runningTotal;
    }, 0.0 ); // 0.0 initialValue
  }

  return inherit( Particle, TargetConfiguration, {
    /**
     * @returns {ItemList.<CrystallizationMatch>}
     */
    getMatches: function() {
      return this.list;
    }
  } );

} );

