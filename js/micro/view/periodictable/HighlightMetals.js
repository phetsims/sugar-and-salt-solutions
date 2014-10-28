// Copyright 2002-2011, University of Colorado
/**
 * Rules for painting metal Elements in the periodic table differently than nonmetals since that is a major learning goal of this tab.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Color = require( 'SCENERY/util/Color' );
  var Stroke = require( 'java.awt.Stroke' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Arrays = require( 'java.util.Arrays' );
  var List = require( 'java.util.List' );
  var SwingUtilities = require( 'javax.swing.SwingUtilities' );
  var ColorChooserFactory = require( 'edu.colorado.phet.common.phetcommon.dialogs.ColorChooserFactory' );
  var Listener = require( 'edu.colorado.phet.common.phetcommon.dialogs.ColorChooserFactory.Listener' );
  var PhetFont = require( 'edu.colorado.phet.common.phetcommon.view.util.PhetFont' );
  var BasicElementCell = require( 'edu.colorado.phet.common.piccolophet.nodes.periodictable.BasicElementCell' );
  var CellFactory = require( 'edu.colorado.phet.common.piccolophet.nodes.periodictable.CellFactory' );
  var ElementCell = require( 'edu.colorado.phet.common.piccolophet.nodes.periodictable.ElementCell' );
  var RED_COLORBLIND = require( 'edu.colorado.phet.common.phetcommon.view.PhetColorScheme.RED_COLORBLIND' );//static
  var NON_METAL_COLOR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/view/periodictable/PeriodicTableDialog/NON_METAL_COLOR' );//static
  var black = require( 'java.awt.Color.black' );//static

  function HighlightMetals( selectedAtomicMasses ) {
    //Atomic numbers of the nonmetals to be indicated in the periodic table

    //private
    this.nonmetals = new ArrayList( Arrays.asList( 1, 2, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 33, 34, 35, 36, 52, 53, 54, 85, 86, 118 ) );
    //Atoms selected by the user

    //private
    this.selectedAtomicMasses;
    //Allow the developer to choose a different highlighter color

    //private
    this.debug = false;
    this.selectedAtomicMasses = Arrays.asList( selectedAtomicMasses );
  }

  return inherit( Object, HighlightMetals, {
//Create a cell based on metal vs nonmetal and selected vs unselected
    createCellForElement: function( atomicNumberOfCell, backgroundColor ) {
      var selected = selectedAtomicMasses.contains( atomicNumberOfCell );
      var background = nonmetals.contains( atomicNumberOfCell ) ? NON_METAL_COLOR : backgroundColor;
      var font = selected ? new PhetFont( PhetFont.getDefaultFontSize(), true ) : new PhetFont( 12 );
      var stroke = selected ? new BasicStroke( 3 ) : new BasicStroke( 1 );
      var strokeColor = selected ? RED_COLORBLIND : black;
      return new BasicElementCell( atomicNumberOfCell, background ).withAnonymousClassBody( {
        initializer: function() {
          //Allow the developer to choose a different highlighter color
          if ( selected && debug ) {
            ColorChooserFactory.showDialog( "", null, strokeColor, new Listener().withAnonymousClassBody( {
              colorChanged: function( color ) {
                getBox().setStrokePaint( color );
              },
              ok: function( color ) {
              },
              cancelled: function( originalColor ) {
              }
            } ), true );
          }
          getBox().setStroke( stroke );
          getText().setFont( font );
          getBox().setPaint( background );
          getBox().setStrokePaint( strokeColor );
        },
        //Wait until others are added so that moving to front will actually work, otherwise 2 sides would be clipped by nodes added after this
        tableInitComplete: function() {
          super.tableInitComplete();
          //For unknown reasons, some nodes (Oxygen in sodium nitrate in sugar-and-salt solutions) get clipped if you don't schedule this for later
          if ( selectedAtomicMasses.contains( atomicNumberOfCell ) ) {
            SwingUtilities.invokeLater( new Runnable().withAnonymousClassBody( {
              run: function() {
                moveToFront();
              }
            } ) );
          }
        }
      } );
    }
  } );
} );

