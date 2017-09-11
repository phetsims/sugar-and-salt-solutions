// Copyright 2014-2015, University of Colorado Boulder
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
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var soluteString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/solute' );

  /**
   * @param {Node} soluteSelector
   * @constructor
   */
  function SoluteControlPanelNode( soluteSelector ) {
    var title = new Text( soluteString, { font: SugarAndSaltConstants.TITLE_FONT } );

    var vBoxContent = new VBox( {children: [title, soluteSelector ],
      spacing: 5, //Use a smaller spacing so that the content doesn't get too far away from the title in the Micro tab;
      align: 'center',
      resize: false
    } );

    Panel.call( this, vBoxContent, {
      xMargin: 4,
      yMargin: 4,
      fill: Color.WHITE,
      stroke: 'gray',
      lineWidth: 1
    } );
  }

  return inherit( Panel, SoluteControlPanelNode );
} );

