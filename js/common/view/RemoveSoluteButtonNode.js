// Copyright 2002-2011, University of Colorado
/**
 * Button that allows the user to remove a particular type of solute, only shown if the sim contains the solute.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ActionEvent = require( 'java.awt.event.ActionEvent' );
  var ActionListener = require( 'java.awt.event.ActionListener' );
  var Property = require( 'AXON/Property' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var TextButtonNode = require( 'edu.colorado.phet.common.piccolophet.nodes.TextButtonNode' );
  var BUTTON_COLOR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/BUTTON_COLOR' );//static
  var CONTROL_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/CONTROL_FONT' );//static

  function RemoveSoluteButtonNode( text, visible, remove ) {
    TextButtonNode.call( this, text, CONTROL_FONT );
    setBackground( BUTTON_COLOR );
    //Only show the button if there is solute to be removed
    visible.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( visible ) {
        setVisible( visible );
      }
    } ) );
    //When the user presses the button ,clear the solute
    addActionListener( new ActionListener().withAnonymousClassBody( {
      actionPerformed: function( e ) {
        remove.apply();
      }
    } ) );
  }

  return inherit( TextButtonNode, RemoveSoluteButtonNode, {
  } );
} );

