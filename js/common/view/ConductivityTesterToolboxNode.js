//  Copyright 2002-2014, University of Colorado Boulder

/**
 * The toolbox node that the conductivity tester gets dragged out of and back into.
 * There are 4 classes (ConductivityTesterNode,  SugarAndSaltSolutionsConductivityTesterNode, ConductivityTesterToolNode, ConductivityTesterToolboxNode)
 * needed to implement the conductivity tester feature.   To clarify the naming and conventions:
 * The ToolIcon is the icon drawn on the Toolbox, and used to create the tester node which is a
 * ToolNode (Sugar and Salt Solutions Conductivity Tester Node is a sim-specific subclass).
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
  var Shape = require( 'KITE/Shape' );

  var SugarAndSaltSolutionsConductivityTesterNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SugarAndSaltSolutionsConductivityTesterNode' );

  /**
   *
   * @param {ConductivityTester} conductivityTester
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ConductivityTesterToolboxNode( conductivityTester, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode );

    //@protected Background for ConductivityTester Icon
    thisNode.background = new Path( Shape.rectangle( 0, 0, 10, 10 ), {
      fill: 'white'
    } );
 //  TODO thisNode.addChild( thisNode.background );

    var sugarAndSaltSolutionsConductivityTesterNode = new SugarAndSaltSolutionsConductivityTesterNode( conductivityTester, modelViewTransform );
    thisNode.addChild( sugarAndSaltSolutionsConductivityTesterNode );
  }

  return inherit( Node, ConductivityTesterToolboxNode, {} );

} );

