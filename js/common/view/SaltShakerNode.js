//  Copyright 2002-2014, University of Colorado Boulder

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
  var Node = require( 'SCENERY/nodes/Node' );

  // images
  var saltMicroImage = require( 'image!SUGAR_AND_SALT_SOLUTIONS/salt_micro.png' );
  var saltEmptyImage = require( 'image!SUGAR_AND_SALT_SOLUTIONS/salt_empty.png' );
  var saltFullImage = require( 'image!SUGAR_AND_SALT_SOLUTIONS/salt_full.png' );

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {SugarAndSaltSolutionsModel} model
   * @param {boolean} micro //This flag indicates whether it is the micro or macro tab since different images are used
   * depending on the tab
   * @param {function} constraint
   * @constructor
   */
  function SaltShakerNode( modelViewTransform, model, micro, constraint ) {
    var thisNode = this;
    Node.call( thisNode );
    DispenserNode.call( thisNode, modelViewTransform, model, constraint );

    //Create images to use in each scenario
    var fullImage = micro ? saltMicroImage : saltFullImage;
    //multiScaleToHeight
    fullImage = fullImage.scale( 200 / saltMicroImage.getImageHeight() );

    var emptyImage = micro ? saltMicroImage : saltEmptyImage;
    //multiScaleToHeight
    emptyImage = emptyImage.scale( 200 / emptyImage.getImageHeight() );

    //Hide the sugar dispenser if it is not enabled (selected by the user)
    model.enabled.link( function( enabled ) {
        thisNode.visible = enabled;
      }
    );

    //Switch between the empty and full images based on whether the user is allowed to add more salt
    model.moreAllowed.link( function( moreAllowed ) {
        thisNode.imageNode.setImage( moreAllowed ? fullImage : emptyImage );
      }
    );

    //Have to update the transform once after the image size changes (since it goes from null to non-null)
    //in the auto-callback above
    DispenserNode.prototype.updateTransform.call( this );

  }

  return inherit( DispenserNode, SaltShakerNode );


} );


//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.view;
//
//import java.awt.geom.Point2D;
//import java.awt.image.BufferedImage;
//
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SaltShaker;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SugarAndSaltSolutionModel;
//
//import static edu.colorado.phet.common.phetcommon.view.util.BufferedImageUtils.multiScaleToHeight;
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Images.*;
//
///**
// * Salt dispenser which can be rotated to pour out salt, used in macro and micro tab.
// *
// * @author Sam Reid
// */
//public class SaltShakerNode<T extends SugarAndSaltSolutionModel> extends DispenserNode<T, SaltShaker<T>> {
//    public SaltShakerNode( final ModelViewTransform transform, final SaltShaker<T> model,
//
//                           //This flag indicates whether it is the micro or macro tab since different images are used depending on the tab
//                           boolean micro, Function1<Point2D, Point2D> constraint ) {
//        super( transform, model, constraint );
//
//        //Create images to use in each scenario
//        final BufferedImage fullImage = multiScaleToHeight( micro ? SALT_MICRO : SALT_FULL, 200 );
//        final BufferedImage emptyImage = multiScaleToHeight( micro ? SALT_MICRO : SALT_EMPTY, 200 );
//
//        //Hide the sugar dispenser if it is not enabled (selected by the user)
//        model.enabled.addObserver( new VoidFunction1<Boolean>() {
//            public void apply( Boolean enabled ) {
//                setVisible( enabled );
//            }
//        } );
//
//        //Switch between the empty and full images based on whether the user is allowed to add more salt
//        model.moreAllowed.addObserver( new VoidFunction1<Boolean>() {
//            public void apply( Boolean moreAllowed ) {
//                imageNode.setImage( moreAllowed ? fullImage : emptyImage );
//            }
//        } );
//
//        //Have to update the transform once after the image size changes (since it goes from null to non-null) in the auto-callback above
//        updateTransform();
//    }
//}
