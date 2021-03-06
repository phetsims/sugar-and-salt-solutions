// Copyright 2014-2018, University of Colorado Boulder

/**
 * Free oxygen atoms have a negative charge
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Oxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Oxygen' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @constructor
   */
  function FreeOxygen() {
    Oxygen.call( this, {
      chargeColor: Color.BLUE
    } );
  }

  sugarAndSaltSolutions.register( 'FreeOxygen', FreeOxygen );

  return inherit( Oxygen, FreeOxygen, {} );

} );