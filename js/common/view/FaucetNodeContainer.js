// Copyright 2014-2017, University of Colorado Boulder

/**
 * Faucet node for showing and controlling water flowing into and out of the beaker.
 * Parts copied from water tower module in fluid pressure and flow.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  //constants
  //Locations in the image file where the input pipe connects to the faucet.
  var INPUT_PIPE_X = 0;
  var INPUT_PIPE_Y1 = 0;
  var INPUT_PIPE_Y2 = -300; // TODO Ashraf Why this value works?

  // Locations in the image file where the fluid comes out of the faucet. (Ashraf , this is with reference to the FaucetNode's origin)
  var OUTPUT_PIPE_X1 = -38;
  var OUTPUT_PIPE_X2 = 38;
  var OUTPUT_PIPE_Y = 0;

  /**
   * @param {number} maxFlowRate
   * @param {Property.<number>} flowRateProperty
   * @param {Property.<boolean>} enabledProperty
   * @param {Object} [options]
   * @constructor
   */
  function FaucetNodeContainer( maxFlowRate, flowRateProperty, enabledProperty, options ) {
    Node.call( this, {} );

    this.faucetNode = new FaucetNode( maxFlowRate, flowRateProperty, enabledProperty, options );
    this.addChild( this.faucetNode );
  }

  return inherit( Node, FaucetNodeContainer, {

    /**
     * Gets the center of the input pipe, in global coordinates.
     * @returns {Vector2}
     */
    getGlobalInputCenter: function() {
      return this.faucetNode.localToGlobalPoint( new Vector2( INPUT_PIPE_X, ( INPUT_PIPE_Y1 + INPUT_PIPE_Y2 ) / 2 ) );
    },

    /**
     * Gets the size of the input pipe, in global coordinates.
     * @returns {Bounds2}
     */
    getGlobalInputSize: function() {
      return this.faucetNode.localToGlobalBounds( new Bounds2( 0, 0, 0, INPUT_PIPE_Y2 - INPUT_PIPE_Y1 ) );
    },
    /**
     * Gets the center of the output pipe, in global coordinates.
     * @returns {Vector2}
     */
    getGlobalOutputCenter: function() {
      return this.faucetNode.localToGlobalPoint( new Vector2( ( OUTPUT_PIPE_X2 + OUTPUT_PIPE_X1 ) / 2, OUTPUT_PIPE_Y ) );
    },
    /**
     * Gets the size of the output pipe, in global coordinates.
     * @returns {Bounds2}
     */
    getGlobalOutputSize: function() {
      return this.faucetNode.localToGlobalBounds( new Bounds2( 0, 0, OUTPUT_PIPE_X2 - OUTPUT_PIPE_X1, 0 ) );
    }

  } );

} );