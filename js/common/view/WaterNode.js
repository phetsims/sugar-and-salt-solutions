// Copyright 2002-2011, University of Colorado
/**
 * Node that displays the water flowing out of a faucet, shown behind the faucet node so that it doesn't need to match up perfectly
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var Node = require( 'SCENERY/nodes/Node' );
  var WATER_COLOR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/WATER_COLOR' );//static

  function WaterNode( transform, waterShape ) {
    addChild( new PhetPPath( WATER_COLOR ).withAnonymousClassBody( {
      initializer: function() {
        waterShape.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( shape ) {
            setPathTo( transform.modelToView( shape ) );
          }
        } ) );
      }
    } ) );
  }

  return inherit( Node, WaterNode, {
  } );
} );

