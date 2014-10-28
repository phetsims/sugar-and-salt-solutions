// Copyright 2002-2012, University of Colorado
/**
 * This crystal for sugar updates the positions of the molecules to ensure they move together
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var SugarAndSaltSolutionsApplication = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsApplication' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Formula' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var nanometersToMeters = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Units/nanometersToMeters' );//static

  function GlucoseCrystal( position, angle ) {
    //Glucose is about half as big as sucrose and hence should be half as far away on the lattice
    Crystal.call( this, Formula.GLUCOSE, position, //Spacing between adjacent sucrose molecules, in meters
        nanometersToMeters( 0.5 ) * SugarAndSaltSolutionsApplication.sizeScale.get() / 2, angle );
  }

  return inherit( Crystal, GlucoseCrystal, {
//Create a new Glucose to be added to the crystal
    createPartner: function( original ) {
      return new Glucose();
    },
//Create a single Glucose molecule to begin the crystal
    createConstituentParticle: function( type ) {
      return new Glucose();
    }
  } );
} );

