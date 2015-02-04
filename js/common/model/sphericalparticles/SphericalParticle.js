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
      options.position = new Vector2();
    }
    Particle.call( this, options.position );

    this.radius = options.radius;
    this.color = options.atomColor; //Color corresponding to the identity of the atom
    this.charge = options.charge; //The charge of the atom
    this.chargeColor = options.chargeColor;  //Color for the charge of the atom, red = positive, yellow = neutral, blue = negative


    //On Every getShape and getShapeBounds call, spherical Particle creates a new Shape Instance.
    //The prev Values for x,y and radius help us to see if new instance needs to be created or to return a old cached instance
    //introduced for improving performance
    this.shape = Shape.circle( this.getPosition().x, this.getPosition().y, this.radius );
    this.prevPositionX = this.getPosition().x;
    this.prevPositionY = this.getPosition().y;
    this.prevRadius = this.radius;

    this.shapeBounds = this.shape.bounds;

  }

  return inherit( Particle, SphericalParticle, {
    /**
     * @Override
     * @return {Shape}
     */
    getShape: function() {
      if ( this.isDirty() ) {
        this.reCreateShape();
      }
      return this.shape;
    },

    getShapeBounds: function() {
      if ( this.isDirty() ) {
        this.reCreateShape();
      }
      return this.shapeBounds;
    },

    /**
     * @private
     * Helper method to create a new ShapeInstance and its bound when they become dirty
     */
    reCreateShape: function() {
      this.shape = Shape.circle( this.getPosition().x, this.getPosition().y, this.radius );
      this.shapeBounds = this.shape.bounds;
      this.updatePrevValues();
    },


    /**
     * @private
     * On Every getShape and getShapeBounds call, spherical Particle creates a new Shape Instance.
     * This method is introduced to check if a new Shape or bounds needs to be created or to return a cached instance
     * @returns {boolean}
     */
    isDirty: function() {
      if ( this.prevPositionX === this.getPosition().x && this.prevPositionY === this.getPosition().y && this.prevRadius === this.radius ) {
        return false;
      }
      return true;
    },

    /**
     * @private
     * helper method to synchronize old values for dirty checking
     */
    updatePrevValues: function() {
      this.prevPositionX = this.getPosition().x;
      this.prevPositionY = this.getPosition().y;
      this.prevRadius = this.radius;
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