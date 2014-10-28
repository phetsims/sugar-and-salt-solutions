// Copyright 2002-2011, University of Colorado
/**
 * Item to be displayed in a DispenserRadioButtonSet
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType' );

  function SelectableSoluteItem( name, dispenserType ) {
    this.name;
    this.dispenserType;
    this.name = name;
    this.dispenserType = dispenserType;
  }

  return inherit( Object, SelectableSoluteItem, {
  } );
} );

