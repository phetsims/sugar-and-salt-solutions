//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Displays the exact volume of the solution, as a text label inside the solution.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var PATTERN__LITERS_SOLUTION = require( 'string!SUGAR_AND_SALT_SOLUTIONS/pattern.litersSolution' );
  var PATTERN__LITERS_WATER = require( 'string!SUGAR_AND_SALT_SOLUTIONS/pattern.litersWater' );

  // constants
  //Insets to be used for padding between edge of canvas and controls, or between controls
  var INSET = 5;
  var CONTROL_FONT = new PhetFont( 22 );

  /**
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Solution} solution
   * @param {Property<boolean>} visible
   * @param {Property<boolean>} anySolutes
   * @param {function(number}:string} formatter
   * @constructor
   */
  function VolumeIndicatorNode( modelViewTransform, solution, visible, anySolutes, formatter ) {
    var thisNode = this;
    Node.call( thisNode );
    visible.link( function( visibleValue ) {
      thisNode.visible = visibleValue;
    } );

    //Use a large font so it will be easy to read inside the water
    var volumeDisplayTextNode = new Text( "", {font: CONTROL_FONT} );
    thisNode.addChild( volumeDisplayTextNode );

    Property.multilink( [solution.volume, anySolutes], function( volume, anySolutesValue ) {
      //Apply the context sensitive formatter (e.g., accounting for the module and whether on the
      //side of beaker or continuous readout within the beaker)
      var formatted = formatter( solution.volume.get() );

      //if there is no sugar or salt in the beaker, say 1.00L "water" instead of "solution"
      var text = StringUtils.format( anySolutesValue ? PATTERN__LITERS_SOLUTION : PATTERN__LITERS_WATER, formatted );
      volumeDisplayTextNode.text = text;
    } );

    // Update the location so it remains in the top left of the fluid
    solution.shape.link( function( shape ) {
      var waterViewBounds = modelViewTransform.modelToViewShape( shape ).bounds;
      thisNode.x = waterViewBounds.getX() + INSET;
      thisNode.y = waterViewBounds.getY() + INSET;
    } );
  }

  return inherit( Node, VolumeIndicatorNode );
} );

