// Copyright 2002-2011, University of Colorado
/**
 * Creates a C12H22O11 label to be shown on top of each sucrose molecule (even if there are many in a crystal), used in CompoundListNode
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Option = require( 'edu.colorado.phet.common.phetcommon.util.Option' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var PhetFont = require( 'edu.colorado.phet.common.phetcommon.view.util.PhetFont' );
  var HTMLNode = require( 'edu.colorado.phet.common.piccolophet.nodes.HTMLNode' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/Sucrose' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PImage = require( 'edu.umd.cs.piccolo.nodes.PImage' );

  var FONT = new PhetFont( 19, true );
//All sucrose molecules have the same label, so ignore the argument to the function1
  function SucroseLabel() {
    Some.call( this, new Function1().withAnonymousClassBody( {
      apply: function( sucrose ) {
        return new PImage( new HTMLNode( "C<sub>12</sub>H<sub>22</sub>O<sub>11</sub>" ).withAnonymousClassBody( {
          initializer: function() {
            setFont( FONT );
          }
        } ).toImage() );
      }
    } ) );
  }

  return inherit( Some, SucroseLabel, {
    },
//statics
    {
      FONT: FONT
    } );
} );

