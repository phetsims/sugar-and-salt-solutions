// Copyright 2002-2011, University of Colorado
/**
 * Legend for the periodic table to indicate coloring scheme for metals vs nonmetals.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Rectangle = require( 'KITE/Rectangle' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var HBox = require( 'edu.colorado.phet.common.piccolophet.nodes.layout.HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PText = require( 'edu.umd.cs.piccolo.nodes.PText' );
  var CELL_DIMENSION = require( 'edu.colorado.phet.common.piccolophet.nodes.periodictable.PeriodicTableNode.CELL_DIMENSION' );//static
  var METAL = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/METAL' );//static
  var NON_METAL = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/NON_METAL' );//static
  var CONTROL_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/CONTROL_FONT' );//static
  var METAL_COLOR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/view/periodictable/PeriodicTableDialog/METAL_COLOR' );//static
  var NON_METAL_COLOR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/view/periodictable/PeriodicTableDialog/NON_METAL_COLOR' );//static
  var black = require( 'java.awt.Color.black' );//static
  var white = require( 'java.awt.Color.white' );//static

//Create a table legend based on the width of the periodic table
  function PeriodicTableLegend( periodicTableWidth, scale, whiteBackground ) {
    //use color squares that are the same size as the element squares
    var box = new Rectangle.Number( 0, 0, CELL_DIMENSION * scale, CELL_DIMENSION * scale );
    //Create a box in the bottom left for gray metals
    var metalBox = new HBox( new PhetPPath( box, METAL_COLOR, new BasicStroke( 1 ), black ), new PText( METAL ).withAnonymousClassBody( {
      initializer: function() {
        setFont( CONTROL_FONT );
        whiteBackground.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( whiteBackground ) {
            setTextPaint( whiteBackground ? black : white );
          }
        } ) );
      }
    } ) );
    addChild( metalBox );
    //Create a box in the bottom right for pink non-metals
    addChild( new HBox( new PhetPPath( box, NON_METAL_COLOR, new BasicStroke( 1 ), black ), new PText( NON_METAL ).withAnonymousClassBody( {
      initializer: function() {
        setFont( CONTROL_FONT );
        whiteBackground.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( whiteBackground ) {
            setTextPaint( whiteBackground ? black : white );
          }
        } ) );
      }
    } ) ).withAnonymousClassBody( {
        initializer: function() {
          setOffset( periodicTableWidth - getFullBounds().getWidth(), 0 );
        }
      } ) );
  }

  return inherit( Node, PeriodicTableLegend, {
  } );
} );

