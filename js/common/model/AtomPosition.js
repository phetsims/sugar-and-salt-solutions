// Copyright 2015, University of Colorado Boulder
/**
 * Data structure that has the type of the atom, its element identifier and the position in model space
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {string} type
   * @param {Vector2} position
   * @constructor
   */
  function AtomPosition( type, position ) {
    this.type = type;
    this.position = position;
  }

  return inherit( Object, AtomPosition, {
    /**
     * Create the SphericalParticle corresponding to this atom type that can be used in the model
     * @returns {SphericalParticle}
     */
    createConstituent: function() {
      throw new Error( 'createConstituent must be implemented in descendant classes of AtomPosition' );
    }
  } );
} );
