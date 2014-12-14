// Copyright 2002-20144, University of Colorado Boulder

/**
 * Draws the graphical representation of  salt and sugar crystals directly to canvas for performance.
 * Used for drawing crystals that fall out of the shaker
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Color = require( 'SCENERY/util/Color' );

  //constants
  var SALT_COLOR = new Color( 255, 255, 255 );
  var SUGAR_COLOR = new Color( 255, 255, 255 );


  /**
   * @param { MacroModel} modelElement
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function CrystalMakerCanvasNode( modelElement, modelViewTransform, canvasBounds ) {

    var thisNode = this;
    thisNode.modelElement = modelElement;
    thisNode.modelViewTransform = modelViewTransform;
    CanvasNode.call( thisNode, { pickable: false, canvasBounds: canvasBounds } );
    modelElement.registerListChangedCallback( function() {
      thisNode.invalidatePaint();
    } );
  }

  /**
   *
   * @param wrapper
   * @param {ObservableArray<MacroCrystal>} crystals // TODO change to normal array Ashraf
   * @param {number} size
   * @param {Color} color
   */
  function drawCrystals( wrapper, modelViewTransform, crystals, size, color ) {

    var context = wrapper.context;
    var numberOfCrystals = crystals.length;

    //Use a scaled cartoon size for the grains, since actual grain sizes would be much to large
    var cartoonSize = size / 5 * 2;

    if ( numberOfCrystals > 0 ) {
      wrapper.setFillStyle( color );
      context.beginPath();
    }
    // draw into one big path
    for ( var i = 0; i < numberOfCrystals; i++ ) {
      var crystal = crystals.get( i );
      var viewPosition = modelViewTransform.modelToViewPosition( crystal.position.get() );
      var x = viewPosition.x;
      var y = viewPosition.y;
      context.rect( x - cartoonSize / 2, y - cartoonSize / 2, cartoonSize, cartoonSize );
      context.closePath();
    }

    // fill and stroke the entire path
    if ( numberOfCrystals > 0 ) {
      context.fill();
    }

  }

  return inherit( CanvasNode, CrystalMakerCanvasNode, {

    /**
     * @override
     * @param {CanvasContextWrapper} wrapper
     */
    paintCanvas: function( wrapper ) {

      var sugarCrystals = this.modelElement.sugarList;
      var saltCrystals = this.modelElement.saltList;

      if ( sugarCrystals.length > 0 ) {
        drawCrystals( wrapper, this.modelViewTransform, sugarCrystals,
          this.modelViewTransform.modelToViewDeltaX( sugarCrystals.get( 0 ).length ), SUGAR_COLOR );
      }

      if ( saltCrystals.length > 0 ) {
        drawCrystals( wrapper, this.modelViewTransform, saltCrystals,
          this.modelViewTransform.modelToViewDeltaX( saltCrystals.get( 0 ).length ), SALT_COLOR );
      }

    }

  } );
} );
