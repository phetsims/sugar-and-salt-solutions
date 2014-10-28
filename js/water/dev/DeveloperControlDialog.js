// Copyright 2002-2011, University of Colorado
/**
 * Dialog that shows the developer controls, when running in "-dev" mode and after the dev control button is pressed.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Window = require( 'java.awt.Window' );
  var JDialog = require( 'javax.swing.JDialog' );
  var WaterModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterModel' );

  function DeveloperControlDialog( owner, waterModel ) {
    JDialog.call( this, owner );
    setContentPane( new DeveloperControl( waterModel ) );
    pack();
  }

  return inherit( JDialog, DeveloperControlDialog, {
  } );
} );

