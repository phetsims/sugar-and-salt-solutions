//  Copyright 2002-2014, University of Colorado Boulder
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
  var VBox = require( 'SUN/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var SOLUTE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/solute' );

  /**
   * @param {Node} soluteSelector
   * @constructor
   */
  function SoluteControlPanelNode( soluteSelector ) {

    var options = {
      spacing: 5, //Use a smaller spacing so that the content doesn't get too far away from the title in the Micro tab
      align: 'left'
    };

    var title = new Text( SOLUTE, { font: new PhetFont( 18 ) } );
    var spacer = new Path( new Rectangle( 0, 0, 0, 0 ), {
      fill: new Color( 0, 0, 0, 0 )
    } );

    options.children = [title, spacer, soluteSelector ];
    VBox.call( this, options );
  }

  return inherit( VBox, SoluteControlPanelNode );

} );

