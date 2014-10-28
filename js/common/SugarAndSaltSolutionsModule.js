// Copyright 2002-2011, University of Colorado
/**
 * Base class for sugar and salt solutions modules.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Module = require( 'edu.colorado.phet.common.phetcommon.application.Module' );
  var Clock = require( 'edu.colorado.phet.common.phetcommon.model.clock.Clock' );
  var Property = require( 'AXON/Property' );
  var SugarAndSaltSolutionsApplication = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsApplication' );

  function SugarAndSaltSolutionsModule( name, clock, moduleActive, sizeScale ) {
    //Use the right size scale for creating particles, see docs in SugarAndSaltSolutionsApplication

    //private
    this.sizeScale;
    Module.call( this, name, clock );
    SugarAndSaltSolutionsApplication.sizeScale.set( sizeScale );
    this.sizeScale = sizeScale;
    //Clock control panel will be shown floating in the simulation panel, so don't show the top level swing component for the clock control panel
    setClockControlPanel( null );
    //Don't show the logo panel--since the sim is multi-tab, the logo should be shown in the tab tray at the far right
    setLogoPanel( null );
    //When the module becomes activated/deactivated, update the flag in the model for purposes of starting and stopping the clock
    listenForModuleActivated( moduleActive );
  }

  return inherit( Module, SugarAndSaltSolutionsModule, {
    listenForModuleActivated: function( moduleActive ) {
      //Keep a boolean flag for whether this module is active so subclasses can pause their clocks when not enabled (for performance reasons and so it is in the same place you left it)
      addListener( new Listener().withAnonymousClassBody( {
        activated: function() {
          moduleActive.set( true );
          //Use the right size scale for creating particles, see docs in SugarAndSaltSolutionsApplication
          SugarAndSaltSolutionsApplication.sizeScale.set( sizeScale );
        },
        deactivated: function() {
          moduleActive.set( false );
        }
      } ) );
    }
  } );
} );

