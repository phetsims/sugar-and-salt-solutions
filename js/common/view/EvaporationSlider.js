//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Control for setting and viewing the evaporation rate, in a white control panel and appearing beneath the beaker.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Range = require( 'DOT/Range' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Color = require( 'SCENERY/util/Color' );
  var Panel = require( 'SUN/Panel' );
  var HSlider = require( 'SUN/HSlider' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  //string
  var EVAPORATION = require( 'string!SUGAR_AND_SALT_SOLUTIONS/evaporation' );
  var NONE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/none' );
  var LOTS = require( 'string!SUGAR_AND_SALT_SOLUTIONS/lots' );

  // constants
  var CONTROL_FONT = new PhetFont( 16 );

  /**
   *
   * @param {Property<number>}evaporationRate
   * @param {NumberProperty} waterVolume
   * @param {Property<boolean>} clockRunning
   * @constructor
   */
  function EvaporationSlider( evaporationRate, waterVolume, clockRunning ) {

    var thisControl = this;
    var trackSize = new Dimension2( 200, 6 );
    var label = new Text( EVAPORATION, { font: new PhetFont( 22 ) } );

    // fill with a gradient
    var trackFill = new LinearGradient( 0, 0, trackSize.width, 0 )
      .addColorStop( 0, Color.white )
      .addColorStop( 1, Color.black );

    var maxEvaporationRate = 100;
    var slider = new HSlider( evaporationRate, new Range( 0, maxEvaporationRate ), {
      trackSize: trackSize,
      trackFill: trackFill,
      enabledProperty: waterVolume.greaterThanNumber( 0 ).and( clockRunning ),
      endDrag: function() { evaporationRate.set( 0 ); }  // at end of drag, snap evaporation rate back to zero
    } );

    //Show labels for "none" and "lots"
    slider.addMajorTick( 0, new Text( NONE, { font: CONTROL_FONT } ) );
    slider.addMajorTick( maxEvaporationRate, new Text( LOTS, { font: CONTROL_FONT } ) );

    var content = new Node();
    content.addChild( label );
    content.addChild( slider );

    slider.left = label.right + 10;
    slider.centerY = label.centerY;

    Panel.call( thisControl, content,
      { xMargin: 15, yMargin: 8, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1, resize: false } );

  }

  return inherit( Panel, EvaporationSlider, {

  } );
} );


//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.view;
//
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.SettableProperty;
//import edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPText;
//import edu.colorado.phet.common.piccolophet.nodes.layout.HBox;
//import edu.colorado.phet.common.piccolophet.nodes.slider.HSliderNode;
//import edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsSimSharing.UserComponents;
//import edu.umd.cs.piccolo.event.PBasicInputEventHandler;
//import edu.umd.cs.piccolo.event.PInputEvent;
//import edu.umd.cs.piccolo.nodes.PText;
//
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Strings.*;
//import static edu.colorado.phet.sugarandsaltsolutions.common.view.BeakerAndShakerCanvas.CONTROL_FONT;
//
///**
// * Piccolo control for setting and viewing the evaporation rate, in a white control panel and appearing beneath the beaker.
// *
// * @author Sam Reid
// */
//public class EvaporationSlider extends WhiteControlPanelNode {
//    public EvaporationSlider( final SettableProperty<Double> evaporationRate, final DoubleProperty waterVolume, ObservableProperty<Boolean> clockRunning ) {
//        super( new HBox(
//
//                //Add a label
//                new PText( EVAPORATION ) {{setFont( CONTROL_FONT );}},
//
//                //Add the slider
//                new HSliderNode( UserComponents.evaporationSlider, 0, 100, evaporationRate, waterVolume.greaterThan( 0.0 ).and( clockRunning ) ) {{
//                    this.addInputEventListener( new PBasicInputEventHandler() {
//                        @Override public void mouseReleased( PInputEvent event ) {
//                            evaporationRate.set( 0.0 );
//                        }
//                    } );
//
//                    //Show labels for "none" and "lots"
//                    addLabel( 0.0, new PhetPText( NONE, CONTROL_FONT ) );
//                    addLabel( 100.0, new PhetPText( LOTS, CONTROL_FONT ) );
//                }}
//        ) );
//    }
//}
