// Copyright 2002-2014, University of Colorado Boulder
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
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );
  var Color = require( 'SCENERY/util/Color' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );

  // strings
  var SOLUTE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/solute' );

  /**
   * @param {Node} soluteSelector
   * @constructor
   */
  function SoluteControlPanelNode( soluteSelector ) {
    var thisPanel = this;
    var title = new Text( SOLUTE, { font: SugarAndSaltConstants.TITLE_FONT} );

    var vBoxContent = new VBox( {children: [title, soluteSelector ],
      spacing: 5, //Use a smaller spacing so that the content doesn't get too far away from the title in the Micro tab;
      align: 'center',
      resize: false
    } );

    Panel.call( thisPanel, vBoxContent, {
      xMargin: 4,
      yMargin: 4,
      fill: Color.WHITE,
      stroke: 'gray',
      lineWidth: 1
    } );


  }

  return inherit( Panel, SoluteControlPanelNode );
} );

