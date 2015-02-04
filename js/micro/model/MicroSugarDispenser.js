//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Dispenser for the micro tab that emits sugar, either sucrose or glucose.
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/SugarDispenser' );
  var Property = require( 'AXON/Property' );

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<boolean>} moreAllowed
   * @param {string} name
   * @param {number} distanceScale
   * @param {<Property<DispenserType<string>>} selectedType
   * @param {DispenserType<string>} type
   * @param {MicroModel}model
   * @constructor
   * @abstract
   */
  function MicroSugarDispenser( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    SugarDispenser.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );

    // Keep track of how many times the user has tried to create macro salt, so that we can (less frequently)
    // create corresponding micro crystals
    //@private
    this.stepsOfAddingSugar = new Property( 0 );
  }

  return inherit( SugarDispenser, MicroSugarDispenser, {
    /**
     * @protected
     * @override
     * Checks to see if a sugar should be emitted, and if so, adds it to the model
     * @param {Vector} outputPoint
     */
    addSugarToModel: function( outputPoint ) {
      //Only add a crystal every N steps, otherwise there are too many
      this.stepsOfAddingSugar.set( this.stepsOfAddingSugar.get() + 1 );
      if ( this.stepsOfAddingSugar.get() % 10 === 0 ) {
        //Create a random crystal with 4 sucrose molecules
        this.doAddSugar( outputPoint );
      }
    },

    /**
     * Adds a single sugar model item to the model at the specified point
     * @param {Vector2} outputPoint
     */
    doAddSugar: function( outputPoint ) {
      throw new Error( "doAddSugar must be implemented in descendant class of MicroSugarDispenser " );
    }
  } );
} );