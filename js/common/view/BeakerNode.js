// Copyright 2014-2018, University of Colorado Boulder

/**
 * This node just shows the walls (sides and bottom) of the beaker
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var ColorConstants = require( 'SUN/ColorConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var patternLitersString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/pattern.liters' );

  // constants
  var MAJOR_TICK_LENGTH = 15;
  var MAJOR_TICK_WIDTH = 3;
  var MINOR_TICK_LENGTH = 12;
  var MINOR_TICK_WIDTH = 2;
  var TICK_COLOR = 'white';
  var TICK_TEXT_OFFSET = -5;
  var TICK_TEXT_SIZE = 16;
  var TICK_LABEL_COLOR = 'white';
  var NUMBER_OF_MINOR_TICKS_PER_MAJOR = 1;
  var MAJOR_TICK_VALUES = [ '0', '1', '2' ];

  /**
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BeakerNode( beaker, modelViewTransform ) {
    Node.call( this );

    // path for the outline of the beaker
    var outlinePath = new Path( modelViewTransform.modelToViewShape( beaker.getWallPath( beaker.topDelta ) ), {
      fill: ColorConstants.LIGHT_GRAY
    } );

    // node that contains major and minor ticks, and text labels
    var beakerTicksNode = new Node();

    // line of the left border of the beaker node {Line}
    var leftWallView = modelViewTransform.modelToViewShape( beaker.getLeftWall() );

    // the bottom-right corner of the beaker node {Vector2}
    var beakerBottomLeft = leftWallView.getStart();

    // (assuming the first and last ticks are major ticks)
    var numberOfTicks = MAJOR_TICK_VALUES.length * ( NUMBER_OF_MINOR_TICKS_PER_MAJOR + 1 ) - 1;

    for ( var i = 0; i < numberOfTicks; i++ ) {
      var isMajor = ( i % ( NUMBER_OF_MINOR_TICKS_PER_MAJOR + 1 ) === 0 );
      var tickLength = MINOR_TICK_LENGTH;
      var tickWidth = MINOR_TICK_WIDTH;
      if ( isMajor ) {
        tickLength = MAJOR_TICK_LENGTH;
        tickWidth = MAJOR_TICK_WIDTH;
      }

      var beakerHeight = Math.abs( modelViewTransform.modelToViewDeltaY( beaker.getHeight() ) );

      var numberOfIntervals = numberOfTicks - 1;

      // height between each tick
      var tickIntervalHeight = beakerHeight / numberOfIntervals;

      // tick position offset from the bottom-left corner (negative tickIntervalHeight because lesser Y values are higher up in the view)
      var tickRight = beakerBottomLeft.plusXY( 0, i * -tickIntervalHeight );

      // (negative tickLength since ticks hang on the left of the beaker and head left)
      var tickShape = new Shape().moveToPoint( tickRight ).horizontalLineToRelative( -tickLength );
      var tickPath = new Path( tickShape, {
        lineWidth: tickWidth,
        stroke: TICK_COLOR
      } );

      if ( isMajor ) {
        // (every (NUMBER_OF_MINOR_TICKS_PER_MAJOR + 1) ticks is a major tick,
        // so MAJOR_TICK_VALUES[i / (NUMBER_OF_MINOR_TICKS_PER_MAJOR + 1)] is the i-th major tick value)
        var labelIndex = i / ( NUMBER_OF_MINOR_TICKS_PER_MAJOR + 1 );
        var tickStringValue = MAJOR_TICK_VALUES[ labelIndex ];
        var tickLabel = StringUtils.format( patternLitersString, tickStringValue );
        var tickTextNode = new Text( tickLabel, {
          right: tickShape.getBounds().x + TICK_TEXT_OFFSET,
          centerY: tickRight.y,
          fontSize: TICK_TEXT_SIZE,
          fill: TICK_LABEL_COLOR
        } );
        beakerTicksNode.addChild( tickTextNode );
      }
      beakerTicksNode.addChild( tickPath );
    }

    // adding the ticks and labels
    this.addChild( beakerTicksNode );

    // adding the beaker's outline
    this.addChild( outlinePath );

  }

  sugarAndSaltSolutions.register( 'BeakerNode', BeakerNode );

  return inherit( Node, BeakerNode );
} );

