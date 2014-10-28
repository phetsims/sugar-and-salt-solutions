// Copyright 2002-2011, University of Colorado
/**
 * A kit the user can choose from, for showing the appropriate bars in the concentration bar chart.  Other information about kits is contained in the MicroModel.selectedKit and its dependencies
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BarItem = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/barchart/BarItem' );

  function MicroSoluteKit( barItems ) {
    //Bars to be shown in the concentration bar chart
    this.barItems;
    this.barItems = barItems;
  }

  return inherit( Object, MicroSoluteKit, {
  } );
} );

