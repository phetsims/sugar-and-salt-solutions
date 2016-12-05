// Copyright 2014-2015, University of Colorado Boulder

/**
 * Base canvas class used by all tabs in the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   *
   * @param {Bounds2} layoutBounds
   * @constructor
   */
  function SugarAndSaltSolutionsView( layoutBounds ) {
    ScreenView.call( this, { layoutBounds: layoutBounds } );

    //Root node that shows the nodes in the stage coordinate frame
    this.rootNode = new Node();
    ScreenView.prototype.addChild.call( this, this.rootNode );
  }

  return inherit( ScreenView, SugarAndSaltSolutionsView, {
    addChild: function( node ) {
      this.rootNode.addChild( node );
    },
    removeChild: function( node ) {
      this.rootNode.removeChild( node );
    },
    /**
     * Get the root node used for stage coordinates, necessary
     * when transforming through the global coordinate frame to stage
     * @returns {*}
     */
    getRootNode: function() {
      return this.rootNode;
    }

  } );

} );
