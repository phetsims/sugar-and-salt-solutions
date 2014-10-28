// Copyright 2002-2011, University of Colorado
/**
 * A text label above the light bulb that indicates if the conductivity tester is short circuit (by having a bulb, wire or battery submerged)
 * For the short circuit message, use bold yellow text with no box and say "Short circuit!"
 * However, it can only short out if the water is conducting (that is, if it contains any salt).
 * <p/>
 * One of the complications in this class is that it is supposed to show above (in z-ordering) the salt-shaker.
 * This means it cannot be a child of the conductivity tester node, and instead we convert coordinates
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var PhetFont = require( 'edu.colorado.phet.common.phetcommon.view.util.PhetFont' );
  var ConductivityTesterChangeAdapter = require( 'edu.colorado.phet.common.piccolophet.nodes.conductivitytester.IConductivityTester.ConductivityTesterChangeAdapter' );
  var ConductivityTester = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ConductivityTester' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PText = require( 'edu.umd.cs.piccolo.nodes.PText' );
  var SHORT_CIRCUIT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/SHORT_CIRCUIT' );//static
  var yellow = require( 'java.awt.Color.yellow' );//static

  function ShortCircuitTextNode( conductivityTester, lightBulbNode ) {
    addChild( new PText( SHORT_CIRCUIT ).withAnonymousClassBody( {
      initializer: function() {
        setFont( new PhetFont( 18, true ) );
        setTextPaint( yellow );
        //Make the "short circuit!" text visible if the circuit has shorted out
        conductivityTester.shortCircuited.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( shortCircuited ) {
            setVisible( shortCircuited );
          }
        } ) );
        //Center above the light bulb
        var listener = new ConductivityTesterChangeAdapter().withAnonymousClassBody( {
          locationChanged: function() {
            var center2D = new Vector2( lightBulbNode.getGlobalFullBounds().getCenterX(), lightBulbNode.getGlobalFullBounds().getMinY() );
            center2D = globalToLocal( center2D );
            center2D = localToParent( center2D );
            setOffset( center2D.getX() - getFullBounds().getWidth() / 2, center2D.getY() - getFullBounds().getHeight() );
          }
        } );
        conductivityTester.addConductivityTesterChangeListener( listener );
        //Initialize correctly on startup
        listener.locationChanged();
      }
    } ) );
  }

  return inherit( Node, ShortCircuitTextNode, {
  } );
} );

