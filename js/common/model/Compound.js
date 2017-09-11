// Copyright 2014-2015, University of Colorado Boulder

/**
 * A compound represents 0 or more (usually 1 or more) constituents which can be put into solution.  It may be constructed
 * from a lattice.The type is generic since some compounds such as NaCl are made of SphericalParticles while others
 * such as Sucrose are made from molecules with their own substructure
 * Adding the type parameter at this level makes it so we don't have as many casts when acquiring components during
 * dissolve or iteration processes.When a compound has 0 constituents, it should be removed from the model.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ItemList' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Particle' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/SphericalParticle' );

  var Rectangle = require( 'DOT/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Vector2D} position
   * @param {number} angle
   * @constructor
   */
  function Compound( position, angle ) {
    Particle.call( this, position );

    //Put the vectors at the same random angle so all compounds don't come out at the same angle
    this.angle = angle;

    //The time the lattice entered the water, if any
    this.underwaterTime = null; // new None<Double>();

    //Members in the compound
    this.constituents = new ItemList();
  }

  return inherit( Particle, Compound, {

    /**
     * Set the position of the compound, and update the location of all constituents Vector2D
     * @Override
     * @param {Vector2} location
     */
    setPosition: function( location ) {
      Particle.prototype.setPosition.call( this, location );
      this.updateConstituentLocations();
    },

    /**
     * Update all constituents with their correct absolute location based on
     * the crystal location and their relative location within the crystal
     */
    updateConstituentLocations: function() {
      var self = this;
      this.constituents.forEach( function( constituent ) {
        self.updateConstituentLocation( constituent );
      } );
    },

    /**
     * Update the constituent with its correct absolute location based on the crystal location and its relative
     * location within the crystal, and the crystal's angle
     * @param {Constituent} constituent
     */
    updateConstituentLocation: function( constituent ) {
      constituent.particle.setPosition( this.getPosition().plus( constituent.relativePosition.rotated( this.angle ) ) );
    },

    getAngle: function() {
      return this.angle;
    },

    /**
     * @Override
     * The shape of a lattice is the combined area of its constituents, using bounding rectangles to improve performance
     * @returns {Shape}
     */
    getShape: function() {
      // If reduced to zero constituents, should be removed from the model before this is called otherwise
      // will cause ArrayIndexOutOfBoundsException

      var bounds2D = this.constituents.get( 0 ).particle.getShape().bounds;
      var rect = new Rectangle( bounds2D.getX(), bounds2D.getY(), bounds2D.getWidth(), bounds2D.getHeight() ); // TODO Ashraf, Do we need this extra Rect?

      this.constituents.forEach( function( constituent ) {
        rect = rect.union( constituent.particle.getShape().bounds );
      } );

      return Shape.rectangle( rect.x, rect.y, rect.width, rect.height );
    },
    /**
     * Iterate over the particles rather than constituents to make client code read easier, since it is more common
     * to iterate over particles than constituents (which also keep track of relative location)
     * To iterate over constituents, you can use getConstituent(int)
     * @returns {Array}
     */
    iterator: function() {
      return _.map( this.constituents.getArray(), function( constituent ) {
        return constituent.particle;
      } );
    },

    isUnderwaterTimeRecorded: function() {
      return _.isNumber( this.underwaterTime );
    },

    /**
     * @param {number} time
     */
    setUnderwater: function( time ) {
      this.underwaterTime = time;
    },

    getUnderWaterTime: function() {
      return this.underwaterTime;
    },

    /**
     * Returns the number of constituents in the compound
     * @return number
     */
    numberConstituents: function() {
      return this.constituents.length;
    },

    /**
     * Gets the constituent at the specified index
     * @param {number} i
     * @returns {Constituent}
     */
    getConstituent: function( i ) {
      return this.constituents.get( i );
    },

    /**
     * Get all constituents in the compound, defensive copy
     * @returns {ItemList}
     */
    getConstituents: function() {
      return new ItemList( this.constituents.getArray() );
    },

    /**
     * Removes the specified constituent from the compound
     * @param {Constituent} constituent
     */
    removeConstituent: function( constituent ) {
      this.constituents.remove( constituent );
    },

    /**
     * Count the number of constituents matching the specified type
     * @param {function} type
     * @returns {number}
     */
    count: function( type ) {
      return this.constituents.countByClass( type );
    },

    /**
     * @param {Constituent} constituent
     */
    addConstituent: function( constituent ) {
      this.constituents.add( constituent );
      this.updateConstituentLocation( constituent );
    },

    /**
     * Determine whether the compound contains the specified particle, to ignore intra-molecular forces in WaterModel
     * @param {Particle} particle
     * @returns {boolean}
     */
    containsParticle: function( particle ) {
      return this.constituents.contains( function( constituent ) {
        return constituent.particle === particle;
      } );
    },

    /**
     *Sets the position and angle of the compound, and updates the location of all constituents
     * @param {Vector2} modelPosition
     * @param {number} angle
     */
    setPositionAndAngle: function( modelPosition, angle ) {
      Particle.prototype.setPosition.call( this, modelPosition );
      this.angle = angle;
      this.updateConstituentLocations();
    },

    /**
     * Get all the spherical particles within this compound and its children recursively, so they can be displayed with Nodes
     * @returns {Array<SphericalParticle>}
     */
    getAllSphericalParticles: function() {
      var sphericalParticles = [];
      _.each( this.constituents, function( constituent ) {
        if ( constituent.particle instanceof SphericalParticle ) {
          sphericalParticles.push( constituent.particle );
        }
        else if ( constituent.particle instanceof Compound ) {
          var compound = constituent.particle;
          var subParticles = compound.getAllSphericalParticles();
          _.each( subParticles, function( subParticle ) {
            sphericalParticles.push( subParticle );
          } );
        }
      } );
      return sphericalParticles;
    }
  } );
} );
// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.awt.Shape;
//import java.awt.geom.Rectangle2D;
//import java.util.ArrayList;
//import java.util.Iterator;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.util.Option;
//import edu.colorado.phet.common.phetcommon.util.Option.None;
//import edu.colorado.phet.common.phetcommon.util.Option.Some;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//

//public class Compound<T extends Particle> extends Particle implements Iterable<T> {
//

//

//

//


//

//


//


//    //Returns an array list of the constituent particle instances, for use with varargs calls in WaterCanvas
//    public ArrayList<T> getConstituentParticleList() {
//        return new ArrayList<T>() {{
//            for ( T t : Compound.this ) {
//                add( t );
//            }
//        }};
//    }
//

//}
