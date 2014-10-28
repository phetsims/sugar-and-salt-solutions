// Copyright 2002-2011, University of Colorado
/**
 * Physical model for the beaker
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Shape = require( 'java.awt.Shape' );
  var Area = require( 'java.awt.geom.Area' );
  var Line2D = require( 'java.awt.geom.Line2D' );
  var Number = require( 'java.awt.geom.Line2D.Number' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var Rectangle = require( 'KITE/Rectangle' );
  var DoubleGeneralPath = require( 'edu.colorado.phet.common.phetcommon.view.util.DoubleGeneralPath' );

  function Beaker( x, y, width, height, depth, wallThickness ) {
    //Left side of the inner part of the beaker

    //private
    this.x;
    //the y-location of the inner part of the base of the beaker, +y is up in the model (down in the graphics)

    //private
    this.y;
    //Dimensions of the inner part of the beaker

    //private
    this.width;

    //private
    this.height;
    //dimension of the beaker in the z-direction (into the screen), direction irrelevant since it is only used for computing the volume within the beaker

    //private
    this.depth;
    //Width of the beaker
    this.wallThickness;
    //Since we decided not to have solutes take up volume, we have no extension.  If dissolved solutes take up nonzero volume in the future, this could be increased to something like 0.003

    //private
    this.topExtension = 0.0;

    //private
    this.topDelta;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.wallThickness = wallThickness;
    this.topDelta = wallThickness * 1.2;
  }

  return inherit( Object, Beaker, {
//Gets the y-location of the base of the beaker
    getY: function() {
      return y;
    },
//Determines the model shape of the walls of the beaker that can be used to render it in the view
    getWallShape: function() {
      //Stroke (in model coordinates) that will be used to create the walls
      var wallStroke = new BasicStroke( wallThickness );
      //Create a Shape representing the walls as a U-shape, starting from the top left
      var wallShape = wallStroke.createStrokedShape( getWallPath( topDelta ).getGeneralPath() );
      //Since the stroke goes on both sides of the line, subtract out the main area so that the water won't overlap with the edges
      return new Area( wallShape ).withAnonymousClassBody( {
        initializer: function() {
          subtract( new Area( getWallPath( topDelta * 2 ).getGeneralPath() ) );
        }
      } );
    },
//Gets the path that represents the walls of the beaker, with the delta indicating the x and y dimensions of the beaker opening at the top.
//It is a parameter since we need to extend it for subtracting out the middle in getWallShape, so the water doesn't overlap the edges.
//Without this, the top part of the beaker (its opening) would be twice as thick as the walls of the rectangular part of the beaker

    //private
    getWallPath: function( delta ) {
      return new DoubleGeneralPath( x - delta, y + height + topExtension + delta ).withAnonymousClassBody( {
        initializer: function() {
          lineTo( x, y + height + topExtension );
          lineTo( x, y );
          lineTo( x + width, y );
          lineTo( x + width, y + height + topExtension );
          lineTo( x + width + delta, y + height + topExtension + delta );
        }
      } );
    },
//Returns a rectangle of the bounds of the beaker

    //private
    toRectangle: function() {
      return new Rectangle.Number( x, y, width, height + topExtension );
    },
// Rearrange the equation "Volume = width * height * depth"  To solve for height, assumes a square tank like a fish tank
    getHeightForVolume: function( volume ) {
      return volume / width / depth;
    },
//Gets the bottom right corner for attaching the output faucet
    getOutputFaucetAttachmentPoint: function() {
      return new Vector2( x + width, y );
    },
//Determine how much water could this beaker hold in meters cubed
    getMaxFluidVolume: function() {
      //Rectangular like a fish tank
      return width * height * depth;
    },
//Get the center of the empty beaker
    getCenterX: function() {
      return toRectangle().getCenterX();
    },
//Get the top of the empty beaker
    getTopY: function() {
      return y + height;
    },
//Get the height of the empty beaker
    getHeight: function() {
      return height;
    },
//Gets the leftmost x component of the water-containing part of the beaker
    getX: function() {
      return x;
    },
//Gets the width of the walls (edges) of the container
    getWallThickness: function() {
      return wallThickness;
    },
    getMaxX: function() {
      return x + width;
    },
    getLeftWall: function() {
      return new Line2D.Number( x, y, x, y + height );
    },
    getRightWall: function() {
      return new Line2D.Number( getMaxX(), y, getMaxX(), y + height );
    },
    getWidth: function() {
      return width;
    },
    getFloor: function() {
      return new Number( x, y, x + width, y );
    },
//Get the rectangular shape water would occupy given the y-value (in case there are solutes below it) and volume
    getWaterShape: function( y, volume ) {
      return new Rectangle.Number( getX(), getY() + y, getWidth(), getHeightForVolume( volume ) );
    }
  } );
} );

