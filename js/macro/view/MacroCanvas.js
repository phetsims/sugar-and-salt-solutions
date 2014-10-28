// Copyright 2002-2011, University of Colorado
/**
 * Canvas for the introductory (macro) tab of sugar and salt solutions
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'KITE/Rectangle' );
  var DecimalFormat = require( 'java.text.DecimalFormat' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var GlobalState = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/GlobalState' );
  var Strings = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var BeakerAndShakerCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas' );
  var CrystalMaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/CrystalMaker' );
  var DispenserRadioButtonSet = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/DispenserRadioButtonSet' );
  var SaltNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SaltNode' );
  var SelectableSoluteItem = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SelectableSoluteItem' );
  var SoluteControlPanelNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SoluteControlPanelNode' );
  var SugarNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SugarNode' );
  var VolumeIndicatorNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/VolumeIndicatorNode' );
  var MacroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroModel' );
  var MacroSalt = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroSalt' );
  var MacroSugar = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroSugar' );
  var Node = require( 'SCENERY/nodes/Node' );
  var createRectangleInvertedYMapping = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform.createRectangleInvertedYMapping' );//static
  var SALT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/SALT' );//static
  var SUGAR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/SUGAR' );//static
  var metersCubedToLiters = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Units/metersCubedToLiters' );//static

  function MacroCanvas( model, globalState ) {
    //Separate layer for the conductivity toolbox to make sure the conductivity node shows as submerged in the water, but still goes behind the shaker
    this.conductivityToolboxLayer = new Node();
    this.concentrationBarChart;

    //private
    this.soluteControlPanelNode;
    BeakerAndShakerCanvas.call( this, model, globalState, createMacroTransform( model ), false, true );
    //Layer that holds the sugar and salt crystals
    var crystalLayer = new Node();
    //Show the crystal layer behind the water and beaker so the crystals look like they go into the water instead of in front of it.
    submergedInWaterNode.addChild( crystalLayer );
    //Add salt crystals graphics when salt crystals are added to the model
    model.saltAdded.addListener( new CrystalMaker( crystalLayer, new Function1().withAnonymousClassBody( {
      apply: function( salt ) {
        return new SaltNode( transform, salt, globalState.colorScheme.saltColor.color );
      }
    } ) ) );
    //Add sugar crystals graphics when sugar crystals are added to the model
    model.sugarAdded.addListener( new CrystalMaker( crystalLayer, new Function1().withAnonymousClassBody( {
      apply: function( sugar ) {
        return new SugarNode( transform, sugar, globalState.colorScheme.saltColor.color );
      }
    } ) ) );
    //Show the precipitate as the sum of salt and sugar
    submergedInWaterNode.addChild( new PrecipitateNode( transform, model.salt.solidVolume.plus( model.sugar.solidVolume ), model.beaker ) );
    //Read out more precisely than the fine-grained tick marks on the side
    var beakerVolumeReadoutFormat = new Function1().withAnonymousClassBody( {
      var decimalFormat = new DecimalFormat( "0.00" ),
      apply: function( volumeInMetersCubed ) {
        return decimalFormat.format( metersCubedToLiters( volumeInMetersCubed ) );
      }
    } );
    //Readout the volume of the water in Liters, only visible if the user opted to show values (in the concentration bar chart)
    addChild( new VolumeIndicatorNode( transform, model.solution, model.showConcentrationValues, model.getAnySolutes(), beakerVolumeReadoutFormat ) );
    //This tab uses the conductivity tester
    submergedInWaterNode.addChild( conductivityToolboxLayer );
    //Show the concentration bar chart behind the shaker so the user can drag the shaker in front
    concentrationBarChart = new ExpandableConcentrationBarChartNode( model.showConcentrationBarChart, model.saltConcentration, model.sugarConcentration, model.showConcentrationValues, 1 ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( stageSize.getWidth() - getFullBoundsReference().width - INSET, INSET );
      }
    } );
    behindShakerNode.addChild( concentrationBarChart );
    //Create the control panel for choosing sugar vs salt, use a radio-button-based selector for solutes.
    soluteControlPanelNode = new SoluteControlPanelNode( new DispenserRadioButtonSet( model.dispenserType, new SelectableSoluteItem( Strings.SALT, SALT ), new SelectableSoluteItem( Strings.SUGAR, SUGAR ) ) );
    soluteControlPanelNode.setOffset( stageSize.getWidth() - soluteControlPanelNode.getFullBounds().getWidth() - INSET, 150 );
    //Show the solute control panel node behind the shaker node so the conductivity tester will also go in front
    behindShakerNode.addChild( soluteControlPanelNode );
    soluteControlPanelNode.setOffset( concentrationBarChart.getFullBounds().getX() - soluteControlPanelNode.getFullBounds().getWidth() - INSET, concentrationBarChart.getFullBounds().getY() );
    //Toolbox from which the conductivity tester can be dragged
    conductivityToolboxLayer.addChild( new ConductivityTesterToolboxNode( model, this, globalState.colorScheme.whiteBackground ).withAnonymousClassBody( {
      initializer: function() {
        //Set the location of the control panel
        setOffset( stageSize.getWidth() - getFullBounds().getWidth() - INSET, concentrationBarChart.getFullBounds().getMaxY() + INSET );
      }
    } ) );
    //Button should be inside the beaker at the bottom right so it doesn't collide with the leftmost tick marks
    addChild( new RemoveSoluteControlNode( model ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( transform.modelToViewX( model.beaker.getMaxX() ) - getFullBounds().getWidth() - INSET, transform.modelToViewY( model.beaker.getY() ) - getFullBounds().getHeight() - INSET );
      }
    } ) );
  }

  return inherit( BeakerAndShakerCanvas, MacroCanvas, {
//Create the transform from model (SI) to view (stage) coordinates.  Public and static since it is also used to create the MiniBeakerNode in the Water tab
    createMacroTransform: function( model ) {
      //Scale the model down so there will be room for control panels.
      var modelScale = 0.75;
      return createRectangleInvertedYMapping( model.visibleRegion.toRectangle2D(), // leaving enough room for controls, labels, and positioning it so it appears near the bottom
        new Rectangle.Number( 20, //y-position: increasing this number moves down the beaker
          135, canvasSize.width * modelScale, canvasSize.height * modelScale ) );
    }
  } );
} );

