//  Copyright 2002-2014, University of Colorado Boulder
/**
 * The clock for this simulation.
 * The simulation time change (dt) on each clock tick is constant,
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );


  /**
   *
   * @param {number} framesPerSecond
   * @param eventCallBack // a single argument function receiving "elapsed time"
   * @constructor
   */
  function ConstantDtClock( framesPerSecond, eventCallBack ) {

    // The clock for this simulation.
    // The simulation time change (dt) on each clock tick is constant,
    var constantEventModel = new EventTimer.ConstantEventModel( framesPerSecond );
    this.eventTimer = new EventTimer( constantEventModel, function( timeElapsed ) {
      eventCallBack( timeElapsed );
    } );

  }

  return inherit( PropertySet, ConstantDtClock, {
    step: function( dt ) {
      // step one frame, assuming 60fps
      this.eventTimer.step( 1 / 60 );
    }
  } );
} );