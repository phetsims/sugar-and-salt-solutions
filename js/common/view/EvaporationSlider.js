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
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );

  //string
  var EVAPORATION = require( 'string!SUGAR_AND_SALT_SOLUTIONS/evaporation' );
  var NONE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/none' );
  var LOTS = require( 'string!SUGAR_AND_SALT_SOLUTIONS/lots' );


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
    var label = new Text( EVAPORATION, { font: SugarAndSaltConstants.TITLE_FONT } );

    // fill with a gradient
    var trackFill = new LinearGradient( 0, 0, trackSize.width, 0 )
      .addColorStop( 0, Color.WHITE )
      .addColorStop( 1, Color.BLACK );

    var maxEvaporationRate = 100;
    var slider = new HSlider( evaporationRate, new Range( 0, maxEvaporationRate ), {
      trackSize: trackSize,
      trackFill: trackFill,
      thumbSize: new Dimension2( 22, 30 ),
      enabledProperty: waterVolume.greaterThanNumber( 0 ).and( clockRunning ),
      endDrag: function() { evaporationRate.set( 0 ); }  // at end of drag, snap evaporation rate back to zero
    } );

    //Show labels for "none" and "lots"
    slider.addMajorTick( 0, new Text( NONE, { font: SugarAndSaltConstants.CONTROL_FONT } ) );
    slider.addMajorTick( maxEvaporationRate, new Text( LOTS, { font: SugarAndSaltConstants.CONTROL_FONT } ) );

    var content = new Node();
    content.addChild( label );
    content.addChild( slider );

    slider.left = label.right + 10;
    slider.centerY = label.centerY - 10;

    Panel.call( thisControl, content,
      { xMargin: 8, yMargin: 4, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1, resize: false } );

  }

  return inherit( Panel, EvaporationSlider );
} )
;

