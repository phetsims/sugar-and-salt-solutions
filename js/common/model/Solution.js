// Copyright 2014-2018, University of Colorado Boulder
/**
 *  The fluid combination of water and dissolved solutes, sitting on top of any precipitated solid.
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {Property.<number>} waterVolume
   * @param {Beaker} beaker
   * @constructor
   */
  function Solution( waterVolume, beaker ) {

    //To simplify the model and make it less confusing for students (since adding salt could change sugar concentration),
    //we have switched back to using just the water volume for concentration computations
    //To add to the volume based on dissolved solute volume, use something like this line:
    //this.volume = waterVolume.plus( dissolvedSaltVolume, dissolvedSugarVolume );

    this.volume = waterVolume; //Volume of the solution (water plus dissolved solutes)

    //Get the shape this water takes in its containing beaker
    this.shape = new DerivedProperty( [ this.volume ], function( volume ) {
      //Assumes the beaker is rectangular
      return beaker.getWaterShape( 0, volume );
    } );

  }

  sugarAndSaltSolutions.register( 'Solution', Solution );

  return inherit( Object, Solution, {} );

} );
