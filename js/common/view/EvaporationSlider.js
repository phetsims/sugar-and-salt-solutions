// Copyright 2002-2011, University of Colorado
/**
 * Piccolo control for setting and viewing the evaporation rate, in a white control panel and appearing beneath the beaker.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SettableProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.SettableProperty' );
  var DoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty' );
  var PhetPText = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPText' );
  var HBox = require( 'edu.colorado.phet.common.piccolophet.nodes.layout.HBox' );
  var HSliderNode = require( 'edu.colorado.phet.common.piccolophet.nodes.slider.HSliderNode' );
  var UserComponents = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsSimSharing/UserComponents' );
  var PBasicInputEventHandler = require( 'edu.umd.cs.piccolo.event.PBasicInputEventHandler' );
  var PInputEvent = require( 'edu.umd.cs.piccolo.event.PInputEvent' );
  var PText = require( 'edu.umd.cs.piccolo.nodes.PText' );
  var Strings = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings' );//static ///*
  var CONTROL_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/CONTROL_FONT' );//static

  function EvaporationSlider( evaporationRate, waterVolume, clockRunning ) {
    WhiteControlPanelNode.call( this, new HBox(//Add a label
      new PText( EVAPORATION ).withAnonymousClassBody( {
        initializer: function() {
          setFont( CONTROL_FONT );
        }
      } ), //Add the slider
      new HSliderNode( UserComponents.evaporationSlider, 0, 100, evaporationRate, waterVolume.greaterThan( 0.0 ).and( clockRunning ) ).withAnonymousClassBody( {
        initializer: function() {
          this.addInputEventListener( new PBasicInputEventHandler().withAnonymousClassBody( {
            mouseReleased: function( event ) {
              evaporationRate.set( 0.0 );
            }
          } ) );
          //Show labels for "none" and "lots"
          addLabel( 0.0, new PhetPText( NONE, CONTROL_FONT ) );
          addLabel( 100.0, new PhetPText( LOTS, CONTROL_FONT ) );
        }
      } ) ) );
  }

  return inherit( WhiteControlPanelNode, EvaporationSlider, {
  } );
} );

