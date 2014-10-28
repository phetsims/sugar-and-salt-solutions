// Copyright 2002-2011, University of Colorado
/**
 * Strategy pattern interface for updating particles as time passes, see UpdateStrategy.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );


  return inherit( Object, IUpdateStrategy, {
    stepInTime: function( particle, dt ) {}
  } );
} );

