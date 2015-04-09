// Copyright 2002-2014, University of Colorado Boulder

/**
 * Salt dispenser which can be rotated to pour out salt, used in macro and micro tab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DispenserNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/DispenserNode' );
  var Image = require( 'SCENERY/nodes/Image' );


  // images
  var SALT_MICRO = require( 'image!SUGAR_AND_SALT_SOLUTIONS/salt_micro.png' );
  var SALT_EMPTY = require( 'image!SUGAR_AND_SALT_SOLUTIONS/salt_empty.png' );
  var SALT_FULL = require( 'image!SUGAR_AND_SALT_SOLUTIONS/salt_full.png' );

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {SaltShaker} model
   * @param {boolean} micro //This flag indicates whether it is the micro or macro tab since different images are used
   * depending on the tab
   * @param {Bounds2} constraint
   * @constructor
   */
  function SaltShakerNode( modelViewTransform, model, micro, constraint ) {
    var thisNode = this;
    DispenserNode.call( thisNode, modelViewTransform, model, constraint );

    //Create images to use in each scenario
    var fullImage = new Image( micro ? SALT_MICRO : SALT_FULL );
    //multiScaleToHeight
    fullImage.setScaleMagnitude( 180 / fullImage.getImageHeight() );

    var emptyImage = new Image( micro ? SALT_MICRO : SALT_EMPTY );
    //multiScaleToHeight
    emptyImage.setScaleMagnitude( 180 / emptyImage.getImageHeight() );

    //Hide the sugar dispenser if it is not enabled (selected by the user)
    model.enabled.link( function( enabled ) {
        thisNode.visible = enabled;
      }
    );

    //Switch between the empty and full images based on whether the user is allowed to add more salt
    model.moreAllowed.link( function( moreAllowed ) {
        thisNode.imageNode.removeAllChildren();
        thisNode.imageNode.addChild( moreAllowed ? fullImage : emptyImage );
        thisNode.imageNode.addChild( thisNode.textLabel );
      }
    );

    //Have to update the transform once after the image size changes (since it goes from null to non-null)
    //in the auto-callback above
    DispenserNode.prototype.updateTransform.call( this );
  }

  return inherit( DispenserNode, SaltShakerNode );

} );
