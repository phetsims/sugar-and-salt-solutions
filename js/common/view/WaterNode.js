// Copyright 2014-2017, University of Colorado Boulder

/**
 * Node that displays the water flowing out of a faucet, shown behind the faucet node so that
 * it doesn't need to match up perfectly
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  //modules
  var BeakerAndShakerConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/BeakerAndShakerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   *
   * @param {ModelViewTransform2} transform
   * @param {Property.<Shape>} waterShapeProperty
   * @constructor
   */
  function WaterNode( transform, waterShapeProperty ) {
    var self = this;
    Path.call( self, transform.modelToViewShape( waterShapeProperty.value ), { fill: BeakerAndShakerConstants.WATER_COLOR } );

    waterShapeProperty.link( function( newWaterShape ) {
      self.setShape( transform.modelToViewShape( newWaterShape ) );
    } );

  }

  sugarAndSaltSolutions.register( 'WaterNode', WaterNode );

  return inherit( Path, WaterNode, {} );

} );
