// Copyright 2002-2011, University of Colorado
/**
 * Graphical representation of a salt crystal
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Property = require( 'AXON/Property' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var MacroSalt = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroSalt' );

  function SaltNode( transform, salt, color ) {
    CrystalNode.call( this, transform, salt, color, transform.modelToViewDeltaX( salt.length ) );
  }

  return inherit( CrystalNode, SaltNode, {
  } );
} );

