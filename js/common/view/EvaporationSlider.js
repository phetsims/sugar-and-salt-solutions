// Copyright 2014-2018, University of Colorado Boulder

/**
 * Control for setting and viewing the evaporation rate, in a white control panel and appearing beneath the beaker.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var SugarAndSaltSolutionsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsConstants' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var Text = require( 'SCENERY/nodes/Text' );

  //string
  var evaporationString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/evaporation' );
  var lotsString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/lots' );
  var noneString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/none' );

  /**
   *
   * @param {Property.<number>}evaporationRate
   * @param {Property} waterVolume
   * @param {Property.<boolean>} clockRunning
   * @constructor
   */
  function EvaporationSlider( evaporationRate, waterVolume, clockRunning ) {

    var self = this;
    var trackSize = new Dimension2( 200, 6 );
    var label = new Text( evaporationString, { font: SugarAndSaltSolutionsConstants.TITLE_FONT } );

    // fill with a gradient
    var trackFill = new LinearGradient( 0, 0, trackSize.width, 0 )
      .addColorStop( 0, Color.WHITE )
      .addColorStop( 1, Color.BLACK );

    var maxEvaporationRate = 100;
    var slider = new HSlider( evaporationRate, new RangeWithValue( 0, maxEvaporationRate ), {
      trackSize: trackSize,
      trackFill: trackFill,
      thumbSize: new Dimension2( 22, 30 ),
      enabledProperty: new DerivedProperty( [ waterVolume, clockRunning ], function( waterVolume, clockRunning ) {
        return waterVolume > 0 && clockRunning;
      } ),
      endDrag: function() { evaporationRate.set( 0 ); }  // at end of drag, snap evaporation rate back to zero
    } );

    //Show labels for "none" and "lots"
    slider.addMajorTick( 0, new Text( noneString, { font: SugarAndSaltSolutionsConstants.CONTROL_FONT } ) );
    slider.addMajorTick( maxEvaporationRate, new Text( lotsString, { font: SugarAndSaltSolutionsConstants.CONTROL_FONT } ) );

    var content = new Node();
    content.addChild( label );
    content.addChild( slider );

    slider.left = label.right + 10;
    slider.centerY = label.centerY - 10;

    Panel.call( self, content,
      { xMargin: 8, yMargin: 4, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1, resize: false } );

  }

  sugarAndSaltSolutions.register( 'EvaporationSlider', EvaporationSlider );

  return inherit( Panel, EvaporationSlider );
} )
;

