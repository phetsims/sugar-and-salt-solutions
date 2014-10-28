// Copyright 2002-2011, University of Colorado
/**
 * Base class for controls that allow the user to select from different solutes.
 * This general part of the code provides layout and a title, and relies on constructor parameter for the tab-specific control
 *
 * @author John Blanco
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'java.awt.Rectangle' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var VBox = require( 'edu.colorado.phet.common.piccolophet.nodes.layout.VBox' );
  var SugarAndSaltSolutionsResources = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PText = require( 'edu.umd.cs.piccolo.nodes.PText' );

  function SoluteControlPanelNode( soluteSelector ) {
    WhiteControlPanelNode.call( this, new VBox(//Use a smaller spacing so that the content doesn't get too far away from the title in the Micro tab
      5, createTitle(), //spacer
      new PhetPPath( new Rectangle( 0, 0, 0, 0 ), new Color( 0, 0, 0, 0 ) ), soluteSelector ) );
  }

  return inherit( WhiteControlPanelNode, SoluteControlPanelNode, {
    createTitle: function() {
      return new PText( SugarAndSaltSolutionsResources.Strings.SOLUTE ).withAnonymousClassBody( {
        initializer: function() {
          setFont( BeakerAndShakerCanvas.TITLE_FONT );
        }
      } );
    }
  } );
} );

