// Copyright 2002-2011, University of Colorado
/**
 * Canvas for the "micro" tab of the sugar and salt solutions sim.  This shares lots of functionality with the first tab, so much of that code is reused by extending BeakerAndShakerCanvas.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'java.awt.Rectangle' );
  var ActionEvent = require( 'java.awt.event.ActionEvent' );
  var ActionListener = require( 'java.awt.event.ActionListener' );
  var Rectangle = require( 'KITE/Rectangle' );
  var SwingUtilities = require( 'javax.swing.SwingUtilities' );
  var Module = require( 'edu.colorado.phet.common.phetcommon.application.Module' );
  var Property = require( 'AXON/Property' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var TextButtonNode = require( 'edu.colorado.phet.common.piccolophet.nodes.TextButtonNode' );
  var ZeroOffsetNode = require( 'edu.colorado.phet.common.piccolophet.nodes.kit.ZeroOffsetNode' );
  var FloatingClockControlNode = require( 'edu.colorado.phet.common.piccolophet.nodes.mediabuttons.FloatingClockControlNode' );
  var GlobalState = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/GlobalState' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var BeakerAndShakerCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var PeriodicTableDialog = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/view/periodictable/PeriodicTableDialog' );
  var Node = require( 'SCENERY/nodes/Node' );
  var createRectangleInvertedYMapping = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform.createRectangleInvertedYMapping' );//static
  var Strings = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings' );//static ///*

  function MicroCanvas( model, globalState ) {

    //private
    this.periodicTableDialog;

    //private
    this.dialogVisibleOnActivate;
    //If set to true, will highlight regions where crystals can be grown

    //private
    this.debugBindingSites = false;

    //private
    this.microKitControlNode;
    //Keep track of the global state to access the PhetFrame to position the Periodic Table Dialog

    //private
    this.globalState;
    BeakerAndShakerCanvas.call( this, model, globalState, createMicroTransform( model ), true, false );
    this.globalState = globalState;
    //List of the kits the user can choose from, for showing the appropriate bar charts + controls
    var kitList = new MicroSoluteKitList( model, transform );
    //Show the concentration bar chart behind the shaker so the user can drag the shaker in front
    var concentrationBarChart = new ExpandableConcentrationBarChartNode( model.showConcentrationBarChart, model.showConcentrationValues ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( stageSize.getWidth() - getFullBoundsReference().width - INSET, INSET );
        model.selectedKit.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( kit ) {
            setBars( kitList.getKit( kit ).barItems );
          }
        } ) );
      }
    } );
    behindShakerNode.addChild( concentrationBarChart );
    //Reads "remove solute" if one solute type, "remove solutes" if two solute types
    addChild( new RemoveSolutesButton( REMOVE_SOLUTE, model.numberSoluteTypes.valueEquals( 1.0 ), model ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( evaporationSlider.getFullBounds().getMaxX() + INSET, evaporationSlider.getFullBounds().getY() );
      }
    } ) );
    addChild( new RemoveSolutesButton( REMOVE_SOLUTES, model.numberSoluteTypes.greaterThan( 1 ), model ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( evaporationSlider.getFullBounds().getMaxX() + INSET, evaporationSlider.getFullBounds().getY() );
      }
    } ) );
    //A button that shows the periodic table when pressed, shown inside the kit selection node since the selected item controls what is highlighted in the periodic table
    var periodicTableButton = new TextButtonNode( PERIODIC_TABLE, CONTROL_FONT, Color.yellow ).withAnonymousClassBody( {
      initializer: function() {
        addActionListener( new ActionListener().withAnonymousClassBody( {
          actionPerformed: function( e ) {
            //Only create the periodic table dialog once
            if ( periodicTableDialog == null ) {
              periodicTableDialog = new PeriodicTableDialog( model.dispenserType, globalState.colorScheme, globalState.frame ).withAnonymousClassBody( {
                initializer: function() {
                  //Show the periodic table dialog to the left side of the window and underneath the solute control
                  var parentBounds = globalState.frame.getBounds();
                  //Setting the X to be the same as the parent X actually has the incorrect effect of moving it about 15 pixels to the left of the main frame, so translate to compensate for this bug
                  var dialogBounds = new Rectangle( (parentBounds.getMinX() + 15), (parentBounds.getMinY() + getKitControlNodeY() + INSET * 2), getWidth(), getHeight() );
                  setLocation( dialogBounds.x, dialogBounds.y );
                }
              } );
            }
            //Show the dialog window with the periodic table
            periodicTableDialog.setVisible( true );
          }
        } ) );
      }
    } );
    //Show the kit control node that allows the user to scroll through different kits
    microKitControlNode = new ZeroOffsetNode( new MicroKitControlNode( model.selectedKit, model.dispenserType, periodicTableButton, globalState.singleMicroKit ).withAnonymousClassBody( {
      initializer: function() {
        model.addResetListener( new VoidFunction0().withAnonymousClassBody( {
          apply: function() {
            kitSelectionNode.selectedKit.set( 0 );
          }
        } ) );
      }
    } ) );
    microKitControlNode.setOffset( concentrationBarChart.getFullBounds().getX() - microKitControlNode.getFullBounds().getWidth() - INSET - 10, concentrationBarChart.getFullBounds().getY() );
    behindShakerNode.addChild( microKitControlNode );
    //Hide the periodic table on reset, and set it to null so it will come up in the default location next time
    model.addResetListener( new VoidFunction0().withAnonymousClassBody( {
      apply: function() {
        if ( periodicTableDialog != null ) {
          periodicTableDialog.dispose();
          periodicTableDialog = null;
        }
      }
    } ) );
    //When any spherical particle is added in the model, add graphics for them in the view
    model.sphericalParticles.addElementAddedObserver( new SphericalParticleNodeFactory( model.sphericalParticles, transform, this, model.showChargeColor ) );
    //Add clock controls for pause/play/step
    addChild( new FloatingClockControlNode( model.clockRunning, NO_READOUT, model.clock, "", new Property( Color.white ) ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( 0, stageSize.getHeight() - getFullBounds().getHeight() );
      }
    } ) );
    //For debugging, show the location of binding sites
    if ( debugBindingSites ) {
      addChild( new BindingSiteDebugger( transform, model ) );
    }
  }

  return inherit( BeakerAndShakerCanvas, MicroCanvas, {
//Get the bottom of solute kit control node for purposes of showing the periodic table beneath it

    //private
    getKitControlNodeY: function() {
      return microKitControlNode.getFullBounds().getMaxY() + SwingUtilities.convertPoint( this, 0, 0, globalState.frame ).getY();
    },
//If the periodic table dialog was showing when the user switched away from this tab, restore it
    activated: function() {
      if ( periodicTableDialog != null && dialogVisibleOnActivate ) {
        periodicTableDialog.setVisible( true );
      }
    },
//When the user switches to another tab, remember whether the periodic table dialog was showing so it can be restored if necessary.
    deactivated: function() {
      if ( periodicTableDialog != null ) {
        dialogVisibleOnActivate = periodicTableDialog.isVisible();
        periodicTableDialog.setVisible( false );
      }
    },
//See docs in MacroCanvas.createMacroTransform, this variant is used to create the transform for the micro tab
    createMicroTransform: function( model ) {
      var modelScale = 0.75;
      return createRectangleInvertedYMapping( model.visibleRegion.toRectangle2D(), //Must be further to the right than the Macro canvas transform since the beaker labels take up more horizontal space
        new Rectangle.Number(//X position.  This number is hand tuned when the font, size location or style of the tick labels on the left of the beaker are changed
          42, //y-position: increasing this number moves down the beaker
          135, canvasSize.width * modelScale, canvasSize.height * modelScale ) );
    }
  } );
} );

