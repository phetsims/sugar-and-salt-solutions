// Copyright 2002-2011, University of Colorado
/**
 * Node that contains one button to remove salt (if there is any salt) and another button for sugar.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var BeakerAndShakerCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas' );
  var RemoveSoluteButtonNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/RemoveSoluteButtonNode' );
  var MacroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroModel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var REMOVE_SALT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/REMOVE_SALT' );//static
  var REMOVE_SUGAR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/REMOVE_SUGAR' );//static

  function RemoveSoluteControlNode( model ) {
    //Button to remove salt, only shown if there is any salt
    var saltButton = new RemoveSoluteButtonNode( REMOVE_SALT, model.isAnySaltToRemove(), new VoidFunction0().withAnonymousClassBody( {
      apply: function() {
        model.removeSalt();
      }
    } ) );
    addChild( saltButton );
    //Button to remove sugar, only shown if there is any sugar
    var sugarButton = new RemoveSoluteButtonNode( REMOVE_SUGAR, model.isAnySugarToRemove(), new VoidFunction0().withAnonymousClassBody( {
      apply: function() {
        model.removeSugar();
      }
    } ) );
    addChild( sugarButton );
    //Put the buttons next to each other, leaving the origin at (0,0) so it can be positioned easily by the client
    sugarButton.setOffset( saltButton.getFullBounds().getMaxX() + BeakerAndShakerCanvas.INSET, 0 );
  }

  return inherit( Node, RemoveSoluteControlNode, {
  } );
} );

