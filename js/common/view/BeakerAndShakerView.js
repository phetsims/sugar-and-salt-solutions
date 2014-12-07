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
  var BeakerNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/BeakerNode' );
  var WaterNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/WaterNode' );
  var SugarAndSaltSolutionsView = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SugarAndSaltSolutionsView' );
  var FaucetNodeContainer = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/FaucetNodeContainer' );
  var FaucetMetrics = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/FaucetMetrics' );


  //constants
  // var INSET = 5;//Insets to be used for padding between edge of canvas and controls, or between controls
  //Fonts
  // var CONTROL_FONT = new PhetFont( 16 );
  // var TITLE_FONT = new PhetFont( 18 );

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

    model.setInputFaucetMetrics( FaucetMetrics.createFaucetMetricsByFaucetNode( modelViewTransform, model, thisView.rootNode, inputFaucetNode ) );


    //Temp test
    thisView.addChild( new BeakerNode( model.beaker, modelViewTransform ) );

  }

  return inherit( SugarAndSaltSolutionsView, BeakerAndShakerView, {

  } );
} );