// Copyright 2002-2011, University of Colorado
/**
 * LinearValueControl that is wired up to a Property<Double>
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ChangeEvent = require( 'javax.swing.event.ChangeEvent' );
  var ChangeListener = require( 'javax.swing.event.ChangeListener' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var LinearValueControl = require( 'edu.colorado.phet.common.phetcommon.view.controls.valuecontrol.LinearValueControl' );

  function DoublePropertySlider( label, min, max, value ) {
    LinearValueControl.call( this, min, max, label, "0.00", "" );
    setValue( value.get() );
    value.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( aDouble ) {
        setValue( aDouble );
      }
    } ) );
    addChangeListener( new ChangeListener().withAnonymousClassBody( {
      stateChanged: function( e ) {
        value.set( getValue() );
      }
    } ) );
  }

  return inherit( LinearValueControl, DoublePropertySlider, {
  } );
} );

