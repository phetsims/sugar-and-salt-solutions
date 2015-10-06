// Copyright 2002-2014, University of Colorado Boulder

/**
 * Sugar dispenser which can be rotated to pour out an endless supply of sugar.
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
  var Property = require( 'AXON/Property' );

  //images
  var SUGAR_OPEN = require( 'image!SUGAR_AND_SALT_SOLUTIONS/sugar_open.png' );
  var SUGAR_CLOSED = require( 'image!SUGAR_AND_SALT_SOLUTIONS/sugar_closed.png' );
  var SUGAR_EMPTY_OPEN = require( 'image!SUGAR_AND_SALT_SOLUTIONS/sugar_empty_open.png' );
  var SUGAR_EMPTY_CLOSED = require( 'image!SUGAR_AND_SALT_SOLUTIONS/sugar_empty_closed.png' );
  var SUGAR_MICRO_OPEN = require( 'image!SUGAR_AND_SALT_SOLUTIONS/sugar_empty_open.png' );
  var SUGAR_MICRO_CLOSED = require( 'image!SUGAR_AND_SALT_SOLUTIONS/sugar_empty_closed.png' );

  //constants
  var openFull = new Image( SUGAR_OPEN );
  var closedFull = new Image( SUGAR_CLOSED );
  var openEmpty = new Image( SUGAR_EMPTY_OPEN );
  var closedEmpty = new Image( SUGAR_EMPTY_CLOSED );
  var openMicro = new Image( SUGAR_MICRO_OPEN );
  var closedMicro = new Image( SUGAR_MICRO_CLOSED );

  //static initialization
  openFull.scale( 250 / openFull.getImageHeight() );
  closedFull.scale( 250 / closedFull.getImageHeight() );
  openEmpty.scale( 250 / openEmpty.getImageHeight() );
  closedEmpty.scale( 250 / closedEmpty.getImageHeight() );
  openMicro.scale( 250 / openMicro.getImageHeight() );
  closedMicro.scale( 250 / closedMicro.getImageHeight() );

  /**
   * @param modelViewTransform
   * @param {SugarDispenser} model
   * @param {boolean} micro //This flag indicates whether it is the micro or macro tab since different images are used
   * depending on the tab
   * @param {Bounds2} dragConstraint
   * @constructor
   */
  function SugarDispenserNode( modelViewTransform, model, micro, dragConstraint ) {
    var thisNode = this;
    DispenserNode.call( thisNode, modelViewTransform, model, dragConstraint );

    // Hide the sugar dispenser if it is not enabled (selected by the user)
    model.enabled.link( function( enabled ) {
      thisNode.visible = enabled;
    } );

    //Choose the image based on the angle.  If it is tipped sideways the opening should flip open.
    //Also update the image when the the dispenser opens/closes and empties/fills.
    Property.multilink( [ model.open, model.moreAllowed ], function() {
      var open = model.open.get();
      var allowed = model.moreAllowed.get();

      thisNode.imageNode.removeAllChildren();
      thisNode.imageNode.addChild( micro ? ( open ? openMicro : closedMicro )
          : ( open && allowed ? openFull :
              open && !allowed ? openEmpty :
              !open && allowed ? closedFull :
              closedEmpty )
      );
      thisNode.imageNode.addChild( thisNode.textLabel );
    } );
    //Have to update the transform once after the image size changes (since it goes from null to non-null) in
    // the auto-callback above
    DispenserNode.prototype.updateTransform.call( this );

  }

  return inherit( DispenserNode, SugarDispenserNode );
} );

// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.common.view;
//
//import java.awt.geom.Point2D;
//import java.awt.image.BufferedImage;
//
//import edu.colorado.phet.common.phetcommon.util.RichSimpleObserver;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SugarAndSaltSolutionModel;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SugarDispenser;
//
//import static edu.colorado.phet.common.phetcommon.view.util.BufferedImageUtils.multiScaleToHeight;
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsResources.Images.*;
//
///**
// * Sugar dispenser which can be rotated to pour out an endless supply of sugar.
// *
// * @author Sam Reid
// */
//public class SugarDispenserNode<T extends SugarAndSaltSolutionModel> extends DispenserNode<T, SugarDispenser<T>> {
//
//    private static final BufferedImage openFull = multiScaleToHeight( SUGAR_OPEN, 250 );
//    private static final BufferedImage closedFull = multiScaleToHeight( SUGAR_CLOSED, 250 );
//
//    private static final BufferedImage openEmpty = multiScaleToHeight( SUGAR_EMPTY_OPEN, 250 );
//    private static final BufferedImage closedEmpty = multiScaleToHeight( SUGAR_EMPTY_CLOSED, 250 );
//
//    private static final BufferedImage openMicro = multiScaleToHeight( SUGAR_MICRO_OPEN, 250 );
//    private static final BufferedImage closedMicro = multiScaleToHeight( SUGAR_MICRO_CLOSED, 250 );
//
//    public SugarDispenserNode( final ModelViewTransform transform, final SugarDispenser<T> model,
//
//                               //This flag indicates whether it is the micro or macro tab since different images are used depending on the tab
//                               final boolean micro,
//
//                               Function1<Point2D, Point2D> dragConstraint ) {
//        super( transform, model, dragConstraint );
//
//        //Hide the sugar dispenser if it is not enabled (selected by the user)
//        model.enabled.addObserver( new VoidFunction1<Boolean>() {
//            public void apply( Boolean enabled ) {
//                setVisible( enabled );
//            }
//        } );
//
//        //Choose the image based on the angle.  If it is tipped sideways the opening should flip open.
//        //Also update the image when the the dispenser opens/closes and empties/fills.
//        new RichSimpleObserver() {
//            @Override public void update() {
//                boolean open = model.open.get();
//                boolean allowed = model.moreAllowed.get();
//                imageNode.setImage(
//                        micro ? ( open ?
//                                  openMicro :
//                                  closedMicro )
//                              : ( open && allowed ? openFull :
//                                  open && !allowed ? openEmpty :
//                                  !open && allowed ? closedFull :
//                                  closedEmpty )
//                );
//            }
//        }.observe( model.open, model.moreAllowed );
//
//        //Have to update the transform once after the image size changes (since it goes from null to non-null) in the auto-callback above
//        updateTransform();
//    }
//}
