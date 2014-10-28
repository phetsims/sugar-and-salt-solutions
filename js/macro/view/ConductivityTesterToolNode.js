// Copyright 2002-2011, University of Colorado
/**
 * Tool node that is created when the user drags the conductivity tester from its toolbox.
 * This is modeled using composition since we must inherit from both ToolNode and ConductivityTesterNode
 * This leverages the reusable ToolNode code that was developed for bending light.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ToolNode = require( 'edu.colorado.phet.common.piccolophet.nodes.ToolNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PDimension = require( 'edu.umd.cs.piccolo.util.PDimension' );

//Reuse the same ConductivityTesterNode instead of creating new ones each time we drag out of the toolbox.
  function ConductivityTesterToolNode( node ) {
    this.node;
    this.node = node;
    addChild( node );
  }

  return inherit( ToolNode, ConductivityTesterToolNode, {
//Drag all parts of the conductivity tester when dragged out of the toolbox
    dragAll: function( viewDelta ) {
      node.dragAll( viewDelta );
    },
//Identify parts that can be dropped back in the toolbox, in this case, the light bulb
    getDroppableComponents: function() {
      return node.getDroppableComponents();
    }
  } );
} );

