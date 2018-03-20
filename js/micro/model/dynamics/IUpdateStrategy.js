// Copyright 2014-2018, University of Colorado Boulder

/**
 * Strategy pattern interface for updating particles as time passes, see UpdateStrategy.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @constructor
   */
  function IUpdateStrategy() {

  }

  sugarAndSaltSolutions.register( 'IUpdateStrategy', IUpdateStrategy );
  return inherit( Object, IUpdateStrategy, {

    /**
     *
     * @param {Particle} particle
     * @param {number} dt
     */
    stepInTime: function( particle, dt ) {
      throw new Error( 'stepInTime should be implemented in descendant classes.' );
    }

  } );

} );

