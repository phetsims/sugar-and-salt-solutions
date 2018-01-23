// Copyright 2014-2017, University of Colorado Boulder

/**
 * //TODO this class appears to be misplaced in micro,should be in common/model package as common
 * // TODO classes make use of this class
 * Location in a crystal where a new atom could attach.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Constituent' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Particle' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {Vector2} relativePosition
   * @param {Shape} shape
   * @param {function} newInstance
   * @param {Vector2} absolutePosition
   * @constructor
   */
  function OpenSite( relativePosition, shape, newInstance, absolutePosition ) {
    Particle.call( this );

    //Position relative to the origin of the crystal
    this.relativePosition = relativePosition;

    //Absolute location for checking bounds against water bounds
    this.shape = shape;

    //@private
    this.newInstance = newInstance;

    //Absolute position in the model
    this.absolutePosition = absolutePosition;
  }

  sugarAndSaltSolutions.register( 'OpenSite', OpenSite );
  return inherit( Particle, OpenSite, {
    /**
     * @returns {Constituent}
     */
    toConstituent: function() {
      return new Constituent( this.newInstance(), this.relativePosition );
    },

    /**
     * This method checks against a  particle instance or its constructor function
     * @param {Particle | type} other
     * @returns {boolean}
     */
    matches: function( other ) {
      if ( other instanceof Particle ) {
        return this.newInstance() instanceof Particle;
      }
      //the argument is a Constructor function
      var type = other;
      return this.newInstance().constructor === type;
    }
  } );
} );
