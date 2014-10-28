// Copyright 2002-2011, University of Colorado
/**
 * Composes data relevant to any kind of dissolved solute constituent, such as sodium, nitrate, sucrose, etc.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var ChangeObserver = require( 'edu.colorado.phet.common.phetcommon.model.property.ChangeObserver' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var CompositeDoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.CompositeDoubleProperty' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );

  function SoluteConstituent( model, color, type, //Flag indicating whether the value should be held constant, in this case if the user is draining fluid out the drain
                              hold ) {
    //True particle concentrations for the dissolved components
    this.concentration;
    //The concentration to show on the bar chart should be the the display concentration instead of the true concentration because the value must be held constant when draining out the drain
    this.concentrationToDisplay;
    //Color to display in the bar chart, depends on whether "show charges" has been selected by the user
    this.color;
    concentration = new IonConcentration( model, type );
    concentrationToDisplay = new Property( concentration.get() );
    //Unless the user is draining fluid (in which case it should remain constant)
    concentration.addObserver( new ChangeObserver().withAnonymousClassBody( {
      update: function( newValue, oldValue ) {
        if ( !hold.get() ) {
          var delta = newValue - oldValue;
          var proposedDisplayValue = concentrationToDisplay.get() + delta;
          var trueValue = concentration.get();
          //Mix the proposed and true values so it will step in the right direction but also toward the true value
          var fractionTrueValue = 0.5;
          var newValueToDisplay = fractionTrueValue * trueValue + (1 - fractionTrueValue) * proposedDisplayValue;
          concentrationToDisplay.set( newValueToDisplay );
        }
        else //So that if all particles flow out the drain, the displayed concentration of that solute will read 0
        if ( concentration.get() == 0.0 ) {
          concentrationToDisplay.set( 0.0 );
        }
      }
    } ) );
    this.color = color;
  }

  return inherit( Object, SoluteConstituent, {
  } );
} );

