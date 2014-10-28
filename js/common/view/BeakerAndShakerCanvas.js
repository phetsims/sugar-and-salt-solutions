// Copyright 2002-2011, University of Colorado
/**
 * Canvas for the tabs 1-2 (which both use a beaker and shaker) in the Sugar and Salt Solutions Sim
 * Some nodes position themselves (where it was possible to factor out the layout code)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension = require( 'java.awt.Dimension' );
  var Font = require( 'SCENERY/util/Font' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var Rectangle = require( 'KITE/Rectangle' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetFont = require( 'edu.colorado.phet.common.phetcommon.view.util.PhetFont' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var FaucetNode = require( 'edu.colorado.phet.common.piccolophet.nodes.faucet.FaucetNode' );
  var ToolboxCanvas = require( 'edu.colorado.phet.common.piccolophet.nodes.toolbox.ToolboxCanvas' );
  var GlobalState = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/GlobalState' );
  var UserComponents = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsSimSharing/UserComponents' );
  var Dispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Dispenser' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PBasicInputEventHandler = require( 'edu.umd.cs.piccolo.event.PBasicInputEventHandler' );
  var PInputEvent = require( 'edu.umd.cs.piccolo.event.PInputEvent' );
  var PDimension = require( 'edu.umd.cs.piccolo.util.PDimension' );
  var not = require( 'edu.colorado.phet.common.phetcommon.model.property.Not.not' );//static

  var WATER_COLOR = new Color( 179, 239, 243 );
//Insets to be used for padding between edge of canvas and controls, or between controls
  var INSET = 5;
//Fonts
  var CONTROL_FONT = new PhetFont( 16, true );
  var TITLE_FONT = new PhetFont( 18, true );
//Actual size of the canvas coming up on windows from the IDE (with tabs) is java.awt.Dimension[width=1008,height=676].
//This field is public so the model can use the same aspect ratio (to simplify layout and minimize blank regions)
  var canvasSize = new Dimension( 1008, 676 );
//Color for reset and remove buttons
  var BUTTON_COLOR = new Color( 255, 153, 0 );

  function BeakerAndShakerCanvas( model, globalState, transform, //This flag indicates whether it is the micro or macro tab since different images are used depending on the tab
                                  micro, //Ticks are shown in Macro and Micro tab, but values are omitted from Micro tab
                                  showBeakerTickLabels ) {
    this.stageSize;
    this.transform;
    //Other content that should go behind the shakers
    this.behindShakerNode;
    //For nodes that should look like they go into the water, such as the conductivity tester probes
    this.submergedInWaterNode = new Node();
    //Node that shows the faucet, we need a reference so subclasses can listen to the water flowing out bounds for collision hit testing for the conductivity tester
    this.drainFaucetNode;
    //Store a reference to the EvaporationSlider for layout purposes
    this.evaporationSlider;
    //Debugging flag

    //private
    this.debug = false;
    //Flag to indicate debugging of the model visible bounding region, used for layouts

    //private
    this.debugVisibleBounds = false;
    //Set the stage size according to the same aspect ratio as used in the model
    stageSize = new PDimension( canvasSize.width, (canvasSize.width / model.visibleRegion.width * model.visibleRegion.height) );
    //Gets the ModelViewTransform used to go between model coordinates (SI) and stage coordinates (roughly pixels)
    this.transform = transform;
    //Use the background color specified in the backgroundColor, since it is changeable in the developer menu
    globalState.colorScheme.backgroundColorSet.color.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( color ) {
        setBackground( color );
      }
    } ) );
    //Set the transform from stage coordinates to screen coordinates
    setWorldTransformStrategy( new CenteredStage( this, stageSize ) );
    //Add the reset all button
    addChild( new SugarAndSaltSolutionsResetAllButtonNode( stageSize.getWidth(), stageSize.getHeight(), new VoidFunction0().withAnonymousClassBody( {
      apply: function() {
        model.reset();
      }
    } ) ) );
    //Show the water flowing out of the top and bottom faucets
    addChild( new WaterNode( transform, model.inputWater ) );
    addChild( new WaterNode( transform, model.outputWater ) );
    //Also, require the clock to be running for the faucets to be enabled so the user can't try to add water while the sim is paused (2nd tab only)
    var inputFaucetNode = new FaucetNode( UserComponents.inputFaucet, model.inputFlowRate, model.clockRunning.and( not( model.beakerFull ) ), 10000, true ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( 50, 10 );
      }
    } );
    addChild( inputFaucetNode );
    model.setInputFaucetMetrics( new FaucetMetrics( transform, model, rootNode, inputFaucetNode ) );
    //Also, require the clock to be running for the faucets to be enabled so the user can't try to drain water while the sim is paused (2nd tab only)
    var distanceFromBeaker = 12;
    drainFaucetNode = new FaucetNode( UserComponents.drainFaucet, model.outputFlowRate, model.clockRunning.and( model.lowerFaucetCanDrain ), distanceFromBeaker, true ).withAnonymousClassBody( {
      initializer: function() {
        //y-value hand tuned so the bottom of the faucet input pipe lines up with the bottom of the water when at the minimum fluid level
        var beakerBottomRight = model.beaker.getOutputFaucetAttachmentPoint();
        var beakerBottomRightView = transform.modelToView( beakerBottomRight );
        setOffset( beakerBottomRightView.getX() + 7 + distanceFromBeaker, beakerBottomRightView.getY() - getFullBounds().getHeight() * 0.8 );
      }
    } );
    addChild( drainFaucetNode );
    //But make sure the output drain input point is within the fluid so particles can reach it
    var fullShape = model.beaker.getWaterShape( 0, model.beaker.getMaxFluidVolume() );
    model.setDrainFaucetMetrics( new FaucetMetrics( transform, model, rootNode, drainFaucetNode ).clampInputWithinFluid( fullShape.getMaxX() - fullShape.getWidth() * 0.02 ) );
    //Add a node for children that should be behind the shakers
    behindShakerNode = new Node();
    addChild( behindShakerNode );
    //add the salt and sugar dispenser nodes, which should always be in front of everything
    for ( var dispenser in model.dispensers ) {
      submergedInWaterNode.addChild( dispenser.createNode( transform, micro, model.dragConstraint ) );
    }
    //Add beaker node that shows border of the beaker and tick marks
    addChild( new BeakerNodeWithTicks( transform, model.beaker, showBeakerTickLabels, globalState.colorScheme.whiteBackground ) );
    //Debug for showing stage
    if ( debug ) {
      addChild( new PhetPPath( new Rectangle.Number( 0, 0, stageSize.getWidth(), stageSize.getHeight() ), new BasicStroke( 2 ), Color.red ) );
      //Show the model coordinates for clicked points, this can help us come up with good model coordinates for graphics that are mainly positioned in the view, such as faucet connector points
      addInputEventListener( new PBasicInputEventHandler().withAnonymousClassBody( {
        mousePressed: function( event ) {
          console.log( "modelPoint = " + transform.viewToModel( event.getPositionRelativeTo( rootNode ) ) );
        }
      } ) );
    }
    //Show the full water node at the correct color, then overlay a partially transparent one on top, so that some objects (such as the conductivity tester) will look submerged
    addChild( new SolutionNode( transform, model.solution, WATER_COLOR ) );
    //Node that shows things that get submerged such as the conductivity tester
    addChild( submergedInWaterNode );
    //When changing the transparency here make sure it looks good for precipitate as well as submerged probes
    addChild( new SolutionNode( transform, model.solution, new Color( WATER_COLOR.getRed(), WATER_COLOR.getGreen(), WATER_COLOR.getBlue(), 128 ) ) );
    //Add an evaporation rate slider below the beaker
    evaporationSlider = new EvaporationSlider( model.evaporationRate, model.waterVolume, model.clockRunning ).withAnonymousClassBody( {
      initializer: function() {
        var point = BeakerAndShakerCanvas.this.transform.modelToView( 0, -model.beaker.getWallThickness() / 2 );
        setOffset( point.getX() - getFullBounds().getWidth() / 2, point.getY() + INSET );
      }
    } );
    //Add it behind the shaker node so the conductivity tester will also go in front
    behindShakerNode.addChild( evaporationSlider );
    //Add a graphic to show where particles will flow out the drain
    addChild( new DrainFaucetNodeLocationDebugger( transform, model ) );
    if ( debugVisibleBounds ) {
      addChild( new PhetPPath( new BasicStroke( 1 ), Color.red ).withAnonymousClassBody( {
        initializer: function() {
          setPathTo( transform.modelToView( model.visibleRegion ).toShape() );
        }
      } ) );
    }
  }

  return inherit( SugarAndSaltSolutionsCanvas, BeakerAndShakerCanvas, {
      getModelViewTransform: function() {
        return transform;
      }
    },
//statics
    {
      WATER_COLOR: WATER_COLOR,
      INSET: INSET,
      CONTROL_FONT: CONTROL_FONT,
      TITLE_FONT: TITLE_FONT,
      canvasSize: canvasSize,
      BUTTON_COLOR: BUTTON_COLOR
    } );
} );

