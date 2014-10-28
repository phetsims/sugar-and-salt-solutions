// Copyright 2002-2011, University of Colorado
/**
 * Global (application-wide) settings for Sugar and Salt Solutions, such as color scheme and developer options.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetApplicationConfig = require( 'edu.colorado.phet.common.phetcommon.application.PhetApplicationConfig' );
  var PhetFrame = require( 'edu.colorado.phet.common.phetcommon.view.PhetFrame' );

  function GlobalState( colorScheme, config, frame, singleMicroKit ) {
    this.colorScheme;
    this.config;
    this.frame;
    //WET LAB: Flag indicating that only sugar and salt (kit 1) should be available in the micro tab.  Used for wet lab in fall 2011 and can probably be deleted afterwards.
    this.singleMicroKit;
    this.colorScheme = colorScheme;
    this.config = config;
    this.frame = frame;
    this.singleMicroKit = singleMicroKit;
  }

  return inherit( Object, GlobalState, {
  } );
} );

