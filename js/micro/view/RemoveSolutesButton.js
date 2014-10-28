// Copyright 2002-2011, University of Colorado
/**
 * Button that removes all solutes from the beaker.  Reads "remove solute" if one solute type, "remove solutes" if two solute types
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var RemoveSoluteButtonNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/RemoveSoluteButtonNode' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );

  function RemoveSolutesButton( text, visible, model ) {
    RemoveSoluteButtonNode.call( this, text, visible, new VoidFunction0().withAnonymousClassBody( {
      apply: function() {
        model.clearSolutes();
      }
    } ) );
  }

  return inherit( RemoveSoluteButtonNode, RemoveSolutesButton, {
  } );
} );

