// Copyright 2002-2011, University of Colorado
/**
 * Piccolo graphic that shows the solution (water + dissolved solutes) in the beaker.  It may be displaced upward by solid precipitate.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Shape = require( 'java.awt.Shape' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var Solution = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Solution' );
  var Node = require( 'SCENERY/nodes/Node' );

  function SolutionNode( transform, solution, color ) {
    addChild( new PhetPPath( color ).withAnonymousClassBody( {
      initializer: function() {
        solution.shape.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( shape ) {
            setPathTo( transform.modelToView( shape ) );
          }
        } ) );
      }
    } ) );
    //Make it so the mouse events pass through the front water layer so it is still possible to pick and move the conductivity tester probes
    setPickable( false );
    setChildrenPickable( false );
  }

  return inherit( Node, SolutionNode, {
  } );
} );

