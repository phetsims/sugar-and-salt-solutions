/**
 * Gives colors for objects (including background) in the sugar and salt sim.  This allows the user to configure colors to use against a dark background
 * and models the color to switch to when the background is white.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var CompositeProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.CompositeProperty' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );

  function ColorSet( color, whiteBackground, colorForWhiteBackground ) {
    //The background color selected by the user, may not be the displayed color based on whether 'white background' is selected
    this.selectedColor;
    //The background color to show, which accounts for the whiteBackground flag
    this.color;
    this.selectedColor = new Property( color );
    this.color = new CompositeProperty( new Function0().withAnonymousClassBody( {
      apply: function() {
        return whiteBackground.get() ? colorForWhiteBackground : selectedColor.get();
      }
    } ), whiteBackground, selectedColor );
  }

  return inherit( Object, ColorSet, {
  } );
} );

