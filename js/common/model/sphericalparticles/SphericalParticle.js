// Copyright 2002-2014, University of Colorado Boulder

/**
 * This particle represents a single indivisible spherical particle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Units = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Units' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Particle' );
  var SugarAndSaltSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSharedProperties' );


  /**
   * @param options ( {number} radius, {Vector2} position, {Color} color, {number} charge, {Color} chargeColor) )
   * refer the constructor signature in the table given in the design doc and to-do doc,
   * @constructor
   */
  function SphericalParticle( options ) {
    if ( !options.position ) { //If position is not explicitly given, consider the radius to be in PM, inferred from Java Code
      options.radius = Units.picometersToMeters( options.radius ) * SugarAndSaltSharedProperties.sizeScale.get();
      options.position = Vector2.ZERO;
    }
    Particle.call( this, options.position );

    this.radius = options.radius;
    this.color = options.atomColor; //Color corresponding to the identity of the atom
    this.charge = options.charge; //The charge of the atom
    this.chargeColor = options.chargeColor;  //Color for the charge of the atom, red = positive, yellow = neutral, blue = negative

  }

  return inherit( Particle, SphericalParticle, {
    /**
     * @Override
     * @return {Shape}
     */
    getShape: function() {
      return  new Shape().ellipse( this.getPosition().getX(), this.getPosition().getY(), this.radius, this.radius );
    },
    getCharge: function() {
      return this.charge;
    },
    /**
     * Get the value to use for showing partial charge.  Necessary to support showing a subset of particle
     * charges for sucrose: http://www.chemistryland.com/CHM130W/LabHelp/Experiment10/Exp10.html
     * @return {number}
     */
    getPartialChargeDisplayValue: function() {
      return this.getCharge();
    }
  } );

} );