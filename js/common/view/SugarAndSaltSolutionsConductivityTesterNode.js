// Copyright 2002-2014, University of Colorado Boulder

/**
 * Conductivity tester. Light bulb connected to a battery, with draggable probes.
 * When the probes are both immersed in solution, the circuit is completed, and the bulb glows.
 * <p>
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ConductivityTesterNode = require( 'SCENERY_PHET/ConductivityTesterNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Color = require( 'SCENERY/util/Color' );

  /**
   *
   * @param {ConductivityTester} conductivityTester
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function SugarAndSaltSolutionsConductivityTesterNode( conductivityTester, modelViewTransform ) {
    var thisNode = this;
    var modelProbeSize = conductivityTester.getProbeSizeReference();
    var probeSize = new Dimension2( modelViewTransform.modelToViewDeltaX( modelProbeSize.width ),
      modelViewTransform.modelToViewDeltaY( -modelProbeSize.height ) );

    ConductivityTesterNode.call( thisNode,
      conductivityTester.brightnessProperty,
      conductivityTester.locationProperty,
      conductivityTester.positiveProbeLocationProperty,
      conductivityTester.negativeProbeLocationProperty, {
        modelViewTransform: modelViewTransform,
        negativeProbeFill: 'green',
        probeSize: probeSize, // Probe Size is given in view coordinates
        positiveLabelFill: 'black',
        negativeLabelFill: 'black',
        wireStroke: new Color( 192, 192, 192 ),
        wireLineWidth: 2,
        bulbImageScale: 0.7,
        batteryImageScale: 0.8
      }
    );

    thisNode.cursor = 'pointer';

    conductivityTester.locationProperty.link( function( location ) {
      var modelLightBubBounds = modelViewTransform.viewToModelBounds( thisNode.lightBulbNode.bounds );
      conductivityTester.setBulbRegion( modelLightBubBounds );

    } );
  }

  return inherit( ConductivityTesterNode, SugarAndSaltSolutionsConductivityTesterNode, {

    /**
     *
     * @returns {Node}
     */
    getDroppableComponent: function() {
      return this.lightBulbNode;
    }

  } );
} );
