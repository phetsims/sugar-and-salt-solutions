// Copyright 2002-2011, University of Colorado
/**
 * Creates a label to be shown on top of each salt ion (such as Cl- or Na+), used in CompoundListNode
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
  var SaltIon = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/SaltIon' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PImage = require( 'edu.umd.cs.piccolo.nodes.PImage' );

  var FONT = new PhetFont( 28, true );

  function SaltIonLabel() {
    Some.call( this, new Function1().withAnonymousClassBody( {
      apply: function( ion ) {
        //Convert to image for improved performance
        return new PImage( new HTMLNode( ion.getName() ).withAnonymousClassBody( {
          initializer: function() {
            setFont( FONT );
          }
        } ).toImage() );
      }
    } ) );
  }

  return inherit( Some, SaltIonLabel, {
    },
//statics
    {
      FONT: FONT
    } );
} );

