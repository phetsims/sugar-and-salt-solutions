//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Model kit, for making sure that particle draining can happen in formula units so there isn't an
 * unbalanced number of solutes for crystallization
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ItemList' );

  /**
   * @constructor
   * @param {Formula} // comma separated formula
   */
  function MicroModelKit() {
    var formulaeArray = Array.prototype.slice.call( arguments );

    //@private
    this.formulae = new ItemList( formulaeArray );
  }

  return inherit( Object, MicroModelKit, {
    getFormulae: function() {
      return this.formulae;
    }

  } );
} );
