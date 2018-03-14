// Copyright 2014-2017, University of Colorado Boulder

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
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

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

    var self = this;
    self.modelElement = modelElement;
    self.modelViewTransform = modelViewTransform;
    CanvasNode.call( self, { pickable: false, canvasBounds: canvasBounds } );
    modelElement.registerListChangedCallback( function() {
      self.invalidatePaint();
    } );
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   * @param {ModelViewTransform2} modelViewTransform
   * @param {ObservableArray<MacroCrystal>} crystals // TODO change to normal array Ashraf
   * @param {number} size
   * @param {Color} color
   */
  function drawCrystals( context, modelViewTransform, crystals, size, color ) {

    var numberOfCrystals = crystals.length;

    //Use a scaled cartoon size for the grains, since actual grain sizes would be much to large
    var cartoonSize = size / 5 * 2;

    if ( numberOfCrystals > 0 ) {
      context.fillStyle = color.getCanvasStyle();
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

  sugarAndSaltSolutions.register( 'CrystalMakerCanvasNode', CrystalMakerCanvasNode );

  return inherit( CanvasNode, CrystalMakerCanvasNode, {

    /**
     * @override
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {

      var sugarCrystals = this.modelElement.sugarList;
      var saltCrystals = this.modelElement.saltList;

      if ( sugarCrystals.length > 0 ) {
        var sugarCrystalModelSize = sugarCrystals.get( 0 ).length;
        drawCrystals( context, this.modelViewTransform, sugarCrystals,
          this.modelViewTransform.modelToViewDeltaX( sugarCrystalModelSize ), SUGAR_COLOR );
      }

      if ( saltCrystals.length > 0 ) {
        var saltCrystalModelSize = saltCrystals.get( 0 ).length;
        drawCrystals( context, this.modelViewTransform, saltCrystals,
          this.modelViewTransform.modelToViewDeltaX( saltCrystalModelSize ), SALT_COLOR );
      }

    }

  } );
} );
