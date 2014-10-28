// Copyright 2002-2011, University of Colorado
/**
 * This node just shows the walls (sides and bottom) of the beaker
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var Beaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Beaker' );
  var Node = require( 'SCENERY/nodes/Node' );
  var lightGray = require( 'java.awt.Color.lightGray' );//static

  function BeakerNode( transform, beaker ) {
    addChild( new PhetPPath( transform.modelToView( beaker.getWallShape() ), lightGray ) );
  }

  return inherit( Node, BeakerNode, {
  } );
} );

