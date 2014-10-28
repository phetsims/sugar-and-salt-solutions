// Copyright 2002-2011, University of Colorado
/**
 * This sim was written to accommodate a chemistry wet lab in Fall 2011, this sim has only one kit in the Macro tab.
 * Can probably be deleted after usage.  No need to internationalize this version--it is just used for one experiment.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Arrays = require( 'java.util.Arrays' );
  var PhetApplicationConfig = require( 'edu.colorado.phet.common.phetcommon.application.PhetApplicationConfig' );
  var PhetApplicationLauncher = require( 'edu.colorado.phet.common.phetcommon.application.PhetApplicationLauncher' );
  var SugarAndSaltSolutionsApplication = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsApplication' );
  var SugarAndSaltSolutionsResources = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources' );


  //private
  var NAME = "sugar-and-salt-solutions-micro";
//String key used to indicate that this is the customized wet lab version for fall 2011
  var SINGLE_MICRO_KIT = "-singleMicroKit";

  return inherit( Object, SugarAndSaltSolutionsMicroApplication, {
      main: function( args ) {
        new PhetApplicationLauncher().launchSim( new PhetApplicationConfig( append( args, SINGLE_MICRO_KIT ), SugarAndSaltSolutionsResources.PROJECT_NAME, SugarAndSaltSolutionsMicroApplication.NAME ), SugarAndSaltSolutionsApplication.class );
      },

      //private
      append: function( args, s ) {
        return new ArrayList( Arrays.asList( args ) ).withAnonymousClassBody( {
          initializer: function() {
            add( s );
          }
        } ).toArray( new String[args.length + 1] );
      }
    },
//statics
    {
      SINGLE_MICRO_KIT: SINGLE_MICRO_KIT
    } );
} );

