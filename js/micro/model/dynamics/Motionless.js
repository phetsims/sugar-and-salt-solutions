// Copyright 2014-2018, University of Colorado Boulder

/**
 * Motion strategy that doesn't move the particle at all.
 * Used in composites such as sucrose crystals, since the individual atoms shouldn't move independently
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IUpdateStrategy = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/IUpdateStrategy' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @constructor
   */
  function Motionless() {

  }

  sugarAndSaltSolutions.register( 'Motionless', Motionless );
  return inherit( IUpdateStrategy, Motionless, {

    /**
     *
     * @param {Particle} particle
     * @param {number} dt
     */
    stepInTime: function( particle, dt ) {

    }

  } );

} );



