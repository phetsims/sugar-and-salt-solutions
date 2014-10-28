// Copyright 2002-2011, University of Colorado
/**
 * Model kit, for making sure that particle draining can happen in formula units so there isn't an unbalanced number of solutes for crystallization
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Formula' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );

  function MicroModelKit( formulae ) {

    //private
    this.formulae;
    this.formulae = new ItemList( formulae );
  }

  return inherit( Object, MicroModelKit, {
    getFormulae: function() {
      return formulae;
    }
  } );
} );

