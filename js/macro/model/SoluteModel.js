// Copyright 2014-2015, University of Colorado Boulder
/**
 * Model of the amount in moles, concentration, amount dissolved,
 * amount precipitated, for sugar and salt in the introductory (macro) tab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property<number>} waterVolume
   * @param {Property<number>} saturationPoint
   * @param {Property<number>} volumePerSolidMole
   * @param {Property<number>} gramsPerMole
   * @constructor
   */
  function SoluteModel( waterVolume, saturationPoint, volumePerSolidMole, gramsPerMole ) {
    var self = this;

    //Volume in meters cubed per solid mole
    self.volumePerSolidMole = volumePerSolidMole;

    //The molar mass, the mass (in grams) per mole
    self.gramsPerMole = gramsPerMole;

    //Salt moles and concentration
    self.moles = new Property( 0.0 ); //The amount of the solute in moles

    //The amount of moles necessary to fully saturate the solution, past this,
    //the solute will start to precipitate.
    self.saturationPointMoles = new DerivedProperty( [waterVolume], function( volume ) {
      return volume * saturationPoint;
    } );

    //The amount that is dissolved is solution
    self.molesDissolved = new DerivedProperty( [ self.moles, self.saturationPointMoles ],
      function( molesValue, saturationPointMolesValue ) {
        return Math.min( molesValue, saturationPointMolesValue );
      }
    );

    //The amount that precipitated (solidified)
    self.molesPrecipitated = new DerivedProperty( [self.moles, self.molesDissolved],
      function( molesValue, molesDissolvedValue ) {
        return Math.max( molesValue - molesDissolvedValue, 0 );
      } );

    //The volume (in SI) of the amount of solid
    //Solid precipitate should push up the water level, so that every mole of
    //salt takes up 0.02699 L, and every mole of sugar takes up 0.2157 L
    self.solidVolume = new DerivedProperty( [self.molesPrecipitated], function( molesPrecipitated ) {
      return molesPrecipitated * volumePerSolidMole;
    } );

    //The amount in grams
    self.grams = new DerivedProperty( [self.moles], function( moles ) {
      return moles * gramsPerMole;
    } );
  }

  return inherit( Object, SoluteModel, {
  } );
} );
