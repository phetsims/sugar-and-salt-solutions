// Copyright 2002-2014, University of Colorado Boulder

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

  return inherit( Object, SelectableSoluteItem );
} );


