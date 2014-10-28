// Copyright 2002-2011, University of Colorado
/**
 * This sim was written to accommodate a chemistry wet lab in Fall 2011, this sim just shows the macro tab.
 * Can probably be deleted after usage.  No need to internationalize this version--it is just used for one experiment.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetApplicationConfig = require( 'edu.colorado.phet.common.phetcommon.application.PhetApplicationConfig' );
  var PhetApplicationLauncher = require( 'edu.colorado.phet.common.phetcommon.application.PhetApplicationLauncher' );
  var TeacherMenu = require( 'edu.colorado.phet.common.phetcommon.view.menu.TeacherMenu' );
  var PiccoloPhetApplication = require( 'edu.colorado.phet.common.piccolophet.PiccoloPhetApplication' );
  var GlobalState = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/GlobalState' );
  var SugarAndSaltSolutionsColorScheme = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsColorScheme' );
  var SugarAndSaltSolutionsResources = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources' );
  var MacroModule = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/MacroModule' );


  //private
  var NAME = "sugar-and-salt-solutions-macro";

  function SugarAndSaltSolutionsMacroApplication( config ) {
    PiccoloPhetApplication.call( this, config );
    //Create the modules
    var globalState = new GlobalState( new SugarAndSaltSolutionsColorScheme(), config, getPhetFrame(), true );
    addModule( new MacroModule( globalState ) );
    //Add an options menu with the option to change the background to white for use on projectors in bright classrooms
    getPhetFrame().addMenu( new TeacherMenu().withAnonymousClassBody( {
      initializer: function() {
        addWhiteBackgroundMenuItem( globalState.colorScheme.whiteBackground );
      }
    } ) );
  }

  return inherit( PiccoloPhetApplication, SugarAndSaltSolutionsMacroApplication, {
    main: function( args ) {
      new PhetApplicationLauncher().launchSim( args, SugarAndSaltSolutionsResources.PROJECT_NAME, NAME, SugarAndSaltSolutionsMacroApplication.class );
    }
  } );
} );

