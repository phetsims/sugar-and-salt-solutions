// Copyright 2002-2011, University of Colorado
/**
 * Control panel for user options in the water tab
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var ActionEvent = require( 'java.awt.event.ActionEvent' );
  var ActionListener = require( 'java.awt.event.ActionListener' );
  var SwingUtilities = require( 'javax.swing.SwingUtilities' );
  var SettableNot = require( 'edu.colorado.phet.common.phetcommon.model.property.SettableNot' );
  var VerticalLayoutPanel = require( 'edu.colorado.phet.common.phetcommon.view.VerticalLayoutPanel' );
  var PropertyCheckBox = require( 'edu.colorado.phet.common.phetcommon.view.controls.PropertyCheckBox' );
  var SwingUtils = require( 'edu.colorado.phet.common.phetcommon.view.util.SwingUtils' );
  var PhetPText = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPText' );
  var TextButtonNode = require( 'edu.colorado.phet.common.piccolophet.nodes.TextButtonNode' );
  var VBox = require( 'edu.colorado.phet.common.piccolophet.nodes.layout.VBox' );
  var GlobalState = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/GlobalState' );
  var WhiteControlPanelNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/WhiteControlPanelNode' );
  var DeveloperControlDialog = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/dev/DeveloperControlDialog' );
  var WaterModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterModel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PSwing = require( 'edu.umd.cs.piccolox.pswing.PSwing' );
  var Strings = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings' );//static ///*
  var CONTROL_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/CONTROL_FONT' );//static
  var TITLE_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/TITLE_FONT' );//static

  function WaterControlPanel( waterModel, state, waterCanvas, sucrose3DDialog ) {
    WhiteControlPanelNode.call( this, new VBox(//Show the title "Show"
      new PhetPText( SHOW, TITLE_FONT ), //Put the checkboxes together in one VerticalLayoutPanel so they will be left-aligned
      new PSwing( new VerticalLayoutPanel().withAnonymousClassBody( {
        initializer: function() {
          //Checkbox to show/hide water charges (showing partial charges)
          add( new PropertyCheckBox( WATER_PARTIAL_CHARGES, waterModel.showWaterCharges ).withAnonymousClassBody( {
            initializer: function() {
              setFont( CONTROL_FONT );
            }
          } ) );
          //Works for both the sugar in the bucket and any in the model
          add( new PropertyCheckBox( SUGAR_HIGHLIGHT, new SettableNot( waterModel.showSugarAtoms ) ).withAnonymousClassBody( {
            initializer: function() {
              setFont( CONTROL_FONT );
            }
          } ) );
        }
      } ) ), //If development version, show button to launch developer controls
      state.config.isDev() ? new TextButtonNode( "Developer Controls" ).withAnonymousClassBody( {
        initializer: function() {
          addActionListener( new ActionListener().withAnonymousClassBody( {
            var dialog = null,
            actionPerformed: function( e ) {
              if ( dialog == null ) {
                dialog = new DeveloperControlDialog( SwingUtilities.getWindowAncestor( waterCanvas ), waterModel );
                SwingUtils.centerInParent( dialog );
              }
              dialog.setVisible( true );
            }
          } ) );
        }
      } ) : new Node(), //Add a button that allows the user to show the 3D water molecule
      new TextButtonNode( SUGAR_IN_3_D, CONTROL_FONT, Color.yellow ).withAnonymousClassBody( {
        initializer: function() {
          addActionListener( new ActionListener().withAnonymousClassBody( {
            actionPerformed: function( e ) {
              sucrose3DDialog.showDialog();
            }
          } ) );
        }
      } ) ) );
  }

  return inherit( WhiteControlPanelNode, WaterControlPanel, {
  } );
} );

