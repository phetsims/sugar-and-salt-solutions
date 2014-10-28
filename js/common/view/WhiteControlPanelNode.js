// Copyright 2002-2011, University of Colorado
/**
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Node = require( 'SCENERY/nodes/Node' );

  function WhiteControlPanelNode( content ) {
    ControlPanelNode.call( this, content, Color.white );
  }

  return inherit( ControlPanelNode, WhiteControlPanelNode, {
  } );
} );

