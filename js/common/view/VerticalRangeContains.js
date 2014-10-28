// Copyright 2002-2011, University of Colorado
/**
 * This property is used to determine if any fluid can flow out through the output pipe,
 * it works by observing the bounds of the solution and seeing if any part of that overlaps any part of the open pipe.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var Rectangle = require( 'KITE/Rectangle' );
  var CompositeProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.CompositeProperty' );
  var Property = require( 'AXON/Property' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );

  function VerticalRangeContains( shape, minY, maxY ) {
    CompositeProperty.call( this, new Function0().withAnonymousClassBody( {
      apply: function() {
        //the X regions of the rectangles are the same so they can be safely ignored
        var parentBounds = shape.get().getBounds2D();
        var pseudoBounds = new Rectangle.Number( parentBounds.getX(), minY, parentBounds.getWidth(), maxY );
        return parentBounds.intersects( pseudoBounds );
      }
    } ), shape );
  }

  return inherit( CompositeProperty, VerticalRangeContains, {
  } );
} );

