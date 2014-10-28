// Copyright 2002-2011, University of Colorado
/**
 * Basic information about an element or ion to be shown, such as Na+ or Cl-, including the color, name and radius.
 * Atomic number is never needed in this sim, but could be added if this is generalized for future sims.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );

  function Element( name, radius, color ) {
    this.name;
    this.radius;
    this.color;
    this.name = name;
    this.radius = radius;
    this.color = color;
  }

  return inherit( Object, Element, {
  } );
} );

