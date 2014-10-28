// Copyright 2002-2012, University of Colorado
/**
 * A compound represents 0 or more (usually 1 or more) constituents which can be put into solution.  It may be constructed from a lattice.
 * The type is generic since some compounds such as NaCl are made of SphericalParticles while others such as Sucrose are made from molecules with their own substructure
 * Adding the type parameter at this level makes it so we don't have as many casts when acquiring components during dissolve or iteration processes.
 * When a compound has 0 constituents, it should be removed from the model.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var Rectangle = require( 'KITE/Rectangle' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Iterator = require( 'java.util.Iterator' );
  var Vector2 = require( 'DOT/Vector2' );
  var Option = require( 'edu.colorado.phet.common.phetcommon.util.Option' );
  var None = require( 'edu.colorado.phet.common.phetcommon.util.Option.None' );
  var Some = require( 'edu.colorado.phet.common.phetcommon.util.Option.Some' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );

  function Compound( position, angle ) {
    //Members in the compound
    this.constituents = new ItemList();
    //The time the lattice entered the water, if any

    //private
    this.underwaterTime = new None();
    //Put the vectors at the same random angle so all compounds don't come out at the same angle

    //private
    this.angle;
    Particle.call( this, position );
    this.angle = angle;
  }

  return inherit( Particle, Compound, {
    getAngle: function() {
      return angle;
    },
//Set the position of the compound, and update the location of all constituents
    setPosition: function( location ) {
      super.setPosition( location );
      updateConstituentLocations();
    },
//Update all constituents with their correct absolute location based on the crystal location and their relative location within the crystal
    updateConstituentLocations: function() {
      for ( var constituent in constituents ) {
        updateConstituentLocation( constituent );
      }
    },
//Update the constituent with its correct absolute location based on the crystal location and its relative location within the crystal, and the crystal's angle

    //private
    updateConstituentLocation: function( constituent ) {
      constituent.particle.setPosition( getPosition().plus( constituent.relativePosition.getRotatedInstance( angle ) ) );
    },
//The shape of a lattice is the combined area of its constituents, using bounding rectangles to improve performance
    getShape: function() {
      //If reduced to zero constituents, should be removed from the model before this is called otherwise will cause ArrayIndexOutOfBoundsException
      var bounds2D = constituents.get( 0 ).particle.getShape().getBounds2D();
      var rect = new Rectangle.Number( bounds2D.getX(), bounds2D.getY(), bounds2D.getWidth(), bounds2D.getHeight() );
      for ( var constituent in constituents ) {
        rect = rect.createUnion( constituent.particle.getShape().getBounds2D() );
      }
      return rect;
    },
//Iterate over the particles rather than constituents to make client code read easier, since it is more common to iterate over particles than constituents (which also keep track of relative location)
//To iterate over constituents, you can use getConstituent(int)
    iterator: function() {
      return [].withAnonymousClassBody( {
        initializer: function() {
          for ( var constituent in constituents ) {
            add( constituent.particle );
          }
        }
      } ).iterator();
    },
    isUnderwaterTimeRecorded: function() {
      return underwaterTime.isSome();
    },
    setUnderwater: function( time ) {
      this.underwaterTime = new Some( time );
    },
    getUnderWaterTime: function() {
      return underwaterTime.get();
    },
//Returns the number of constituents in the compound
    numberConstituents: function() {
      return constituents.size();
    },
//Gets the constituent at the specified index
    getConstituent: function( i ) {
      return constituents.get( i );
    },
//Removes the specified constituent from the compound
    removeConstituent: function( constituent ) {
      constituents.remove( constituent );
    },
    addConstituent: function( constituent ) {
      constituents.add( constituent );
      updateConstituentLocation( constituent );
    },
//Get all the spherical particles within this compound and its children recursively, so they can be displayed with PNodes
    getAllSphericalParticles: function() {
      var sphericalParticles = [];
      for ( var constituent in constituents ) {
        if ( constituent.particle instanceof SphericalParticle ) {
          sphericalParticles.add( constituent.particle );
        }
        else if ( constituent.particle instanceof Compound ) {
          var compound = constituent.particle;
          var subParticles = compound.getAllSphericalParticles();
          for ( var subParticle in subParticles ) {
            sphericalParticles.add( subParticle );
          }
        }
      }
      return sphericalParticles;
    },
//Count the number of constituents matching the specified type
    count: function( type ) {
      return constituents.count( type );
    },
//Determine whether the compound contains the specified particle, to ignore intra-molecular forces in WaterModel
    containsParticle: function( particle ) {
      return constituents.contains( new Function1().withAnonymousClassBody( {
        apply: function( constituent ) {
          return constituent.particle == particle;
        }
      } ) );
    },
//Sets the position and angle of the compound, and updates the location of all constituents
    setPositionAndAngle: function( modelPosition, angle ) {
      super.setPosition( modelPosition );
      this.angle = angle;
      updateConstituentLocations();
    },
//Returns an array list of the constituent particle instances, for use with varargs calls in WaterCanvas
    getConstituentParticleList: function() {
      return [].withAnonymousClassBody( {
        initializer: function() {
          for ( var t in Compound.this ) {
            add( t );
          }
        }
      } );
    },
//Get all constituents in the compound, defensive copy
    getConstituents: function() {
      return new ItemList( constituents );
    }
  } );
} );

