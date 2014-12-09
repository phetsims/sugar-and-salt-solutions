//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the tabs 1-2 (which both use a beaker and shaker) in the Sugar and Salt Solutions Sim
 * Some nodes position themselves (where it was possible to factor out the layout code)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BeakerNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/BeakerNode' );
  var WaterNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/WaterNode' );
  var SolutionNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SolutionNode' );
  var SugarAndSaltSolutionsView = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SugarAndSaltSolutionsView' );
  var FaucetNodeContainer = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/FaucetNodeContainer' );
  var FaucetMetrics = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/FaucetMetrics' );
  var Color = require( 'SCENERY/util/Color' );

  //constants
  var WATER_COLOR = new Color( 179, 239, 243 );


  /**
   *
   * @param {SugarAndSaltSolutionsModel} model
   * @param {Bounds2} layoutBounds
   * @param {GlobalState} globalState
   * @param {ModelViewTransform2} modelViewTransform
   * @param {boolean} micro
   * @param {boolean} showBeakerTickLabels

   * @constructor
   */
  function BeakerAndShakerView( model, layoutBounds, globalState, modelViewTransform, micro, showBeakerTickLabels ) {
    var thisView = this;
    SugarAndSaltSolutionsView.call( thisView, layoutBounds );

    thisView.micro = micro; //This flag indicates whether it is the micro or macro tab since different images are used depending on the tab
    thisView.showBeakerTickLabels = showBeakerTickLabels; //Ticks are shown in Macro and Micro tab, but values are omitted from Micro tab

    //Gets the ModelViewTransform used to go between model coordinates (SI) and stage coordinates (roughly pixels)
    //The member  name transform  overrides the inbuilt //Ashraf
    thisView.modelViewTransform = modelViewTransform;

    //Show the water flowing out of the top and bottom faucets
    thisView.addChild( new WaterNode( modelViewTransform, model.inputWater ) );
    thisView.addChild( new WaterNode( modelViewTransform, model.outputWater ) );

    //Add the faucets, the first faucet should have the water stop at the base of the beaker. This faucet should extend very far in
    //case the user makes the sim short and fat, so the faucet pipe will always be visible
    //Also, require the clock to be running for the faucets to be enabled so the user can't try to add water
    //while the sim is paused (2nd tab only)
    var maxFlowRate = 1;
    var inputFaucetNode = new FaucetNodeContainer( maxFlowRate, model.inputFlowRate,
      model.clockRunning.and( model.beakerFull.derivedNot() ), {
        horizontalPipeLength: 2000,
        closeOnRelease: true,
        scale: 0.6
      } );

    inputFaucetNode.x = 143;
    inputFaucetNode.y = 155;
    thisView.addChild( inputFaucetNode );

    model.setInputFaucetMetrics( FaucetMetrics.createFaucetMetricsByFaucetNode( modelViewTransform, model,
      thisView.rootNode, inputFaucetNode ) );

    //Add a faucet that drains the beaker; there is no input pipe for this since it attaches directly to the beaker
    //Move it far enough from the beaker that the slider isn't touching it, but not so far that the flowing water would overlap the reset all button
    //Also, require the clock to be running for the faucets to be enabled so the user can't try to drain water while the sim is paused (2nd tab only)
    var distanceFromBeaker = 110;
    var drainFaucetNode = new FaucetNodeContainer( maxFlowRate, model.outputFlowRate,
      model.clockRunning.and( model.lowerFaucetCanDrain ), {
        scale: 0.6,
        horizontalPipeLength: 180,
        closeOnRelease: true
      } );

    var beakerBottomRight = model.beaker.getOutputFaucetAttachmentPoint();
    var beakerBottomRightView = modelViewTransform.modelToViewPosition( beakerBottomRight );

    //y-value hand tuned so the bottom of the faucet input pipe lines up with the bottom of the water when at the minimum fluid level
    var distanceFromBeakerBottom = 35;
    drainFaucetNode.x = beakerBottomRightView.x + distanceFromBeaker;
    drainFaucetNode.y = thisView.bounds.maxY - beakerBottomRightView.y - distanceFromBeakerBottom;
    console.log( beakerBottomRightView.y - thisView.bounds.height * 0.2 );

    thisView.addChild( drainFaucetNode );

    //Use the view coordinates to set the model coordinates for how particle should flow toward and flow out the drain pipe
    //But make sure the output drain input point is within the fluid so particles can reach it
    var fullShape = model.beaker.getWaterShape( 0, model.beaker.getMaxFluidVolume() );
    model.setDrainFaucetMetrics( FaucetMetrics.createFaucetMetricsByFaucetNode( modelViewTransform, model, thisView.rootNode, drainFaucetNode )
        .clampInputWithinFluid( fullShape.bounds.getMaxX() - fullShape.bounds.getWidth() * 0.02 )
    );


    //Add a node for children that should be behind the shakers
    thisView.behindShakerNode = new Node();
    thisView.addChild( thisView.behindShakerNode );

    //For nodes that should look like they go into the water, such as the conductivity tester probes
    var submergedInWaterNode = new Node();

    //add the salt and sugar dispenser nodes, which should always be in front of everything
    _.each( model.dispensers, function( dispenser ) {
      submergedInWaterNode.addChild( dispenser.createNode( modelViewTransform, thisView.micro, model.dragConstraint ) );
    } );

    thisView.addChild( new BeakerNode( model.beaker, modelViewTransform ) );

    //Show the full water node at the correct color, then overlay a partially transparent one on top, so that
    //some objects (such as the conductivity tester) will look submerged
    thisView.addChild( new SolutionNode( modelViewTransform, model.solution, WATER_COLOR ) );


    //Node that shows things that get submerged such as the conductivity tester
    thisView.addChild( submergedInWaterNode );

    //Overlay node that renders as partially transparent in front of submerged objects, such as the conductivity tester.
    //When changing the transparency here make sure it looks good for precipitate as well as submerged probes
    thisView.addChild( new SolutionNode( modelViewTransform, model.solution, new Color( WATER_COLOR.getRed(),
      WATER_COLOR.getGreen(), WATER_COLOR.getBlue(), 128 ) ) );

  }

  return inherit( SugarAndSaltSolutionsView, BeakerAndShakerView, {

  } );
} );