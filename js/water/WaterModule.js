// Copyright 2002-2011, University of Colorado
/**
 * Module for "water" tab of sugar and salt solutions module
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
  var WaterModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterModel' );
  var WaterCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/view/WaterCanvas' );

  function WaterModule( state ) {
    this( new WaterModel(), state );
  }

  function WaterModule( model, state ) {
    SugarAndSaltSolutionsModule.call( this, SugarAndSaltSolutionsResources.Strings.WATER, model.clock, model.moduleActive, 1 );
    setSimulationPanel( new WaterCanvas( model, state ).withAnonymousClassBody( {
      initializer: function() {
        //Listen for when the user changes tabs so the JMolDialog can be hidden when switching away and shown when switching to this tab (if it was already shown)
        addListener( new Listener().withAnonymousClassBody( {
          activated: function() {
            moduleActivated();
          },
          deactivated: function() {
            moduleDeactivated();
          }
        } ) );
      }
    } ) );
  }

  return inherit( SugarAndSaltSolutionsModule, WaterModule, {
  } );
} );

