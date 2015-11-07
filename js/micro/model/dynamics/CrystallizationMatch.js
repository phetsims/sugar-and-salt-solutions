// Copyright 2014-2015, University of Colorado Boulder
/**
 * Data structure used when searching for a place for an ion to join a crystal
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
   * @param {Particle} particle
   * @param {OpenSite} site
   * @constructor
   */
  function CrystallizationMatch( particle, site ) {

    //The particle used to test for a match
    this.particle = particle;

    //The site where the particle could join the crystal
    this.site = site;

    //The distance between the particle and the potential bonding site
    this.distance = particle.getPosition().minus( site.absolutePosition ).magnitude();
  }

  return inherit( Object, CrystallizationMatch, {

    /**
     * The absolute model shape (in meters) of where the binding site is,
     * for purposes of debugging and making sure it is within the water shape
     *
     * @returns {Shape}
     */
    getTargetShape: function() {
      return this.site.shape;
    }

  } );
} );

