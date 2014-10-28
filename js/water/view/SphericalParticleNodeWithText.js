// Copyright 2002-2012, University of Colorado
/**
 * For water molecules, optionally show the partial charge on each atom
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetFont = require( 'edu.colorado.phet.common.phetcommon.view.util.PhetFont' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var SphericalParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SphericalParticleNode' );
  var WaterMolecule = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterMolecule' );
  var PText = require( 'edu.umd.cs.piccolo.nodes.PText' );

//Text symbol to show for the partial charge delta
  var DELTA = 'δ';
//The default "-" sign on Windows is too short, the team requested to use a longer symbol, so I switched to the unicode figure dash
//As described on this page: http://www.fileformat.info/info/unicode/char/2012/index.htm
//The unicode figure dash also has the benefit that it looks further away from the delta symbol
//These symbols are not translatable
  var MINUS = "‒";
  var PLUS = "+";

  function SphericalParticleNodeWithText( transform, particle, showChargeColor, showWaterCharge ) {
    SphericalParticleNode.call( this, transform, particle, showChargeColor );
    //Add the text, which is shown if the user selected "show water charges"
    var text = particle.getPartialChargeDisplayValue() > 0 ? DELTA + PLUS : particle.getPartialChargeDisplayValue() < 0 ? DELTA + MINUS : "";
    addChild( new PText( text ).withAnonymousClassBody( {
      initializer: function() {
        showWaterCharge.addObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( showPartialCharge ) {
            setVisible( showPartialCharge );
          }
        } ) );
        //Symbols for H partial charges about 1/2 the size of the O partial charges
        setFont( new PhetFont( particle instanceof WaterMolecule.Hydrogen ? 10 : 18 ) );
        //Center on the particle
        particle.addPositionObserver( new VoidFunction1().withAnonymousClassBody( {
          apply: function( immutableVector2D ) {
            setOffset( transform.modelToView( particle.getPosition() ).minus( getFullBounds().getWidth() / 2, getFullBounds().getHeight() / 2 ).toPoint2D() );
          }
        } ) );
      }
    } ) );
  }

  return inherit( SphericalParticleNode, SphericalParticleNodeWithText, {
    },
//statics
    {
      DELTA: DELTA,
      MINUS: MINUS,
      PLUS: PLUS
    } );
} );

