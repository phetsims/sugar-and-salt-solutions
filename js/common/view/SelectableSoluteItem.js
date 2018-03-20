// Copyright 2014-2018, University of Colorado Boulder

/**
 * Item to be displayed in a DispenserRadioButtonSet
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
   * @param {string} name
   * @param {DispenserType}dispenserType
   * @constructor
   */
  function SelectableSoluteItem( name, dispenserType ) {
    this.name = name;
    this.dispenserType = dispenserType;
  }

  sugarAndSaltSolutions.register( 'SelectableSoluteItem', SelectableSoluteItem );

  return inherit( Object, SelectableSoluteItem );
} );


