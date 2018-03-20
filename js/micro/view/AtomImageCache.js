// Copyright 2014-2018, University of Colorado Boulder
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
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );


  // Map that contains the loaded images
  // uses the following stringified  object as key
  // diameter+" "+color.toNumber
  var imageMap = {};

  /**
   * @constructor
   */
  function AtomImageCache() {
  }

  sugarAndSaltSolutions.register( 'AtomImageCache', AtomImageCache );
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
        var key = diameter + ' ' + color.toNumber();
        if ( !imageMap[ key ] ) {
          var shadedSphereNode = new ShadedSphereNode( diameter, { mainColor: color } );
          shadedSphereNode.toImageNodeAsynchronous( function( imageNode ) {
            imageMap[ key ] = imageNode;
            imageNode.x = imageNode.bounds.width / 2;
            imageNode.y = imageNode.bounds.height / 2;
            addImageNodeCallBack( imageNode );
          } );
        }
        else {
          addImageNodeCallBack( imageMap[ key ] );
        }
      }
    } );
} );
