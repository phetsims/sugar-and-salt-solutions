// Copyright 2014-2018, University of Colorado Boulder

/**
 * Keep track of how many moles of crystal are in the air, since we need to prevent user from adding more than 10
 * moles to the system. That is, we need to shut off salt/sugar when there is salt/sugar in the air that could get
 * added to the solution
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  class AirborneCrystalMoles extends DerivedProperty {

    /**
     * @param {ObservableArray<MacroCrystal>} list
     */
    constructor( list ) {

      super( [ list.lengthProperty ], function() {
        // Sum up the total amount of moles of crystals that are in the air
        let sum = 0;
        list.forEach( crystal => {

          //Allow zero values to count toward the sum since "landed" particles could be sitting at 0 and should still
          // count toward the amount in the play area since they could get added to the solution
          if ( crystal.positionProperty.get().y >= 0 ) {
            sum += crystal.moles;
          }

        } );
        return sum;
      } );
      //Notification based on changes is handled in SugarAndSaltSolutionsModel when the crystal list is modified
    }
  }

  return sugarAndSaltSolutions.register( 'AirborneCrystalMoles', AirborneCrystalMoles );
} );
