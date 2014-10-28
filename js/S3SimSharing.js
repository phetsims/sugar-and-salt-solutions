// Copyright 2002-2011, University of Colorado
/**
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IUserComponent = require( 'edu.colorado.phet.common.phetcommon.simsharing.messages.IUserComponent' );


  // enum Components implements IUserComponent 
  var Components = {
    saltColorMenuItem: 'saltColorMenuItem', backgroundColorMenuItem: 'backgroundColorMenuItem'
  };

  return inherit( Object, S3SimSharing, {
  } );
} );

