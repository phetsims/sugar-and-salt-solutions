// Copyright 2002-2011, University of Colorado
/**
 * Data structure used when searching for a place for an ion to join a crystal
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var OpenSite = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/OpenSite' );

  function CrystallizationMatch( particle, site ) {
    //The particle used to test for a match
    this.particle;
    //The site where the particle could join the crystal
    this.site;
    //The distance between the particle and the potential bonding site
    this.distance;
    this.particle = particle;
    this.site = site;
    this.distance = particle.getPosition().minus( site.absolutePosition ).magnitude();
  }

  return inherit( Object, CrystallizationMatch, {
    toString: function() {
      return "CrystallizationMatch{" + "particle=" + particle + ", constituent=" + site + ", distance=" + distance + '}';
    },
//The absolute model shape (in meters) of where the binding site is, for purposes of debugging and making sure it is within the water shape
    getTargetShape: function() {
      return site.shape;
    }
  } );
} );

