// Copyright 2002-2011, University of Colorado
/**
 * Interface that allows adding and removing nodes, used by SphericalParticleNodeFactory for adding sphere graphics
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );


  return inherit( Object, ICanvas, {
    addChild: function( node ) {},
    removeChild: function( node ) {}
  } );
} );

