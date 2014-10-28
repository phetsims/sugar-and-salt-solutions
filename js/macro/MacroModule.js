// Copyright 2002-2011, University of Colorado
/**
 * Introductory (macro) module for sugar and salt solutions
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GlobalState = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/GlobalState' );
  var SugarAndSaltSolutionsResources = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources' );
  var SugarAndSaltSolutionsModule = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/SugarAndSaltSolutionsModule' );
  var MacroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroModel' );
  var MacroCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/view/MacroCanvas' );

  function MacroModule( globalState ) {
    this( new MacroModel(), globalState );
  }

  //private
  function MacroModule( model, globalState ) {
    SugarAndSaltSolutionsModule.call( this, SugarAndSaltSolutionsResources.Strings.MACRO, model.clock, model.moduleActive, 1 );
    setSimulationPanel( new MacroCanvas( model, globalState ) );
    //When the module becomes activated/deactivated, update the flag in the model for purposes of starting and stopping the clock
    listenForModuleActivated( model.moduleActive );
  }

  return inherit( SugarAndSaltSolutionsModule, MacroModule, {
  } );
} );

