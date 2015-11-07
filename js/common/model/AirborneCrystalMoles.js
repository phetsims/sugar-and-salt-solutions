// Copyright 2014-2015, University of Colorado Boulder

/**
 * Keep track of how many moles of crystal are in the air, since we need to prevent user from adding more than 10
 * moles to the system. That is, we need to shut off salt/sugar when there is salt/sugar in the air that could get
 * added to the solution
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );

  /**
   *
   * @param {ObservableArray<MacroCrystal>} list
   * @constructor
   */
  function AirborneCrystalMoles( list ) {

    DerivedProperty.call( this, [list.lengthProperty], function() {
      // Sum up the total amount of moles of crystals that are in the air
      var sum = 0;
      list.forEach( function( crystal ) {

        //Allow zero values to count toward the sum since "landed" particles could be sitting at 0 and should still
        // count toward the amount in the play area since they could get added to the solution
        if ( crystal.position.get().y >= 0 ) {
          sum += crystal.moles;
        }

      } );
      return sum;
    } );
    //Notification based on changes is handled in SugarAndSaltSolutionModel when the crystal list is modified
  }

  return inherit( DerivedProperty, AirborneCrystalMoles, {

  } );


} );

