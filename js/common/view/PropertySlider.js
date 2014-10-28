// Copyright 2002-2011, University of Colorado
/**
 * Slider class that wires up a slider to a SettableProperty<Integer>
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var JSlider = require( 'javax.swing.JSlider' );
  var ChangeEvent = require( 'javax.swing.event.ChangeEvent' );
  var ChangeListener = require( 'javax.swing.event.ChangeListener' );
  var SettableProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.SettableProperty' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );

  function PropertySlider( min, max, value ) {
    JSlider.call( this, min, max, value.get() );
    value.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( value ) {
        setValue( value );
      }
    } ) );
    addChangeListener( new ChangeListener().withAnonymousClassBody( {
      stateChanged: function( e ) {
        value.set( getValue() );
      }
    } ) );
  }

  return inherit( JSlider, PropertySlider, {
  } );
} );

