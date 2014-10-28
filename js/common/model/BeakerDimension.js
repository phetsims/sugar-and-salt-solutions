/**
 * Beaker dimensions and location in meters, public so other classes can use them for layout.
 * This class exists so the dimensions can be passed together as a parameter when constructing model instances, and so it can encode default assumptions
 * like the beaker is centered around x=0 and has a certain aspect ratio.
 * <p/>
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

//This constructor is here because Micro and Macro tabs use the same aspect ratio of beaker dimensions
  function BeakerDimension( width ) {
    //Width of the beaker (x-direction) in meters
    this.width;
    //Height (tallness) of the beaker (y-direction) in meters
    this.height;
    //Location of the left side of the beaker in meters
    this.x;
    //Depth is z-direction z-depth (into the screen) in meters
    this.depth;
    //Width of the wall in meters
    this.wallThickness;
    this( width, width / 2, width / 2 );
  }

//Create a beaker dimension with the specified values, y is assumed to be zero, so is not provided.  The beaker is centered around x=0

  //private
  function BeakerDimension( width, height, depth ) {
    //Width of the beaker (x-direction) in meters
    this.width;
    //Height (tallness) of the beaker (y-direction) in meters
    this.height;
    //Location of the left side of the beaker in meters
    this.x;
    //Depth is z-direction z-depth (into the screen) in meters
    this.depth;
    //Width of the wall in meters
    this.wallThickness;
    this.width = width;
    this.height = height;
    this.depth = depth;
    //Set the x-position so the middle of the beaker will be centered at x=0
    this.x = -width / 2;
    //Thickness of the walls
    this.wallThickness = width / 40.0;
  }

  return inherit( Object, BeakerDimension, {
//Get the volume of the beaker, the maximum amount of solution it can hold
    getVolume: function() {
      return width * height * depth;
    }
  } );
} );

