// Copyright 2002-2012, University of Colorado
/**
 * Graphical representation of a salt or sugar crystal, shown as a white square
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'KITE/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var MacroCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroCrystal' );
  var Node = require( 'SCENERY/nodes/Node' );
  var white = require( 'java.awt.Color.white' );//static

  function CrystalNode( transform, crystal, color, size ) {
    //Draw the shape of the salt crystal at its location
    addChild( new PhetPPath( white ).withAnonymousClassBody( {
      initializer: function() {
        crystal.position.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( modelPosition ) {
            var viewPosition = transform.modelToView( modelPosition );
            //Use a scaled cartoon size for the grains, since actual grain sizes would be much to large
            var cartoonSize = size / 5 * 2;
            setPathTo( new Rectangle.Number( viewPosition.getX() - cartoonSize / 2, viewPosition.getY() - cartoonSize / 2, cartoonSize, cartoonSize ) );
          }
        } ) );
        //Synchronize the color with the specified color, which can be changed by the user in the color chooser dialog
        color.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( color ) {
            setPaint( color );
          }
        } ) );
      }
    } ) );
  }

  return inherit( Node, CrystalNode, {
  } );
} );

