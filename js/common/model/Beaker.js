//  Copyright 2002-2014, University of Colorado Boulder
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
  var Shape = require( 'KITE/Shape' );
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

    //Left side of the inner part of the beaker
    this.x = x;

    //the y-location of the inner part of the base of the beaker, +y is up in the model (down in the graphics)
    this.y = y;

    //Dimensions of the inner part of the beaker
    this.width = width;
    this.height = height;

    // dimension of the beaker in the z-direction (into the screen), direction irrelevant
    // since it is only used for computing the volume within the beaker
    this.depth = depth;

    //Width of the beaker
    this.wallThickness = wallThickness;
    this.topDelta = wallThickness * 1.2;

    // Since we decided not to have solutes take up volume, we have no extension.  If dissolved
    // solutes take up nonzero volume in the future, this could be increased to something like 0.003
    this.topExtension = 0.0;

  }

  return inherit( Object, Beaker, {

    //Gets the y-location of the base of the beaker
    getY: function() {
      return this.y;
    },

//    //Determines the model shape of the walls of the beaker that can be used to render it in the view
//    public Shape getWallShape() {
//        //Stroke (in model coordinates) that will be used to create the walls
//        var wallStroke =  wallThickness;
//
//        //Create a Shape representing the walls as a U-shape, starting from the top left
//        Shape wallShape = wallStroke.createStrokedShape( getWallPath( topDelta ).getGeneralPath() );
//
//        //Since the stroke goes on both sides of the line, subtract out the main area so that the water won't overlap with the edges
//        return new Area( wallShape ) {{
//            subtract( new Area( getWallPath( topDelta * 2 ).getGeneralPath() ) );
//        }};
//    },

    /**
     * Gets the path that represents the walls of the beaker, with the delta indicating the x and y dimensions of the
     * beaker opening at the top.It is a parameter since we need to extend it for subtracting out the middle in getWallShape,
     * so the water doesn't overlap the edges.Without this, the top part of the beaker (its opening)
     * would be twice as thick as the walls of the rectangular part of the beaker
     * @param {number} delta
     * @return {Shape}
     */

    getWallPath: function( delta ) {
      return new Shape().moveTo( this.x - delta, this.y + this.height + this.topExtension + delta )
        .lineTo( this.x, this.y + this.height + this.topExtension )
        .lineTo( this.x, this.y )
        .lineTo( this.x + this.width, this.y )
        .lineTo( this.x + this.width, this.y + this.height + this.topExtension )
        .lineTo( this.x + this.width + delta, this.y + this.height + this.topExtension + delta );
    },


    /**
     * Returns a rectangle of the bounds of the beaker
     * @return Shape
     */
    toRectangle: function() {
      return Shape.rectangle( this.x, this.y, this.width, this.height + this.topExtension );
    },

    /**
     * Rearrange the equation "Volume = width * height * depth"  To solve for
     * height, assumes a square tank like a fish tank
     * @param {number} volume
     * @return {number}
     */

    getHeightForVolume: function( volume ) {
      return volume / this.width / this.depth;
    },
    /**
     * Gets the bottom right corner for attaching the output faucet
     * @return {Vector2}
     */
    getOutputFaucetAttachmentPoint: function() {
      return new Vector2( this.x + this.width, this.y );
    },
    /**
     * Determine how much water could this beaker hold in meters cubed
     * @return {number}
     */
    getMaxFluidVolume: function() {
      //Rectangular like a fish tank
      return this.width * this.height * this.depth;
    },

    /**
     * Get the center of the empty beaker
     * @return {number}
     */
    getCenterX: function() {
      return this.toRectangle().bounds.getCenterX();
    },

    /**
     * Get the top of the empty beaker
     * @return {number}
     */
    getTopY: function() {
      return this.y + this.height;
    },
    /**
     * Get the height of the empty beaker
     * @return {number}
     */
    getHeight: function() {
      return this.height;
    },
    /**
     * Gets the leftmost x component of the water-containing part of the beaker
     * @return {number}
     */
    getX: function() {
      return this.x;
    },

    /**
     * Gets the width of the walls (edges) of the container
     * @return {number}
     */
    getWallThickness: function() {
      return this.wallThickness;
    },
    getMaxX: function() {
      return this.x + this.width;
    },
    getLeftWall: function() {
      return Shape.lineSegment( this.x, this.y, this.x, this.y + this.height );
    },
    getRightWall: function() {
      return Shape.lineSegment( this.getMaxX(), this.y, this.getMaxX(), this.y + this.height );
    },

    getWidth: function() {
      return this.width;
    },

    getFloor: function() {
      return Shape.lineSegment( this.x, this.y, this.x + this.width, this.y );
    },

    /**
     * @param {number} y
     * @param {number} volume
     * @return {Shape<rect>}
     */
    //Get the rectangular shape water would occupy given the y-value (in case there are solutes below it) and volume
    getWaterShape: function( y, volume ) {
      return Shape.rectangle( this.getX(), this.getY() + y, this.getWidth(), this.getHeightForVolume( volume ) );
    }

  } );

} );//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.awt.BasicStroke;
//import java.awt.Shape;
//import java.awt.geom.Area;
//import java.awt.geom.Line2D;
//import java.awt.geom.Line2D.Double;
//import java.awt.geom.Point2D;
//import java.awt.geom.Rectangle2D;
//
//import edu.colorado.phet.common.phetcommon.view.util.DoubleGeneralPath;
//
///**
// * Physical model for the beaker
// *
// * @author Sam Reid
// */
//public class Beaker {
//


//}
