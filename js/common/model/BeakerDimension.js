// Copyright 2014-2015, University of Colorado Boulder
/**
 * Beaker dimensions and location in meters, public so other classes can use them for layout.
 * This class exists so the dimensions can be passed together as a parameter when constructing model instances,
 * and so it can encode default assumptions like the beaker
 * is centered around x=0 and has a certain aspect ratio.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * Create a beaker dimension with the specified values, y is assumed to be zero,
   * so is not provided.  The beaker is centered around x=0
   * @param {number} width
   * @param {number} height
   * @param {number} depth
   *
   * @constructor
   */
  function BeakerDimension( width, height, depth ) {

    //Width of the beaker (x-direction) in meters
    this.width = width;

    //if width alone is given create a beaker dimension with a standardized aspect ratio, where the height
    //and depth are half the width, and centered around x=0. This cosntructor option is here because Micro and Macro tabs use the same aspect ratio of beaker dimensions

    this.height = height || width / 2; //Height (tallness) of the beaker (y-direction) in meters
    this.depth = depth || width / 2;  //Depth is z-direction z-depth (into the screen) in meters

    //Location of the left side of the beaker in meters
    this.x = -width / 2;//Set the x-position so the middle of the beaker will be centered at x=0

    //Width of the wall in meters
    this.wallThickness = width / 40.0;//Thickness of the walls
  }

  return inherit( Object, BeakerDimension, {
    //Get the volume of the beaker, the maximum amount of solution it can hold
    getVolume: function() {
      return this.width * this.height * this.depth;
    }
  } );
} );

