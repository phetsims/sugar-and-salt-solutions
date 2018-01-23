// Copyright 2014-2015, University of Colorado Boulder
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
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @constructor
   * @param {Formula} // comma separated formula
   */
  function MicroModelKit() {
    var formulaeArray = Array.prototype.slice.call( arguments );

    //@private
    this.formulae = new ItemList( formulaeArray );
  }

  sugarAndSaltSolutions.register( 'MicroModelKit', MicroModelKit );
  return inherit( Object, MicroModelKit, {
    getFormulae: function() {
      return this.formulae;
    }

  } );
} );
