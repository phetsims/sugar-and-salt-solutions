//  Copyright 2002-2014, University of Colorado Boulder
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
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );


  /**
   * @param {Property<number>} waterVolume
   * @param {Property<number>} saturationPoint
   * @param {Property<number>} volumePerSolidMole
   * @param {Property<number>} gramsPerMole
   * @constructor
   */
  function SoluteModel( waterVolume, saturationPoint, volumePerSolidMole, gramsPerMole ) {
    var thisSoluteModel = this;
    thisSoluteModel.volumePerSolidMole = volumePerSolidMole;
    thisSoluteModel.gramsPerMole = gramsPerMole;

    //Salt moles and concentration
    thisSoluteModel.moles = new NumberProperty( 0.0 ); //The amount of the solute in moles

    //The amount of moles necessary to fully saturate the solution, past this,
    //the solute will start to precipitate.
    thisSoluteModel.saturationPointMoles = waterVolume.times( saturationPoint );

    //The amount that is dissolved is solution
    thisSoluteModel.molesDissolved = new DerivedProperty( [ thisSoluteModel.moles, thisSoluteModel.saturationPointMoles ],
      function( molesValue, saturationPointMolesValue ) {
        return Math.min( molesValue, saturationPointMolesValue );
      }
    );

    //The amount that precipitated (solidified)
    thisSoluteModel.molesPrecipitated = new DerivedProperty( [thisSoluteModel.moles, thisSoluteModel.molesDissolved],
      function( molesValue, molesDissolvedValue ) {
        return Math.max( molesValue - molesDissolvedValue, 0 );
      } );

    //The volume (in SI) of the amount of solid
    //Solid precipitate should push up the water level, so that every mole of
    //salt takes up 0.02699 L, and every mole of sugar takes up 0.2157 L
    thisSoluteModel.solidVolume = thisSoluteModel.molesPrecipitated.times( volumePerSolidMole );

    //The amount in grams
    thisSoluteModel.grams = thisSoluteModel.moles.times( gramsPerMole );

    //The molar mass, the mass (in grams) per mole
    thisSoluteModel.gramsPerMole = 0;

    //Volume in meters cubed per solid mole
    this.volumePerSolidMole = 0;
  }

  return inherit( Object, SoluteModel, {
  } );
} );
