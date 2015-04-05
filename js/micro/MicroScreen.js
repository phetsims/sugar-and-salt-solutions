//  Copyright 2002-2014, University of Colorado Boulder

//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Micro tab that shows the NaCl ions and Sucrose molecules.
 * In order to efficiently re-use pre existing code from the Soluble Salts (AKA Salts and Solubility) project, we make the
 * following inaccurate encodings:
 * 1. Sugar is a subclass of Salt
 * 2. Sugar has two constituents, a "positive" sugar molecule and a "negative" sugar molecule
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/MicroModel' );
  var MicroScreenView = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/MicroScreenView' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SugarAndSaltSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSharedProperties' );

  // strings
  var microScreenTitle = require( 'string!SUGAR_AND_SALT_SOLUTIONS/micro' );

  /**
   * Creates the icon for this screen.
   * @returns {Node}
   */
  var createScreenIcon = function() {

    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;

    //TODO Micro Icon
    var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );
    return new Node( { children: [ background] } );

  };

  /**
   * @constructor
   */
  function MicroScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.

    var backgroundColor = new Color( 0, 51, 153 );
    var layoutBounds = SugarAndSaltConstants.LAYOUT_BOUNDS;
    var aspectRatio = layoutBounds.width / layoutBounds.height;
    SugarAndSaltSharedProperties.sizeScale.set( 0.35 );
    Screen.call( this, microScreenTitle, createScreenIcon(),
      function() { return new MicroModel( aspectRatio ); },
      function( model ) { return new MicroScreenView( model ); },
      { backgroundColor: backgroundColor }
    );
  }

  return inherit( Screen, MicroScreen );
} );