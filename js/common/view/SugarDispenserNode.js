// Copyright 2002-2011, University of Colorado
/**
 * Sugar dispenser which can be rotated to pour out an endless supply of sugar.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var BufferedImage = require( 'java.awt.image.BufferedImage' );
  var RichSimpleObserver = require( 'edu.colorado.phet.common.phetcommon.util.RichSimpleObserver' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var SugarDispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarDispenser' );
  var multiScaleToHeight = require( 'edu.colorado.phet.common.phetcommon.view.util.BufferedImageUtils.multiScaleToHeight' );//static
  var Images = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Images' );//static ///*


  //private
  var openFull = multiScaleToHeight( SUGAR_OPEN, 250 );

  //private
  var closedFull = multiScaleToHeight( SUGAR_CLOSED, 250 );

  //private
  var openEmpty = multiScaleToHeight( SUGAR_EMPTY_OPEN, 250 );

  //private
  var closedEmpty = multiScaleToHeight( SUGAR_EMPTY_CLOSED, 250 );

  //private
  var openMicro = multiScaleToHeight( SUGAR_MICRO_OPEN, 250 );

  //private
  var closedMicro = multiScaleToHeight( SUGAR_MICRO_CLOSED, 250 );

  function SugarDispenserNode( transform, model, //This flag indicates whether it is the micro or macro tab since different images are used depending on the tab
                               micro, dragConstraint ) {
    DispenserNode.call( this, transform, model, dragConstraint );
    //Hide the sugar dispenser if it is not enabled (selected by the user)
    model.enabled.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( enabled ) {
        setVisible( enabled );
      }
    } ) );
    //Also update the image when the the dispenser opens/closes and empties/fills.
    new RichSimpleObserver().withAnonymousClassBody( {
      update: function() {
        var open = model.open.get();
        var allowed = model.moreAllowed.get();
        imageNode.setImage( micro ? (open ? openMicro : closedMicro) : (open && allowed ? openFull : open && !allowed ? openEmpty : !open && allowed ? closedFull : closedEmpty) );
      }
    } ).observe( model.open, model.moreAllowed );
    //Have to update the transform once after the image size changes (since it goes from null to non-null) in the auto-callback above
    updateTransform();
  }

  return inherit( DispenserNode, SugarDispenserNode, {
  } );
} );

