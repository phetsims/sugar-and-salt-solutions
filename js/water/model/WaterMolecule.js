// Copyright 2002-2012, University of Colorado
/**
 * Water molecule: H2O for use in the water model.  Units of this compound are in meters, and the values can get updated by Box2D update steps by Box2DAdapter
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Random = require( 'java.util.Random' );
  var Vector2 = require( 'DOT/Vector2' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Compound' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var createPolar = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.createPolar' );//static

  var random = new Random();

  // static class: Hydrogen
  var Hydrogen =
//Provided here as a separate class so that the creation above is as simple as new Hydrogen() and no code is duplicated in the constructor invocations
    define( function( require ) {
      function Hydrogen() {
        //See this table for the charge, using TIP3P model: http://en.wikipedia.org/wiki/Water_model
        Hydrogen.call( this, POSITIVE_COLOR, +0.417 );
      }

      return inherit( Hydrogen, Hydrogen, {
      } );
    } );
  ;
  // static class: Oxygen
  var Oxygen =
//Provided here as a separate class for uniformity with Hydrogen inner class
    define( function( require ) {
      function Oxygen() {
        //See this table for the charge, using TIP3P model: http://en.wikipedia.org/wiki/Water_model
        Oxygen.call( this, NEUTRAL_COLOR, -0.834 );
      }

      return inherit( Oxygen, Oxygen, {
      } );
    } );
  ;
//Auxiliary constructor that creates a water molecule with the oxygen at the origin and an angle of 0 radians
  function WaterMolecule() {
    this( ZERO, 0 );
  }

  function WaterMolecule( position, angle ) {
    Compound.call( this, position, angle );
    //Spacing should be given by the water model: http://en.wikipedia.org/wiki/Water_model, but we just pick one that looks good
    var spacing = (new SphericalParticle.FreeOxygen().radius + new SphericalParticle.Hydrogen().radius) * 0.5;
    var waterAngleRadians = Math.toRadians( 104.45 );
    var h1 = new Constituent( new Hydrogen(), createPolar( spacing, waterAngleRadians / 2 ) );
    var o = new Constituent( new Oxygen(), ZERO );
    var h2 = new Constituent( new Hydrogen(), createPolar( spacing, -waterAngleRadians / 2 ) );
    //Use different z-orderings to give make the water look as if it is at different 3d orientations
    var style = random.nextInt( 3 );
    if ( style == 0 ) {
      add( h1, o, h2 );
    }
    else if ( style == 1 ) {
      add( h1, h2, o );
    }
    else if ( style == 2 ) {
      add( h2, o, h1 );
    }
  }

  return inherit( Compound, WaterMolecule, {

    //private
    add: function( a, b, c ) {
      addConstituent( a );
      addConstituent( b );
      addConstituent( c );
    },
  } );
} );

