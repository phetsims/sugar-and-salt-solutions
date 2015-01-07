//  Copyright 2002-2014, University of Colorado Boulder

/**
 * The drag handler for moving probe in ConductivityTester
 *
 *  @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Util = require( 'DOT/Util' );

  /**
   *
   * @param {Property<number>} probeYProperty
   * @param {Range} probeYRange
   * @constructor
   */
  function ProbeDragHandler( probeYProperty, probeYRange ) {
    var thisHandler = this;
    var probeHandlerOptions = {
      clickYOffset: 0,

      start: function( e ) {
        this.clickYOffset = e.currentTarget.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
      },

      drag: function( e ) {
        var y = e.currentTarget.globalToParentPoint( e.pointer.point ).y - this.clickYOffset;
        probeYProperty.value = Util.clamp( y, probeYRange.min, probeYRange.max );
      }
    };

    SimpleDragHandler.call( thisHandler, probeHandlerOptions );
  }

  return inherit( ProbeDragHandler, SimpleDragHandler );
} );