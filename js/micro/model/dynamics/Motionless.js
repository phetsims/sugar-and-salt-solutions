// Copyright 2002-2011, University of Colorado
/**
 * Motion strategy that doesn't move the particle at all.  Used in composites such as sucrose crystals, since the individual atoms shouldn't move independently
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );


  return inherit( Object, Motionless, {
    stepInTime: function( particle, dt ) {
    }
  } );
} );

