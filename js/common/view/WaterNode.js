//  Copyright 2002-2014, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var BeakerAndShakerConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/BeakerAndShakerConstants' );

  /**
   *
   * @param {ModelViewTransform2} transform
   * @param {Property<Shape>} waterShape
   * @constructor
   */
  function WaterNode( transform, waterShape ) {
    var thisNode = this;
    Path.call( thisNode, transform.modelToViewShape( waterShape ), {fill: BeakerAndShakerConstants.WATER_COLOR} );

    waterShape.link( function( newWaterShape ) {
      thisNode.setShape( transform.modelToViewShape( waterShape ) );
    } );

  }

  return inherit( Path, WaterNode, {

  } );

} );
