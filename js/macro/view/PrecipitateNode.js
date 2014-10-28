// Copyright 2002-2011, University of Colorado
/**
 * If you're not part of the solution, you're part of the precipitate.  This node draws the clump of crystals that has come out of solution (because of passing the saturation point)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'KITE/Rectangle' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var Beaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Beaker' );
  var Node = require( 'SCENERY/nodes/Node' );

  function PrecipitateNode( transform, precipitateVolume, beaker ) {
    //Show as white, but it renders between the water layers so it looks like it is in the water (unless it passes the top of the water)
    addChild( new PhetPPath( Color.white ).withAnonymousClassBody( {
      initializer: function() {
        precipitateVolume.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( precipitateVolume ) {
            //Note, this assumes that the beaker (and precipitate) are rectangular
            setPathTo( transform.modelToView( new Rectangle.Number( beaker.getX(), beaker.getY(), beaker.getWidth(), beaker.getHeightForVolume( precipitateVolume ) ) ) );
          }
        } ) );
      }
    } ) );
    //Make it not intercept mouse events so the user can still retrieve a probe that is buried in the precipitate
    setPickable( false );
    setChildrenPickable( false );
  }

  return inherit( Node, PrecipitateNode, {
  } );
} );

