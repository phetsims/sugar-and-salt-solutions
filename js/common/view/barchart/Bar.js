// Copyright 2002-2011, University of Colorado
/**
 * This class represents the bars in the bar chart.  They grow upwards in the Y direction from a baseline offset of y=0.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Color = require( 'SCENERY/util/Color' );
  var DecimalFormat = require( 'java.text.DecimalFormat' );
  var MessageFormat = require( 'java.text.MessageFormat' );
  var Property = require( 'AXON/Property' );
  var Option = require( 'edu.colorado.phet.common.phetcommon.util.Option' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var HTMLNode = require( 'edu.colorado.phet.common.piccolophet.nodes.HTMLNode' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var ZeroOffsetNode = require( 'edu.colorado.phet.common.piccolophet.nodes.kit.ZeroOffsetNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PPath = require( 'edu.umd.cs.piccolo.nodes.PPath' );
  var PATTERN__MOLES_PER_LITER = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/PATTERN__MOLES_PER_LITER' );//static
  var PATTERN__MOLES_PER_LITER_MULTILINE = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/PATTERN__MOLES_PER_LITER_MULTILINE' );//static
  var CONTROL_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/CONTROL_FONT' );//static
  var isInfinite = require( 'java.lang.Number.isInfinite' );//static
  var isNaN = require( 'java.lang.Number.isNaN' );//static

  var WIDTH = 40;

  function Bar( color, caption, icon, value, showValue, verticalAxisScale, multiLineReadout ) {
    this.valueReadout;
    // Create and add the bar itself.
    var bar = new PhetPPath( new BasicStroke( 1.0
      ),
      Color.BLACK
    ).
      withAnonymousClassBody( {
        initializer: function() {
          color.addObserver( new VoidFunction1().withAnonymousClassBody( {
            apply: function( color ) {
              setPaint( color );
            }
          } ) );
        }
      } );
    addChild( bar );
    // Wire up the bar to change size based on the observable entity.
    value.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( value ) {
        var height = (value * verticalAxisScale);
        //Graphics problems occur if you let the bar go too high, so clamp it
        var maxBarHeight = 10000
        f;
        if ( height > maxBarHeight || isNaN( height ) || isInfinite( height ) ) {
          height = maxBarHeight;
        }
        bar.setPathToRectangle( 0, -height, WIDTH, height );
      }
    } ) );
    // Create and add the caption.
    var captionNode = new HTMLNode( caption ).withAnonymousClassBody( {
      initializer: function() {
        setFont( CONTROL_FONT );
        // Position so that it is centered under the bar.
        setOffset( WIDTH / 2 - getFullBoundsReference().width / 2, 0 );
      }
    } );
    addChild( captionNode );
    //If specified, show an icon below the caption (to save horizontal space)
    for ( var element in icon ) {
      addChild( new ZeroOffsetNode( element ).withAnonymousClassBody( {
        initializer: function() {
          setOffset( captionNode.getFullBounds().getCenterX() - getFullBounds().getWidth() / 2, captionNode.getFullBounds().getMaxY() );
        }
      } ) );
    }
    //Optionally show the readout of the exact value above the bar itself
    valueReadout = new HTMLNode().withAnonymousClassBody( {
      initializer: function() {
        setFont( CONTROL_FONT );
        value.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( molesPerMeterCubed ) {
            //See: http://wiki.answers.com/Q/How_many_metres_cubed_are_in_a_litre
            var litersPerCubicMeter = 1000;
            var molesPerLiter = molesPerMeterCubed / litersPerCubicMeter;
            //Use multiline in tabs with 3+ bars, otherwise readouts will overlap each other
            var value = new DecimalFormat( "0.00" ).format( molesPerLiter );
            setHTML( MessageFormat.format( multiLineReadout ? PATTERN__MOLES_PER_LITER_MULTILINE : PATTERN__MOLES_PER_LITER, value ) );
            //Show the label centered above the bar, even if bar is zero height
            setOffset( bar.getFullBounds().getCenterX() - getFullBounds().getWidth() / 2, bar.getFullBounds().getMinY() - getFullBounds().getHeight() );
          }
        } ) );
        //Only show the readout if the user has opted to do so
        showValue.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( showValue ) {
            setVisible( showValue );
          }
        } ) );
      }
    } );
    addChild( valueReadout );
  }

  return inherit( Node, Bar, {
    },
//statics
    {
      WIDTH: WIDTH
    } );
} );

