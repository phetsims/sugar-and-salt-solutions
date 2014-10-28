// Copyright 2002-2011, University of Colorado
/**
 * Displays the exact volume of the solution, as a text label inside the solution.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var Rectangle = require( 'KITE/Rectangle' );
  var MessageFormat = require( 'java.text.MessageFormat' );
  var Property = require( 'AXON/Property' );
  var RichSimpleObserver = require( 'edu.colorado.phet.common.phetcommon.util.RichSimpleObserver' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var HTMLNode = require( 'edu.colorado.phet.common.piccolophet.nodes.HTMLNode' );
  var Solution = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Solution' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PATTERN__LITERS_SOLUTION = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/PATTERN__LITERS_SOLUTION' );//static
  var PATTERN__LITERS_WATER = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/PATTERN__LITERS_WATER' );//static
  var CONTROL_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/CONTROL_FONT' );//static
  var INSET = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/INSET' );//static

  function VolumeIndicatorNode( transform, solution, visible, anySolutes, formatter ) {
    visible.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( visible ) {
        setVisible( visible );
      }
    } ) );
    addChild( new HTMLNode().withAnonymousClassBody( {
      initializer: function() {
        new RichSimpleObserver().withAnonymousClassBody( {
          update: function() {
            //Apply the context sensitive formatter (e.g., accounting for the module and whether on the side of beaker or continuous readout within the beaker)
            var formatted = formatter.apply( solution.volume.get() );
            //if there is no sugar or salt in the beaker, say 1.00L "water" instead of "solution"
            setHTML( MessageFormat.format( anySolutes.get() ? PATTERN__LITERS_SOLUTION : PATTERN__LITERS_WATER, formatted ) );
          }
        } ).observe( solution.volume, anySolutes );
        //Use a large font so it will be easy to read inside the water
        setFont( CONTROL_FONT );
      }
    } ) );
    //Update the location so it remains in the top left of the fluid
    solution.shape.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( shape ) {
        var waterViewBounds = transform.modelToView( shape ).getBounds2D();
        setOffset( waterViewBounds.getX() + INSET, waterViewBounds.getY() + INSET );
      }
    } ) );
  }

  return inherit( Node, VolumeIndicatorNode, {
  } );
} );

