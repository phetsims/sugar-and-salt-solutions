// Copyright 2002-2011, University of Colorado
/**
 * Creates and displays the JmolDialog, and minimizes and restores it when the user switches tabs
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var BufferedReader = require( 'java.io.BufferedReader' );
  var InputStreamReader = require( 'java.io.InputStreamReader' );
  var MessageFormat = require( 'java.text.MessageFormat' );
  var JFrame = require( 'javax.swing.JFrame' );
  var JmolViewer = require( 'org.jmol.api.JmolViewer' );
  var JmolDialog = require( 'edu.colorado.phet.common.jmolphet.JmolDialog' );
  var JmolUtil = require( 'edu.colorado.phet.common.jmolphet.JmolUtil' );
  var Molecule = require( 'edu.colorado.phet.common.jmolphet.Molecule' );
  var WaterMolecule = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterMolecule' );
  var RESOURCES = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/RESOURCES' );//static
  var Strings = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings' );//static ///*

  function Sucrose3DDialog( parent, backgroundColor ) {
    //The JmolDialog which shows the sucrose in 3d

    //private
    this.jmolDialog = null;
    //Flag to indicate whether the JMolDialog should be shown when the user switches to this tab

    //private
    this.showJMolDialogOnActivate;
    //Parent for the dialog

    //private
    this.parent;

    //private
    this.backgroundColor;
    this.parent = parent;
    this.backgroundColor = backgroundColor;
  }

  return inherit( Object, Sucrose3DDialog, {
//Shows the 3d sucrose view in a dialog, creating the dialog lazily if necessary
    showDialog: function() {
      if ( jmolDialog == null ) {
        jmolDialog = JmolDialog.displayMolecule3D( parent, new Molecule().withAnonymousClassBody( {
            getDisplayName: function() {
              return SUGAR;
            },
            getData: function() {
              return loadSucroseStructure();
            },
            fixJmolColors: function( viewer ) {
              //Use the specified background color for jmol.  In this case the background is water blue since the sucrose is in the water
              viewer.script( "color background " + toJmolColor( backgroundColor ) );
              // use custom colors for some atoms, but don't set the color for carbon to gray (even though that is its color) otherwise Jmol will make it too dark
              viewer.script( "select oxygen; color " + toJmolColor( new WaterMolecule.Oxygen().color ) );
              // be polite to other scripts that assume that everything is selected
              viewer.script( "select all" );
              //Make it so you can't zoom in and out, but you can still click left to rotate
              JmolUtil.unbindMouse( viewer );
              JmolUtil.bindRotateLeft( viewer );
            }
          } ), //These strings duplicated in Build a Molecule
          SPACE_FILL, BALL_AND_STICK, LOADING );
        //Show the loading screen background as light blue, like the final background when the molecule is loaded
        jmolDialog.getJmolPanel().setBackground( backgroundColor );
        //Since the loading background screen is light, show the "loading..." text in black
        jmolDialog.getJmolPanel().getLoadingText().setForeground( Color.black );
      }
      else {
        jmolDialog.setVisible( true );
      }
    },
//Called when the user switches to the water tab from another tab.  Remembers if the JMolDialog was showing and restores it if so
    activate: function() {
      if ( jmolDialog != null ) {
        jmolDialog.setVisible( showJMolDialogOnActivate );
      }
    },
//Called when the user switches to another tab.  Stores the state of the jmol dialog so that it can be restored when the user comes back to this tab
    deactivate: function() {
      showJMolDialogOnActivate = jmolDialog != null && jmolDialog.isVisible();
      if ( jmolDialog != null ) {
        jmolDialog.setVisible( false );
      }
    },
//Load the 3d structure of sucrose

    //private
    loadSucroseStructure: function() {
      try {
        var structureReader = new BufferedReader( new InputStreamReader( RESOURCES.getResourceAsStream( "sucrose.pdb" ) ) );
        var s = "";
        var line = structureReader.readLine();
        while ( line != null ) {
          s = s + line + "\n";
          line = structureReader.readLine();
        }
        return s;
      }
      catch( /*Exception*/ e ) {
        throw new RuntimeException( e );
      }
    },
    reset: function() {
      //When the module is reset, close the jmol dialog if it is open
      if ( jmolDialog != null ) {
        jmolDialog.setVisible( false );
        //Set it to null so that when it is opened again it will be in the startup location instead of saved location
        jmolDialog = null;
      }
    },
// Converts an AWT Color to a Jmol RGB-color argument, a String of the form "[R,G,B]". Eg, Color.ORANGE -> eg "[255,200,0]".
//Copied from simulations-java\simulations\molecule-polarity\src\edu\colorado\phet\moleculepolarity\common\view\JmolViewerNode.java
    toJmolColor: function( color ) {
      return MessageFormat.format( "[{0},{1},{2}]", color.getRed(), color.getGreen(), color.getBlue() );
    }
  } );
} );

