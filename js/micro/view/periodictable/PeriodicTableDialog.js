/**
 * Dialog that shows the periodic table and updates when the selected solute type changes
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension = require( 'java.awt.Dimension' );
  var JDialog = require( 'javax.swing.JDialog' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var PhetFrame = require( 'edu.colorado.phet.common.phetcommon.view.PhetFrame' );
  var PhetPCanvas = require( 'edu.colorado.phet.common.piccolophet.PhetPCanvas' );
  var PeriodicTableNode = require( 'edu.colorado.phet.common.piccolophet.nodes.periodictable.PeriodicTableNode' );
  var SugarAndSaltSolutionsColorScheme = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsColorScheme' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType' );
  var Node = require( 'SCENERY/nodes/Node' );

//Color for metals in the periodic table. darker light-gray.  Chosen to make visible on the projector and work well for colorblindness (deuteranope and protanope) and contrast with non-metals
  var METAL_COLOR = new Color( 160, 160, 160 );
//Color for nonmetals in the periodic table. Brighter pink.  Chosen to make visible on the projector and work well for colorblindness (deuteranope and protanope) and contrast with metals
  var NON_METAL_COLOR = new Color( 255, 195, 195 );

  function PeriodicTableDialog( dispenser, colorScheme, parentFrame ) {
    JDialog.call( this, parentFrame );
    setContentPane( new PhetPCanvas().withAnonymousClassBody( {
      var canvas = this,

      //private
      var root = new Node(),
      initializer: function() {
        addWorldChild( root );
        //Match the background with the rest of the sim
        colorScheme.backgroundColorSet.color.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( color ) {
            setBackground( color );
          }
        } ) );
        //On init, and when the dispenser type changes, show the periodic table for the specified DispenserType
        dispenser.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( dispenserType ) {
            //Kelly also requested the inset to be larger than the original value of 2: "I am not sure the idea that "salts are made of atoms on opposite sides of the PT" is clear. Can we add more space around the PT in the popup window?"
            var inset = 26;
            var scale = 1.5;
            var periodicTableNode = new PeriodicTableNode( METAL_COLOR, new HighlightMetals( dispenser.get().getElementAtomicMasses() ) ).withAnonymousClassBody( {
              initializer: function() {
                scale( scale );
                setOffset( inset, inset );
              }
            } );
            root.removeAllChildren();
            root.addChild( periodicTableNode );
            //Show a legend below the periodic table to indicate the coloring scheme for metals vs nonmetals
            var legend = new PeriodicTableLegend( periodicTableNode.getFullBounds().getWidth(), scale, colorScheme.whiteBackground ).withAnonymousClassBody( {
              initializer: function() {
                setOffset( inset, periodicTableNode.getFullBounds().getMaxY() + inset );
              }
            } );
            root.addChild( legend );
            var preferredSize = new Dimension( periodicTableNode.getFullBounds().getWidth() + inset * 2, (periodicTableNode.getFullBounds().getHeight() + legend.getFullBounds().getHeight() + inset * 3) );
            //Set a centered stage strategy so the periodic table will be centered and scale up and down with the dialog bounds
            setWorldTransformStrategy( new CenteredStage( canvas, preferredSize ) );
            setPreferredSize( preferredSize );
          }
        } ) );
      }
    } ) );
    pack();
  }

  return inherit( JDialog, PeriodicTableDialog, {
    },
//statics
    {
      METAL_COLOR: METAL_COLOR,
      NON_METAL_COLOR: NON_METAL_COLOR
    } );
} );

