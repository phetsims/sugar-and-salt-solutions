//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Atom Image Factory - uses node.toImage and caches the image representation of the node. This is done to improve
 * performance
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );


  // Map that contains the loaded images
  // uses the following stringified  object as key
  // diameter+" "+color.toNumber
  var imageMap = {};

  /**
   * @constructor
   */
  function AtomImageCache() {
  }

  return inherit( Object, AtomImageCache, {},
    //statics
    {
      /**
       * Uses toImage(asynchronous) method to convert a node to Image
       * Since toImage is asynchronous this method uses a call back function
       *
       * @param {number} diameter
       * @param {Color} color
       * @param {function} addImageNodeCallBack
       */
      getAtomImage: function( diameter, color, addImageNodeCallBack ) {
        var key = diameter + " " + color.toNumber();
        if ( !imageMap[ key ] ) {
          var shadedSphereNode = new ShadedSphereNode( diameter, { mainColor: color } );
          shadedSphereNode.toImageNodeAsynchronous( function( imageNode ) {
            imageMap[ key ] = imageNode;
            addImageNodeCallBack( imageNode );
          } );
        }
        else {
          addImageNodeCallBack( imageMap[ key ] );
        }
      }
    } );
} );
