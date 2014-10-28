// Copyright 2002-2012, University of Colorado
/**
 * Piccolo node that draws a shaded sphere in the location of the spherical particle.
 * It switches between showing color for the atomic identity or color for the charge (blue = negative, red = positive, yellow = neutral)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var PCanvas = require( 'edu.umd.cs.piccolo.PCanvas' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PImage = require( 'edu.umd.cs.piccolo.nodes.PImage' );
  var PFrame = require( 'edu.umd.cs.piccolox.PFrame' );
  var RED_COLORBLIND = require( 'edu.colorado.phet.common.phetcommon.view.PhetColorScheme.RED_COLORBLIND' );//static
  var getAtomImage = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/view/AtomImageCache/getAtomImage' );//static

  function SphericalParticleNode( transform, particle, //Flag to show the color based on charge, or based on atom identity
                                  showChargeColor ) {
    //Sphere node used by both charge color and atom identity color
    define( function( require ) {
      function SimpleSphereNode( color ) {
        //Use a cached image to improve performance for large molecules such as sucrose
        PImage.call( this, getAtomImage( transform.modelToViewDeltaX( particle.radius * 2 ), color ) );
        particle.addPositionObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( position ) {
            var viewPoint = transform.modelToView( position ).toPoint2D();
            setOffset( viewPoint.x - getFullBounds().getWidth() / 2, viewPoint.y - getFullBounds().getHeight() / 2 );
          }
        } ) );
      }

      return inherit( PImage, SimpleSphereNode, {
      } );
    } );
    //Show the charge color, if user selected
    addChild( new SimpleSphereNode( particle.chargeColor ).withAnonymousClassBody( {
      initializer: function() {
        showChargeColor.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( showChargeColor ) {
            setVisible( showChargeColor );
          }
        } ) );
      }
    } ) );
    //Show the atom color, if user selected
    addChild( new SimpleSphereNode( particle.color ).withAnonymousClassBody( {
      initializer: function() {
        showChargeColor.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( showChargeColor ) {
            setVisible( !showChargeColor );
          }
        } ) );
      }
    } ) );
  }

  return inherit( Node, SphericalParticleNode, {
//Test application that draws a particle
    main: function( args ) {
      new PFrame( SphericalParticleNode.class.getName(), false, new PCanvas().withAnonymousClassBody( {
        initializer: function() {
          var p = new SphericalParticle( 100.0, new Vector2( 0, 0 ), RED_COLORBLIND, +1 );
          getLayer().addChild( new SphericalParticleNode( ModelViewTransform.createIdentity(), p, new BooleanProperty( false ) ).withAnonymousClassBody( {
            initializer: function() {
              setOffset( 100, 100 );
            }
          } ) );
        }
      } ) ).setVisible( true );
    }
  } );
} );

