//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var SugarAndSaltSolutionsModel = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/model/MacroModel' );
  var SugarAndSaltSolutionsScreenView = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/view/MacroScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var sugarAndSaltSolutionsSimString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions.name' );

  /**
   * @constructor
   */
  function SugarAndSaltSolutionsScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, sugarAndSaltSolutionsSimString, icon,
      function() { return new SugarAndSaltSolutionsModel(); },
      function( model ) { return new SugarAndSaltSolutionsScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, SugarAndSaltSolutionsScreen );
} );