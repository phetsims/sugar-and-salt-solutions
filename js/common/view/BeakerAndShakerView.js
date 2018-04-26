// Copyright 2014-2018, University of Colorado Boulder

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
  var BeakerNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/BeakerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var EvaporationSlider = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/EvaporationSlider' );
  var FaucetMetrics = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/FaucetMetrics' );
  var FaucetNodeContainer = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/FaucetNodeContainer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SolutionNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SolutionNode' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var SugarAndSaltSolutionsView = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SugarAndSaltSolutionsView' );
  var WaterNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/WaterNode' );

  //constants
  var WATER_COLOR = new Color( 179, 239, 243 );

  //Insets to be used for padding between edge of canvas and controls, or between controls
  var INSET = 5;


  /**
   *
   * @param {SugarAndSaltSolutionsModel} model
   * @param {Bounds2} layoutBounds
   * @param {ModelViewTransform2} modelViewTransform
   * @param {boolean} micro
   * @param {boolean} showBeakerTickLabels

   * @constructor
   */
  function BeakerAndShakerView( model, layoutBounds, modelViewTransform, micro, showBeakerTickLabels ) {
    var self = this;
    SugarAndSaltSolutionsView.call( self, layoutBounds );

    self.micro = micro; //This flag indicates whether it is the micro or macro tab since different images are used depending on the tab
    self.showBeakerTickLabels = showBeakerTickLabels; //Ticks are shown in Macro and Micro tab, but values are omitted from Micro tab

    //Gets the ModelViewTransform used to go between model coordinates (SI) and stage coordinates (roughly pixels)
    //The member  name transform  overrides the inbuilt //Ashraf
    //@protected
    self.modelViewTransform = modelViewTransform;

    //Show the water flowing out of the top and bottom faucets
    self.addChild( new WaterNode( modelViewTransform, model.inputWater ) );
    self.addChild( new WaterNode( modelViewTransform, model.outputWater ) );

    //Add the faucets, the first faucet should have the water stop at the base of the beaker. This faucet should extend very far in
    //case the user makes the sim short and fat, so the faucet pipe will always be visible
    //Also, require the clock to be running for the faucets to be enabled so the user can't try to add water
    //while the sim is paused (2nd tab only)
    var maxFlowRate = 1;
    var inputFaucetNode = new FaucetNodeContainer( maxFlowRate, model.inputFlowRate,
      new DerivedProperty( [ model.clockRunningProperty, model.beakerFull ],
        function( clockRunning, beakerFull ) {
          return clockRunning && !beakerFull;
        } ), {
        horizontalPipeLength: 2000,
        closeOnRelease: true,
        scale: 0.6
      } );

    inputFaucetNode.x = 143;
    inputFaucetNode.y = 155;
    self.addChild( inputFaucetNode );

    model.setInputFaucetMetrics( FaucetMetrics.createFaucetMetricsByFaucetNode( modelViewTransform, model,
      self.rootNode, inputFaucetNode ) );

    //Add a faucet that drains the beaker; there is no input pipe for this since it attaches directly to the beaker
    //Move it far enough from the beaker that the slider isn't touching it, but not so far that the flowing water would
    //overlap the reset all button.Also, require the clock to be running for the faucets to be enabled so the
    //user can't try to drain water while the sim is paused (2nd tab only)
    var distanceFromBeaker = 110;
    var drainFaucetNode = new FaucetNodeContainer( maxFlowRate, model.outputFlowRate,
      new DerivedProperty( [ model.clockRunningProperty, model.lowerFaucetCanDrain ], function( clockRunning, lowerFaucetCanDrain ) {
        return clockRunning && lowerFaucetCanDrain;
      } ), {
        scale: 0.6,
        horizontalPipeLength: 180,
        closeOnRelease: true
      } );

    var beakerBottomRight = model.beaker.getOutputFaucetAttachmentPoint();
    var beakerBottomRightView = modelViewTransform.modelToViewPosition( beakerBottomRight );

    //y-value hand tuned so the bottom of the faucet input pipe lines up with the bottom of the water when at the minimum
    //fluid level
    var distanceFromBeakerBottom = 35;
    drainFaucetNode.x = beakerBottomRightView.x + distanceFromBeaker;
    drainFaucetNode.y = self.bounds.maxY - beakerBottomRightView.y - distanceFromBeakerBottom;
    self.addChild( drainFaucetNode );

    //Use the view coordinates to set the model coordinates for how particle should flow toward and flow out the drain pipe
    //But make sure the output drain input point is within the fluid so particles can reach it
    var fullShape = model.beaker.getWaterShape( 0, model.beaker.getMaxFluidVolume() );
    model.setDrainFaucetMetrics( FaucetMetrics.createFaucetMetricsByFaucetNode( modelViewTransform, model,
      self.rootNode, drainFaucetNode ).clampInputWithinFluid( fullShape.bounds.getMaxX() - fullShape.bounds.getWidth() * 0.02 )
    );

    //Add a node for children that should be behind the shakers
    //@protected
    self.behindShakerNode = new Node();
    self.addChild( self.behindShakerNode );

    //For nodes that should look like they go into the water, such as the conductivity tester probes
    self.submergedInWaterNode = new Node();

    //make sure the shaker doesn't go out of bounds
    var shakerConstraintRegion = new Bounds2( model.dragRegion.minX, model.beaker.getTopY() * 1.3,
      model.dragRegion.maxX, model.beaker.getTopY() * 2 );

    //add the salt and sugar dispenser nodes, which should always be in front of everything
    _.each( model.dispensers, function( dispenser ) {
      self.submergedInWaterNode.addChild( dispenser.createNode( modelViewTransform, self.micro, shakerConstraintRegion ) );
    } );

    self.addChild( new BeakerNode( model.beaker, modelViewTransform ) );

    //Show the full water node at the correct color, then overlay a partially transparent one on top, so that
    //some objects (such as the conductivity tester) will look submerged
    self.addChild( new SolutionNode( modelViewTransform, model.solution, WATER_COLOR ) );


    //Node that shows things that get submerged such as the conductivity tester
    self.addChild( self.submergedInWaterNode );

    //Overlay node that renders as partially transparent in front of submerged objects, such as the conductivity tester.
    //When changing the transparency here make sure it looks good for precipitate as well as submerged probes
    self.addChild( new SolutionNode( modelViewTransform, model.solution, new Color( WATER_COLOR.getRed(),
      WATER_COLOR.getGreen(), WATER_COLOR.getBlue(), 0.5 ) ) );// 0.5 is opacity

    //Add an evaporation rate slider below the beaker
    var evaporationSlider = new EvaporationSlider( model.evaporationRate, model.waterVolume, model.clockRunningProperty );
    var point = modelViewTransform.modelToViewXY( 0, -model.beaker.getWallThickness() / 2 );
    evaporationSlider.x = point.x - evaporationSlider.bounds.getWidth() / 2;
    evaporationSlider.y = point.y + INSET;

    //Other content that should go behind the shakers
    //Add it behind the shaker node so the conductivity tester will also go in front
    self.behindShakerNode.addChild( evaporationSlider );

  }

  sugarAndSaltSolutions.register( 'BeakerAndShakerView', BeakerAndShakerView );

  return inherit( SugarAndSaltSolutionsView, BeakerAndShakerView, {} );
} );