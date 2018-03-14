// Copyright 2014-2017, University of Colorado Boulder
/**
 * A shaker for the "micro tab" emits crystals less frequently than in the macro tab.
 * This class keeps track of when and what to emit.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SaltShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/SaltShaker' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<boolean>} moreAllowed
   * @param {string} name
   * @param {number} distanceScale
   * @param {Property<DispenserType<string>>} selectedType
   * @param {DispenserType<string>} type
   * @param {MicroModel}model
   * @constructor
   */
  function MicroShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    SaltShaker.call( this, x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model );

    //Keep track of how many times the user has tried to create macro salt, so that we can
    //(less frequently) create corresponding micro crystals
    //@private
    this.stepsAdding = new Property( 0 );
  }

  sugarAndSaltSolutions.register( 'MicroShaker', MicroShaker );
  return inherit( SaltShaker, MicroShaker, {
    /**
     * @param {MicroModel} model
     * @param {Vector2} outputPoint
     * @param {number} volumePerSolidMole
     * @param {Vector2} crystalVelocity
     */
    addSalt: function( model, outputPoint, volumePerSolidMole, crystalVelocity ) {
      //Only add a crystal every N steps, otherwise there are too many
      this.stepsAdding.set( this.stepsAdding.get() + 1 );
      if ( this.stepsAdding.get() % 30 === 0 ) {
        this.addCrystal( model, outputPoint );
      }
    },

    /**
     * @abstract
     * @protected
     * This method actually adds the crystal
     * @param {MicroModel} model
     * @param {Vector2} outputPoint
     */
    addCrystal: function( model, outputPoint ) {
      throw new Error( 'addCrystal should be implemented in descendant classes of MicroShaker' );
    }
  } );

} );

