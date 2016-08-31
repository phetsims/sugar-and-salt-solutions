// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MacroScreen = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/MacroScreen' );
  var MicroScreen = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/MicroScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var sugarAndSaltSolutionsTitleString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( sugarAndSaltSolutionsTitleString, [ new MacroScreen(), new MicroScreen() ], simOptions );
    sim.start();
  } );
} );