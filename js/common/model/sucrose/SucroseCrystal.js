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

  function SucroseCrystal( position, angle ) {
    //Also, scale everything by the model sizeScale, including distances between atoms
    Crystal.call( this, Formula.SUCROSE, position, //Spacing between adjacent sucrose molecules, in meters
        nanometersToMeters( 0.5 ) * SugarAndSaltSolutionsApplication.sizeScale.get(), angle );
  }

  return inherit( Crystal, SucroseCrystal, {
//Create a new Sucrose to be added to the crystal
    createPartner: function( original ) {
      return new Sucrose();
    },
//Create a single sucrose molecule to begin the crystal
    createConstituentParticle: function( type ) {
      return new Sucrose();
    }
  } );
} );

