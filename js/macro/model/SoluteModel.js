// Copyright 2002-2011, University of Colorado
/**
 * Model of the amount in moles, concentration, amount dissolved, amount precipitated, for sugar and salt in the introductory (macro) tab.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CompositeDoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.CompositeDoubleProperty' );
  var DoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty' );
  var Max = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.Max' );
  var Min = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.Min' );

  var VOLUME_PER_SOLID_MOLE_SALT = 0.02699 / 1000.0;

  function SoluteModel( waterVolume, saturationPoint, volumePerSolidMole, gramsPerMole ) {
    //The amount of the solute in moles
    this.moles;
    //The amount that precipitated (solidified)
    this.molesPrecipitated;
    //The amount that is dissolved is solution
    this.molesDissolved;
    //The amount of moles necessary to fully saturate the solution, past this, the solute will start to precipitate.
    this.saturationPointMoles;
    //The volume (in SI) of the amount of solid
    //Solid precipitate should push up the water level, so that every mole of salt takes up 0.02699 L, and every mole of sugar takes up 0.2157 L
    this.solidVolume;
    //The amount in grams
    this.grams;
    //The molar mass, the mass (in grams) per mole
    this.gramsPerMole;
    //Volume in meters cubed per solid mole
    this.volumePerSolidMole;
    this.volumePerSolidMole = volumePerSolidMole;
    this.gramsPerMole = gramsPerMole;
    //Salt moles and concentration
    moles = new DoubleProperty( 0.0 );
    saturationPointMoles = waterVolume.times( saturationPoint );
    molesDissolved = new Min( moles, saturationPointMoles );
    molesPrecipitated = new Max( moles.minus( molesDissolved ), 0.0 );
    solidVolume = molesPrecipitated.times( volumePerSolidMole );
    grams = moles.times( gramsPerMole );
  }

  return inherit( Object, SoluteModel, {
    },
//statics
    {
      VOLUME_PER_SOLID_MOLE_SALT: VOLUME_PER_SOLID_MOLE_SALT
    } );
} );

