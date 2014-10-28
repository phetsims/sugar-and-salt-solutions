// Copyright 2002-2011, University of Colorado
/**
 * Main application for the PhET "Sugar and Salt Solutions" simulation
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Arrays = require( 'java.util.Arrays' );
  var PhetApplicationConfig = require( 'edu.colorado.phet.common.phetcommon.application.PhetApplicationConfig' );
  var PhetApplicationLauncher = require( 'edu.colorado.phet.common.phetcommon.application.PhetApplicationLauncher' );
  var Property = require( 'AXON/Property' );
  var ColorDialogMenuItem = require( 'edu.colorado.phet.common.phetcommon.view.menu.ColorDialogMenuItem' );
  var TeacherMenu = require( 'edu.colorado.phet.common.phetcommon.view.menu.TeacherMenu' );
  var PiccoloPhetApplication = require( 'edu.colorado.phet.common.piccolophet.PiccoloPhetApplication' );
  var MacroModule = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/MacroModule' );
  var MicroModule = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/MicroModule' );
  var WaterModule = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/WaterModule' );
  var SIZE_SCALE = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/MicroModule/SIZE_SCALE' );//static
  var SINGLE_MICRO_KIT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/wetlab/SugarAndSaltSolutionsMicroApplication/SINGLE_MICRO_KIT' );//static

//Global property for setting the size for atoms and molecules, since they are supposed to look and act smaller in the Micro tab than in real life
//This was designed as a global property since propagating the scale through the object graphs on initialization was much more complex and confusing
  var sizeScale = new Property( 1.0 );

  function SugarAndSaltSolutionsApplication( config ) {
    PiccoloPhetApplication.call( this, config );
    //Create a shared configuration for changing colors or state in all tabs
    var globalState = new GlobalState( new SugarAndSaltSolutionsColorScheme(), config, getPhetFrame(), Arrays.asList( config.getCommandLineArgs() ).contains( SINGLE_MICRO_KIT ) );
    //Create the modules
    addModule( new MacroModule( globalState ) );
    //Which all have to use the same sizeScale argument.  Instead, we are using this more "global" approach, and relying on module switching and these setters to make sure the scale is correct
    sizeScale.set( SIZE_SCALE );
    addModule( new MicroModule( globalState ) );
    //Restore the size scale to be 1.0 for the water module since no custom override is done there.
    sizeScale.set( 1.0 );
    addModule( new WaterModule( globalState ) );
    //Add developer menus for changing the color of background and salt
    getPhetFrame().getDeveloperMenu().add( new ColorDialogMenuItem( S3SimSharing.Components.backgroundColorMenuItem, getPhetFrame(), "Background Color...", globalState.colorScheme.backgroundColorSet.selectedColor ) );
    getPhetFrame().getDeveloperMenu().add( new ColorDialogMenuItem( S3SimSharing.Components.saltColorMenuItem, getPhetFrame(), "Salt Color...", globalState.colorScheme.saltColor.selectedColor ) );
    //Add a Teacher menu with an item to change the background to white for use on projectors in bright classrooms
    getPhetFrame().addMenu( new TeacherMenu().withAnonymousClassBody( {
      initializer: function() {
        addWhiteBackgroundMenuItem( globalState.colorScheme.whiteBackground );
      }
    } ) );
  }

  return inherit( PiccoloPhetApplication, SugarAndSaltSolutionsApplication, {
      main: function( args ) {
        new PhetApplicationLauncher().launchSim( args, SugarAndSaltSolutionsResources.PROJECT_NAME, SugarAndSaltSolutionsApplication.class );
      }
    },
//statics
    {
      sizeScale: sizeScale
    } );
} );

