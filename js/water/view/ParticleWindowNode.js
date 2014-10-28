// Copyright 2002-2011, University of Colorado
/**
 * This is a framed "window"-like node that shows the zoomed in water and solute particles.
 * Allows us to model periodic boundary conditions (where the particle leaves one side and comes in the other, without flickering.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Color = require( 'SCENERY/util/Color' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var WaterModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterModel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PClip = require( 'edu.umd.cs.piccolox.nodes.PClip' );

//Color to show around the particle window as its border.  Also used for the zoom in box in ZoomIndicatorNode

  //private
  var FRAME_COLOR = Color.orange;

  function ParticleWindowNode( model, transform ) {
    //Layer for particles that should be clipped (like they are inside the window)
    this.particleLayer = new Node();
    var clip = new PClip().withAnonymousClassBody( {
      initializer: function() {
        //Show a frame around the particles so they are clipped when they move out of the window
        setPathTo( transform.modelToView( model.particleWindow.toRectangle2D() ) );
        setStroke( new BasicStroke( 2 ) );
        setStrokePaint( FRAME_COLOR );
        addChild( particleLayer );
      }
    } );
    addChild( clip );
  }

  return inherit( Node, ParticleWindowNode, {
  } );
} );

