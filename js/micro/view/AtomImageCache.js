// Copyright 2002-2011, University of Colorado
/**
 * Caches images for atoms because creating a new one for each particle creates a 1 second delay when creating sucrose crystals.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var BufferedImage = require( 'java.awt.image.BufferedImage' );
  var HashMap = require( 'java.util.HashMap' );
  var ShadedSphereNode = require( 'edu.colorado.phet.common.piccolophet.nodes.ShadedSphereNode' );
  var toBufferedImage = require( 'edu.colorado.phet.common.phetcommon.view.util.BufferedImageUtils.toBufferedImage' );//static


  // static class: Key
  var Key =
//Keys for caching the images by diameter and color
    define( function( require ) {
      function Key( diameter, color ) {
        this.diameter;
        this.color;
        this.diameter = diameter;
        this.color = color;
      }

      return inherit( Object, Key, {
//Necessary since the key is used in a map as a key, automatically generated (by IDEA)
        equals: function( o ) {
          if ( this == o ) {
            return true;
          }
          if ( o == null || getClass() != o.getClass() ) {
            return false;
          }
          var key = o;
          return Number.compare( key.diameter, diameter ) == 0 && color.equals( key.color );
        },
//Necessary since the key is used in a map as a key, automatically generated (by IDEA)
        hashCode: function() {
          var result;
          var temp;
          temp = diameter != +0.0
          d ? Number.doubleToLongBits( diameter ) : 0
          L;
          result = (temp ^ (temp >>> 32));
          result = 31 * result + color.hashCode();
          return result;
        }
      } );
    } );
  ;
//Map that contains the created images
  var map = new HashMap();

  return inherit( Object, AtomImageCache, {
//Load a cached image, or create and cache one if it doesn't already exist in the cache
      getAtomImage: function( diameter, color ) {
        var key = new Key( diameter, color );
        if ( !map.containsKey( key ) ) {
          map.put( key, toBufferedImage( new ShadedSphereNode( diameter, color, Color.white, Color.black ).toImage() ) );
        }
        return map.get( key );
      }
    },
//statics
    {
      map: map
    } );
} );

