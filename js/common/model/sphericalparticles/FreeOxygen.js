// Copyright 2002-2014, University of Colorado Boulder

/**
 * Free oxygen atoms have a negative charge
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Oxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Oxygen' );
  var Color = require( 'SCENERY/util/Color' );

  /**
   *
   * @constructor
   */
  function FreeOxygen() {
    Oxygen.call( this, {
      chargeColor: Color.BLUE
    } );
  }

  return inherit( Oxygen, FreeOxygen, {

  } );

} );