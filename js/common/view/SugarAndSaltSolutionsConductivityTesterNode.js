// Copyright 2015-2018, University of Colorado Boulder

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
  var Color = require( 'SCENERY/util/Color' );
  var ConductivityTesterNode = require( 'SCENERY_PHET/ConductivityTesterNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {ConductivityTester} conductivityTester
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function SugarAndSaltSolutionsConductivityTesterNode( conductivityTester, modelViewTransform ) {
    var self = this;
    var modelProbeSize = conductivityTester.getProbeSizeReference();
    var probeSize = new Dimension2( modelViewTransform.modelToViewDeltaX( modelProbeSize.width ),
      modelViewTransform.modelToViewDeltaY( -modelProbeSize.height ) );

    ConductivityTesterNode.call( self,
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

    self.cursor = 'pointer';

    conductivityTester.locationProperty.link( function( location ) {
      var modelLightBubBounds = modelViewTransform.viewToModelBounds( self.lightBulbNode.bounds );
      conductivityTester.setBulbRegion( modelLightBubBounds );

    } );
  }

  sugarAndSaltSolutions.register( 'SugarAndSaltSolutionsConductivityTesterNode', SugarAndSaltSolutionsConductivityTesterNode );

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
