// Copyright 2002-2011, University of Colorado
/**
 * Salt dispenser which can be rotated to pour out salt, used in macro and micro tab.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var BufferedImage = require( 'java.awt.image.BufferedImage' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var SaltShaker = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SaltShaker' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var multiScaleToHeight = require( 'edu.colorado.phet.common.phetcommon.view.util.BufferedImageUtils.multiScaleToHeight' );//static
  var Images = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Images' );//static ///*

  function SaltShakerNode( transform, model, //This flag indicates whether it is the micro or macro tab since different images are used depending on the tab
                           micro, constraint ) {
    DispenserNode.call( this, transform, model, constraint );
    //Create images to use in each scenario
    var fullImage = multiScaleToHeight( micro ? SALT_MICRO : SALT_FULL, 200 );
    var emptyImage = multiScaleToHeight( micro ? SALT_MICRO : SALT_EMPTY, 200 );
    //Hide the sugar dispenser if it is not enabled (selected by the user)
    model.enabled.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( enabled ) {
        setVisible( enabled );
      }
    } ) );
    //Switch between the empty and full images based on whether the user is allowed to add more salt
    model.moreAllowed.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( moreAllowed ) {
        imageNode.setImage( moreAllowed ? fullImage : emptyImage );
      }
    } ) );
    //Have to update the transform once after the image size changes (since it goes from null to non-null) in the auto-callback above
    updateTransform();
  }

  return inherit( DispenserNode, SaltShakerNode, {
  } );
} );

