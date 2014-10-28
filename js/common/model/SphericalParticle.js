// Copyright 2002-2012, University of Colorado
/**
 * This particle represents a single indivisible spherical particle.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Shape = require( 'java.awt.Shape' );
  var Ellipse2D = require( 'java.awt.geom.Ellipse2D' );
  var Vector2 = require( 'DOT/Vector2' );
  var SugarAndSaltSolutionsApplication = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsApplication' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var RED_COLORBLIND = require( 'edu.colorado.phet.common.phetcommon.view.PhetColorScheme.RED_COLORBLIND' );//static
  var picometersToMeters = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Units/picometersToMeters' );//static
  var Color = require( 'SCENERY/util/Color' );//static //.*

//Color to use for neutrally charged objects
  var NEUTRAL_COLOR = Color.yellow;
  var POSITIVE_COLOR = RED_COLORBLIND;
  var NEGATIVE_COLOR = Color.blue;

  // static class: Hydrogen
  var Hydrogen =
//These classes contains state information for particulars particles and ions and permit matching in MicroModel for particle counting.
    define( function( require ) {
      function Hydrogen() {
        this( SphericalParticle.NEUTRAL_COLOR, +1 );
      }

// Constructor for use by clients that need to support other partial charge models.
      function Hydrogen( chargeColor, charge ) {
        SphericalParticle.call( this, 37, chargeColor, white, charge );
      }

      return inherit( SphericalParticle, Hydrogen, {
      } );
    } );
  ;
  // static class: Carbon
  var Carbon =
    define( function( require ) {
      function Carbon() {
        SphericalParticle.call( this, 77, SphericalParticle.NEUTRAL_COLOR, gray, 0 );
      }

      return inherit( SphericalParticle, Carbon, {
      } );
    } );
  ;
  // static class: Nitrogen
  var Nitrogen =
    define( function( require ) {
      function Nitrogen() {
        SphericalParticle.call( this, 75, SphericalParticle.NEGATIVE_COLOR, blue, -1 );
      }

      return inherit( SphericalParticle, Nitrogen, {
      } );
    } );
  ;
  // static class: Oxygen
  var Oxygen =
//Abstract since oxygen ions and oxygen in sucrose/glucose must have different colors
    define( function( require ) {
      function Oxygen( chargeColor ) {
        this( chargeColor, -2 );
      }

// Constructor for use by clients that need to support other partial charge models.
      function Oxygen( chargeColor, charge ) {
        SphericalParticle.call( this, 73, chargeColor, RED_COLORBLIND, charge );
      }

      return inherit( SphericalParticle, Oxygen, {
      } );
    } );
  ;
  // static class: FreeOxygen
  var FreeOxygen =
//Free oxygen atoms have a negative charge
    define( function( require ) {
      function FreeOxygen() {
        Oxygen.call( this, Color.blue );
      }

      return inherit( Oxygen, FreeOxygen, {
      } );
    } );
  ;
  // static class: NeutralOxygen
  var NeutralOxygen =
//When participating in sucrose or glucose or other neutral crystals oxygen atoms should be shown as neutral
    define( function( require ) {
      function NeutralOxygen() {
        Oxygen.call( this, SphericalParticle.NEUTRAL_COLOR );
      }

      return inherit( Oxygen, NeutralOxygen, {
      } );
    } );
  ;
  // static class: Sodium
  var Sodium =
    define( function( require ) {
      function Sodium() {
        SphericalParticle.call( this, 102, SphericalParticle.POSITIVE_COLOR, magenta, +1 );
      }

      return inherit( SphericalParticle, Sodium, {
      } );
    } );
  ;
  // static class: Chloride
  var Chloride =
    define( function( require ) {
      function Chloride() {
        SphericalParticle.call( this, 181, SphericalParticle.NEGATIVE_COLOR, green, -1 );
      }

      return inherit( SphericalParticle, Chloride, {
      } );
    } );
  ;
  // static class: Calcium
  var Calcium =
    define( function( require ) {
      function Calcium() {
        //Calcium should be a dark green
        SphericalParticle.call( this, 100, SphericalParticle.POSITIVE_COLOR, new Color( 6, 98, 23 ), +1 );
      }

      return inherit( SphericalParticle, Calcium, {
      } );
    } );
  ;
//This constructor matches the table given in the design doc and to-do doc,
  function SphericalParticle( radiusInPM, chargeColor, atomColor, charge ) {
    this.radius;
    //Color corresponding to the identity of the atom
    this.color;
    //Color for the charge of the atom, red = positive, yellow = neutral, blue = negative
    this.chargeColor;
    //The charge of the atom

    //private
    this.charge;
    this( picometersToMeters( radiusInPM ) * SugarAndSaltSolutionsApplication.sizeScale.get(), ZERO, atomColor, charge, chargeColor );
  }

  function SphericalParticle( radius, position, color, charge ) {
    this.radius;
    //Color corresponding to the identity of the atom
    this.color;
    //Color for the charge of the atom, red = positive, yellow = neutral, blue = negative
    this.chargeColor;
    //The charge of the atom

    //private
    this.charge;
    this( radius, position, color, charge, null );
  }

  //private
  function SphericalParticle( radius, position, color, charge, chargeColor ) {
    this.radius;
    //Color corresponding to the identity of the atom
    this.color;
    //Color for the charge of the atom, red = positive, yellow = neutral, blue = negative
    this.chargeColor;
    //The charge of the atom

    //private
    this.charge;
    Particle.call( this, position );
    this.radius = radius;
    this.color = color;
    this.charge = charge;
    this.chargeColor = chargeColor;
  }

  return inherit( Particle, SphericalParticle, {
      getShape: function() {
        return new Ellipse2D.Number( getPosition().getX() - radius, getPosition().getY() - radius, radius * 2, radius * 2 );
      },
      getCharge: function() {
        return charge;
      },
//Get the value to use for showing partial charge.  Necessary to support showing a subset of particle charges for sucrose: http://www.chemistryland.com/CHM130W/LabHelp/Experiment10/Exp10.html
      getPartialChargeDisplayValue: function() {
        return getCharge();
      },
    },
//statics
    {
      NEUTRAL_COLOR: NEUTRAL_COLOR,
      POSITIVE_COLOR: POSITIVE_COLOR,
      NEGATIVE_COLOR: NEGATIVE_COLOR
    } );
} );

