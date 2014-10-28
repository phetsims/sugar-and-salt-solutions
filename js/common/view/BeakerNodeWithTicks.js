// Copyright 2002-2011, University of Colorado
/**
 * Graphical display of the beaker, including tick marks and labels along the side
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Color = require( 'SCENERY/util/Color' );
  var Line2D = require( 'java.awt.geom.Line2D' );
  var DecimalFormat = require( 'java.text.DecimalFormat' );
  var MessageFormat = require( 'java.text.MessageFormat' );
  var LinearFunction = require( 'edu.colorado.phet.common.phetcommon.math.Function.LinearFunction' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetFont = require( 'edu.colorado.phet.common.phetcommon.view.util.PhetFont' );
  var HTMLNode = require( 'edu.colorado.phet.common.piccolophet.nodes.HTMLNode' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var Beaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Beaker' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PText = require( 'edu.umd.cs.piccolo.nodes.PText' );
  var PATTERN__BEAKER_TICK_LABEL = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/PATTERN__BEAKER_TICK_LABEL' );//static
  var metersCubedToLiters = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Units/metersCubedToLiters' );//static
  var black = require( 'java.awt.Color.black' );//static
  var white = require( 'java.awt.Color.white' );//static

  function BeakerNodeWithTicks( transform, beaker, showTickLabels, whiteBackground ) {
    BeakerNode.call( this, transform, beaker );
    //Add Tick marks and labels
    var viewX = transform.modelToViewX( beaker.getX() - beaker.getWallThickness() / 2 );
    //Scale should be 1 if beaker can hold 2L
    var scale = new LinearFunction( 0, 0.002, 0, 1 ).evaluate( beaker.getMaxFluidVolume() );
    //meters cubed
    var dMinorTick = 0.0005 * scale;
    for ( var minorTick = 0; //Go up to the max fluid volume of 2L
          minorTick <= 0.002 * scale; minorTick += dMinorTick ) {
      //Width of the tick line in stage coordinates
      var lineWidth = 5.0;
      //Find where the tick mark should be in the vertical direction
      var viewY = transform.modelToViewY( beaker.getHeightForVolume( minorTick ) + beaker.getY() );
      //Add the tick mark
      var line = new Line2D.Number( viewX - lineWidth, viewY, viewX, viewY );
      addChild( new PhetPPath( line, new BasicStroke( 2 ), Color.white ).withAnonymousClassBody( {
        initializer: function() {
          //Show it in black against white background and white against blue background
          whiteBackground.addObserver( new VoidFunction1().withAnonymousClassBody( {
            apply: function( whiteBackground ) {
              setStrokePaint( whiteBackground ? black : white );
            }
          } ) );
        }
      } ) );
    }
    //Units are in SI here
    for ( var tick in new double[] { 0, 0.001 * scale, 0.002 * scale }
  )
    {
      //Width of the tick mark line in stage coordinates
      var lineWidth = 10.0;
      //Location of the tick mark in the vertical direction
      var viewY = transform.modelToViewY( beaker.getHeightForVolume( tick ) + beaker.getY() );
      //Create and add the tick mark
      var tickMark = new PhetPPath( new Line2D.Number( viewX - lineWidth, viewY, viewX, viewY ), new BasicStroke( 4 ), white ).withAnonymousClassBody( {
        initializer: function() {
          //Show it in black against white background and white against blue background
          whiteBackground.addObserver( new VoidFunction1().withAnonymousClassBody( {
            apply: function( whiteBackground ) {
              setStrokePaint( whiteBackground ? black : white );
            }
          } ) );
        }
      } );
      addChild( tickMark );
      if ( showTickLabels ) {
        //Create and add a tick mark label to the left of the tick mark, like "0.5L"
        var labelNode = createLabelNode( tick, whiteBackground );
        labelNode.setOffset( tickMark.getFullBounds().getX() - labelNode.getFullBounds().getWidth(), tickMark.getFullBounds().getCenterY() - labelNode.getFullBounds().getHeight() / 2 );
        addChild( labelNode );
      }
    }
  }

  return inherit( BeakerNode, BeakerNodeWithTicks, {
//Create a text (PText or HTMLNode) node to show the value.  HTML is used for formatting exponentials

    //private
    createLabelNode: function( volume, whiteBackground ) {
      var font = new PhetFont( 20 );
      if ( volume == 0 || volume > 1E-20 ) {
        var liters = metersCubedToLiters( volume );
        //Converts the SI unit to liters and formats it according to the specified format (such as 0.5L, 1L,...)
        var formatLiters = liters < 1E-6 && liters > 0 ? "" : new DecimalFormat( "0" ).format( liters );
        return new PText( MessageFormat.format( PATTERN__BEAKER_TICK_LABEL, formatLiters ) ).withAnonymousClassBody( {
          initializer: function() {
            //Show it in black against white background and white against blue background
            whiteBackground.addObserver( new VoidFunction1().withAnonymousClassBody( {
              apply: function( whiteBackground ) {
                setTextPaint( whiteBackground ? black : white );
              }
            } ) );
            setFont( font );
          }
        } );
      }
      else {
        var value = volumeToHTMLString( volume, "0" );
        return new HTMLNode( MessageFormat.format( PATTERN__BEAKER_TICK_LABEL, value ) ).withAnonymousClassBody( {
          initializer: function() {
            //Show it in black against white background and white against blue background
            whiteBackground.addObserver( new VoidFunction1().withAnonymousClassBody( {
              apply: function( whiteBackground ) {
                setHTMLColor( whiteBackground ? black : white );
              }
            } ) );
            setFont( font );
          }
        } );
      }
    },
//Get the HTML text that will be used for the specified volume in meters cubed
    volumeToHTMLString: function( volumeInMetersCubed, format ) {
      //Convert to liters
      var volumeInLiters = metersCubedToLiters( volumeInMetersCubed );
      //Use an exponent of 10^-23 so that the prefix will range from 0 to 2 like in the first tab
      var exponent = -23;
      var mantissa = volumeInLiters / Math.pow( 10, exponent );
      //Show no water as 0 L water
      if ( volumeInLiters == 0 ) {
        return "0";
      }
      else //Otherwise, show in exponential notation
      {
        return new DecimalFormat( format ).format( mantissa ) + "x10<sup>" + exponent + "</sup>";
      }
    }
  } );
} );

