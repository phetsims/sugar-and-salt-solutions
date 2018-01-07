// Copyright 2014-2016, University of Colorado Boulder
/**
 * graphic that shows the solution (water + dissolved solutes) in the beaker.
 * It may be displaced upward by solid precipitate.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Solution} solution
   * @param {Color} color
   * @constructor
   */
  function SolutionNode( modelViewTransform, solution, color ) {
    Node.call( this, {
      //Make it so the mouse events pass through the front water layer so it is
      //still possible to pick and move the conductivity tester probes
      pickable: false
    } );

    //solution.shape is a derived property based on volume of the solution
    var solutionPath = new Path( modelViewTransform.modelToViewShape( solution.shape.get() ), { fill: color } );
    this.addChild( solutionPath );

    solution.shape.link( function( shape ) {
      solutionPath.setShape( modelViewTransform.modelToViewShape( shape ) );
    } );

  }

  return inherit( Node, SolutionNode, {} );

} );

// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.common.view;
//
//import java.awt.Color;
//import java.awt.Shape;
//
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.common.piccolophet.nodes.PhetPPath;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Solution;
//import edu.umd.cs.piccolo.PNode;
//
///**
// * Piccolo graphic that shows the solution (water + dissolved solutes) in the beaker.  It may be displaced upward by solid precipitate.
// *
// * @author Sam Reid
// */
//public class SolutionNode extends PNode {
//    public SolutionNode( final ModelViewTransform transform, final Solution solution, Color color ) {
//        addChild( new PhetPPath( color ) {{
//            solution.shape.addObserver( new VoidFunction1<Shape>() {
//                public void apply( Shape shape ) {
//                    setPathTo( transform.modelToView( shape ) );
//                }
//            } );
//        }} );
//
//        //Make it so the mouse events pass through the front water layer so it is still possible to pick and move the conductivity tester probes
//        setPickable( false );
//        setChildrenPickable( false );
//    }
//}
