// Copyright 2014-2017, University of Colorado Boulder
/**
 * Physical model for the beaker
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'KITE/segments/Line' );
  var Shape = require( 'KITE/Shape' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var Vector2 = require( 'DOT/Vector2' );


  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} depth
   * @param {number} wallThickness
   * @constructor
   */
  function Beaker( x, y, width, height, depth, wallThickness ) {

    //@private Left side of the inner part of the beaker
    this.x = x;

    //@private the y-location of the inner part of the base of the beaker, +y is up in the model (down in the graphics)
    this.y = y;

    //@private Dimensions of the inner part of the beaker
    this.width = width;
    this.height = height;

    //@private dimension of the beaker in the z-direction (into the screen), direction irrelevant
    // since it is only used for computing the volume within the beaker
    this.depth = depth;

    //Width of the beaker
    this.wallThickness = wallThickness;
    //@private
    this.topDelta = wallThickness * 1.2;

    //@private Since we decided not to have solutes take up volume, we have no extension.  If dissolved
    // solutes take up nonzero volume in the future, this could be increased to something like 0.003
    this.topExtension = 0.0;

    this.leftWall = new Line( new Vector2( this.x, this.y ), new Vector2( this.x, this.y + this.height ) );
    this.rightWall = new Line( new Vector2( this.getMaxX(), this.y ), new Vector2( this.getMaxX(), this.y + this.height ) );
    this.floor = new Line( new Vector2( this.x, this.y ), new Vector2( this.x + this.width, this.y ) );
    this.topOfSolid = new Line( new Vector2( this.getFloor().start.x, 0 ), new Vector2( this.getFloor().end.x, 0 ) );
    this.beakerRect = Shape.rectangle( this.x, this.y, this.width, this.height + this.topExtension );

  }

  sugarAndSaltSolutions.register( 'Beaker', Beaker );

  return inherit( Object, Beaker, {

    //Gets the y-location of the base of the beaker
    getY: function() {
      return this.y;
    },

    /**
     * Determines the model shape of the walls of the beaker that can be used to render it in the view
     * Gets the path that represents the walls of the beaker, with the delta indicating the x and y dimensions of the
     * beaker opening at the top.It is a parameter since we need to extend it for subtracting out the middle in getWallShape,
     * so the water doesn't overlap the edges.Without this, the top part of the beaker (its opening)
     * would be twice as thick as the walls of the rectangular part of the beaker
     * @param {number} delta
     * @returns {Shape}
     *
     * // TODO comments needs to be in synch with the JavaScript implementation which doesnt use Area operations
     * // like Add,Subtract etc (constructive plane geometry)
     */
    getWallPath: function( delta ) {

      // This shape drawing is different from its Java implementation.
      // wallThicknessFactor is derived from delta which indicates  the x and y dimensions of the beaker opening at the top
      var wallThicknessFactor = 0.3333;
      var wallOffSetThickness = delta * wallThicknessFactor; //  0.002;
      var openingOffsetX = wallOffSetThickness * 0.55;
      var openingOffsetY = wallOffSetThickness * 0.45;

      var wallPath = new Shape().moveTo( this.x - delta, this.y + this.height + this.topExtension + delta )
        .lineTo( this.x, this.y + this.height + this.topExtension )
        .lineTo( this.x, this.y )
        .lineTo( this.x + this.width, this.y )
        .lineTo( this.x + this.width, this.y + this.height + this.topExtension )
        .lineTo( this.x + this.width + delta, this.y + this.height + this.topExtension + delta )
        //outer path
        .lineTo( this.x + this.width + delta + openingOffsetX, this.y + this.height + this.topExtension + delta - openingOffsetY )
        .lineTo( this.x + this.width + wallOffSetThickness, this.y + this.height + this.topExtension )
        .lineTo( this.x + this.width + wallOffSetThickness, this.y - wallOffSetThickness )
        .lineTo( this.x - wallOffSetThickness, this.y - wallOffSetThickness )
        .lineTo( this.x - wallOffSetThickness, this.y + this.height + this.topExtension )
        .lineTo( this.x - delta - openingOffsetX, this.y + this.height + this.topExtension + delta - openingOffsetY )
        .lineTo( this.x - delta, this.y + this.height + this.topExtension + delta );

      return wallPath;
    },

    /**
     * Returns a rectangle of the bounds of the beaker
     * @return Shape
     */
    toRectangle: function() {
      return this.beakerRect;
    },

    /**
     * Rearrange the equation "Volume = width * height * depth"  To solve for
     * height, assumes a square tank like a fish tank
     * @param {number} volume
     * @returns {number}
     */
    getHeightForVolume: function( volume ) {
      return volume / this.width / this.depth;
    },

    /**
     * Gets the bottom right corner for attaching the output faucet
     * @returns {Vector2}
     */
    getOutputFaucetAttachmentPoint: function() {
      return new Vector2( this.x + this.width, this.y );
    },

    /**
     * Determine how much water could this beaker hold in meters cubed
     * @returns {number}
     */
    getMaxFluidVolume: function() {
      //Rectangular like a fish tank
      return this.width * this.height * this.depth;
    },

    /**
     * Get the center of the empty beaker
     * @returns {number}
     */
    getCenterX: function() {
      return this.toRectangle().bounds.getCenterX();
    },

    /**
     * Get the top of the empty beaker
     * @returns {number}
     */
    getTopY: function() {
      return this.y + this.height;
    },

    /**
     * Get the height of the empty beaker
     * @returns {number}
     */
    getHeight: function() {
      return this.height;
    },

    /**
     * Gets the leftmost x component of the water-containing part of the beaker
     * @returns {number}
     */
    getX: function() {
      return this.x;
    },

    /**
     * Gets the width of the walls (edges) of the container
     * @returns {number}
     */
    getWallThickness: function() {
      return this.wallThickness;
    },

    getMaxX: function() {
      return this.x + this.width;
    },

    getLeftWall: function() {
      return this.leftWall;
    },
    getRightWall: function() {
      return this.rightWall;
    },

    getTopOfSolid: function() {
      return this.topOfSolid;
    },

    getWidth: function() {
      return this.width;
    },

    getFloor: function() {
      return this.floor;
    },

    /**
     * @param {number} y
     * @param {number} volume
     * @returns {Shape<rect>}
     */
    //Get the rectangular shape water would occupy given the y-value (in case there are solutes below it) and volume
    getWaterShape: function( y, volume ) {
      return Shape.rectangle( this.getX(), this.getY() + y, this.getWidth(), this.getHeightForVolume( volume ) );
    }

  } );

} );