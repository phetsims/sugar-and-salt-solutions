// Copyright 2014-2017, University of Colorado Boulder

/**
 * NeuronConstants is a collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  var SugarAndSaltSolutionsConstants = Object.freeze( {
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),
    VOLUME_PER_SOLID_MOLE_SALT: 0.02699 / 1000.0,
    TITLE_FONT: new PhetFont( { weight: 'bold', size: 18 } ),
    CONTROL_FONT: new PhetFont( { weight: 'bold', size: 16 } ),
    WATER_COLOR: new Color( 179, 239, 243 ),
    BAR_WIDTH: 40,
    //Color for reset and remove buttons
    BUTTON_COLOR: new Color( 255, 153, 0 ),
    DEBUG: true, // use  true to  enable  model classes to print statements to console
    OXYGEN_RADIUS: 1E-10,
    SUCROSE_SCALE: 1E-10 * 10 / 800 * 0.7 // 1E-10 refers to OXYGEN_RADIUS
  } );
  sugarAndSaltSolutions.register( 'SugarAndSaltSolutionsConstants', SugarAndSaltSolutionsConstants );

  return SugarAndSaltSolutionsConstants;
} );