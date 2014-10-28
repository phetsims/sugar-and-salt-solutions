// Copyright 2002-2011, University of Colorado
/**
 * Base canvas class used by all tabs in the sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var PhetPCanvas = require( 'edu.colorado.phet.common.piccolophet.PhetPCanvas' );
  var Node = require( 'SCENERY/nodes/Node' );

//Function that is used in the floating clock control panel to hide the time readout
  var NO_READOUT = new Function1().withAnonymousClassBody( {
    apply: function( aDouble ) {
      return "";
    }
  } );

  function SugarAndSaltSolutionsCanvas() {
    //Root node that shows the nodes in the stage coordinate frame
    this.rootNode;
    // Root of the scene graph in stage coordinates (scaled with the window size)
    rootNode = new Node();
    addWorldChild( rootNode );
  }

  return inherit( PhetPCanvas, SugarAndSaltSolutionsCanvas, {
      addChild: function( node ) {
        rootNode.addChild( node );
      },
      removeChild: function( node ) {
        rootNode.removeChild( node );
      },
//Get the root node used for stage coordinates, necessary when transforming through the global coordinate frame to stage
      getRootNode: function() {
        return rootNode;
      }
    },
//statics
    {
      NO_READOUT: NO_READOUT
    } );
} );

