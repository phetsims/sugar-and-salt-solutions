// Copyright 2014-2016, University of Colorado Boulder
/**
 * Composes data relevant to any kind of dissolved solute constituent, such as sodium, nitrate, sucrose, etc.
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IonConcentration = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/IonConcentration' );
  var Property = require( 'AXON/Property' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {MicroModel} model
   * @param {Property.<Color>} color
   * @param {prototype.constructor} type
   * @param {Property<boolean>} hold //Flag indicating whether the value should be held constant, in this case if the user is draining fluid out the drain
   * @constructor
   */
  function SoluteConstituent( model, color, type, hold ) {
    var self = this;
    // True particle concentrations for the dissolved components
    self.concentration = new IonConcentration( model, type );

    //The concentration to show on the bar chart should be the the display concentration instead of the true concentration because
    //the value must be held constant when draining out the drain
    self.concentrationToDisplay = new Property( this.concentration.get() );

    //When the true concentration changes, move the display concentration in accordance with the delta, but also toward the true value
    //Unless the user is draining fluid (in which case it should remain constant)
    this.concentration.link( function( newValue, oldValue ) {
      if ( !hold.get() ) {
        var delta = newValue - oldValue;
        var proposedDisplayValue = self.concentrationToDisplay.get() + delta;
        var trueValue = self.concentration.get();

        //Mix the proposed and true values so it will step in the right direction but also toward the true value
        var fractionTrueValue = 0.5;
        var newValueToDisplay = fractionTrueValue * trueValue + ( 1 - fractionTrueValue ) * proposedDisplayValue;
        self.concentrationToDisplay.set( newValueToDisplay );
      }

      //Even if the value is being held constant, jump directly to zero if the true concentration becomes zero,
      //So that if all particles flow out the drain, the displayed concentration of that solute will read 0
      else if ( self.concentration.get() === 0.0 ) {
        self.concentrationToDisplay.set( 0.0 );
      }
    } );

    //Color to display in the bar chart, depends on whether "show charges" has been selected by the user
    this.color = color;
  }

  sugarAndSaltSolutions.register( 'SoluteConstituent', SoluteConstituent );
  return inherit( Object, SoluteConstituent );
} );

