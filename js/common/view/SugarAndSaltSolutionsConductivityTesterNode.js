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
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Range = require( 'DOT/Range' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Color = require( 'SCENERY/util/Color' );

  //Size of each probe in meters, corresponds to the side of the red or black object in model coordinates (meters),
  //might need to be changed if we want to make the conductivity tester probes bigger or smaller
  var PROBE_SIZE = new Dimension2( 0.0125, 0.025 );


  /**
   *
   * @param {ConductivityTester} conductivityTester
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function SugarAndSaltSolutionsConductivityTesterNode( conductivityTester, modelViewTransform ) {

    var beaker = conductivityTester.beaker;

    //ConductivityTesterNode expects theses values in view coordinates
    var beakerHeight = modelViewTransform.modelToViewDeltaY( -beaker.height );
    var beakerTop = modelViewTransform.modelToViewY( beaker.y );

    var negativeProbeX = modelViewTransform.modelToViewDeltaX( -beaker.width / 3 );
    var positiveProbeX = modelViewTransform.modelToViewDeltaX( beaker.width / 3 );

    var conductivityTesterProperties = new PropertySet( {
      location: new Vector2( 0, beakerHeight ),
      negativeProbeLocation: new Vector2( negativeProbeX, beakerHeight ),
      positiveProbeLocation: new Vector2( positiveProbeX, beakerHeight )
    } );

    var probeDragYRange = new Range( beakerTop - 20, beakerTop + 50 );

    //probeSize in view Coordinates
    var probeSize = new Dimension2( modelViewTransform.modelToViewDeltaX( PROBE_SIZE.width ),
      modelViewTransform.modelToViewDeltaY( -PROBE_SIZE.height ) );

    ConductivityTesterNode.call( this,
      conductivityTester.brightnessProperty,
      conductivityTesterProperties.locationProperty,
      conductivityTesterProperties.positiveProbeLocationProperty,
      conductivityTesterProperties.negativeProbeLocationProperty, {
        probeSize: probeSize,
        probeDragYRange: probeDragYRange,
        negativeProbeFill: 'green',
        positiveLabelFill: 'black',
        negativeLabelFill: 'black',
        wireStroke: new Color(192, 192, 192),
        wireLineWidth: 2,
        bulbImageScale: 0.7,
        batteryImageScale: 0.8
      }
    );

  }

  return inherit( ConductivityTesterNode, SugarAndSaltSolutionsConductivityTesterNode, {} );
} );
