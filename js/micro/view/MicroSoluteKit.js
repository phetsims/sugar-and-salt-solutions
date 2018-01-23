// Copyright 2014-2015, University of Colorado Boulder
/**
 * A kit the user can choose from, for showing the appropriate bars in the concentration bar chart.  Other information about
 * kits is contained in the MicroModel.selectedKit and its dependencies
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @constructor
   */
  function MicroSoluteKit( barItems ) {
    //Bars to be shown in the concentration bar chart
    this.barItems = barItems;
  }

  sugarAndSaltSolutions.register( 'MicroSoluteKit', MicroSoluteKit );
  return inherit( Object, MicroSoluteKit, {} );
} );

