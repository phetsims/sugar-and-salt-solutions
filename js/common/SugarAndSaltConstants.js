// Copyright 2002-2011, University of Colorado
/**
 * NeuronConstants is a collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );

  return Object.freeze( {
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),
    VOLUME_PER_SOLID_MOLE_SALT: 0.02699 / 1000.0
  } );
} )
;
