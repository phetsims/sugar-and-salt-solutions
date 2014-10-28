// Copyright 2002-2011, University of Colorado
/**
 * Micro tab that shows the NaCl ions and Sucrose molecules.
 * <p/>
 * In order to efficiently re-use pre existing code from the Soluble Salts (AKA Salts and Solubility) project, we make the following inaccurate encodings:
 * 1. Sugar is a subclass of Salt
 * 2. Sugar has two constituents, a "positive" sugar molecule and a "negative" sugar molecule
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
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var MicroCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/view/MicroCanvas' );

  var SIZE_SCALE = 0.35;

  function MicroModule( globalState ) {

    //private
    this.model;
    this( globalState, new MicroModel() );
  }

  function MicroModule( globalState, model ) {

    //private
    this.model;
    SugarAndSaltSolutionsModule.call( this, SugarAndSaltSolutionsResources.Strings.MICRO, model.clock, model.moduleActive, //The factor by which to scale particle sizes, so they look a bit smaller in the graphics
      SIZE_SCALE );
    this.model = model;
    setSimulationPanel( new MicroCanvas( model, globalState ).withAnonymousClassBody( {
      initializer: function() {
        addListener( this );
      }
    } ) );
  }

  return inherit( SugarAndSaltSolutionsModule, MicroModule, {
      reset: function() {
        super.reset();
        model.reset();
      }
    },
//statics
    {
      SIZE_SCALE: SIZE_SCALE
    } );
} );

