// Copyright 2002-2012, University of Colorado
/**
 * Absolute locations in model coordinates (in meters) of where particles flow to leave the drain pipe, and where they leave when they exit the drain pipe.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'KITE/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var FaucetNode = require( 'edu.colorado.phet.common.piccolophet.nodes.faucet.FaucetNode' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var Node = require( 'SCENERY/nodes/Node' );

//Creates a FaucetMetrics given the faucet node and root node
  function FaucetMetrics( transform, model, rootNode, faucetNode ) {
    //Location where particles enter the drain faucet

    //private
    this.inputPoint;
    //Location where particles leave the drain faucet
    this.outputPoint;
    //The main model is used to obtain the bounds for the solution

    //private
    this.model;
    //The width of the opening of the faucet where the water comes out, used to create water rectangle of the right dimension
    this.faucetWidth;
    this( model, transform.viewToModel( new Vector2( rootNode.globalToLocal( faucetNode.getGlobalInputCenter() ) ) ), transform.viewToModel( new Vector2( rootNode.globalToLocal( faucetNode.getGlobalOutputCenter() ) ) ), transform.viewToModelDeltaX( rootNode.globalToLocal( faucetNode.getGlobalOutputSize() ).getWidth() ) );
  }

//Creates a FaucetMetrics with the previously computed positions
  function FaucetMetrics( model, inputPoint, outputPoint, faucetWidth ) {
    //Location where particles enter the drain faucet

    //private
    this.inputPoint;
    //Location where particles leave the drain faucet
    this.outputPoint;
    //The main model is used to obtain the bounds for the solution

    //private
    this.model;
    //The width of the opening of the faucet where the water comes out, used to create water rectangle of the right dimension
    this.faucetWidth;
    this.inputPoint = inputPoint;
    this.outputPoint = outputPoint;
    this.model = model;
    this.faucetWidth = faucetWidth;
  }

  return inherit( Object, FaucetMetrics, {
//If the center of the drain pipe input is above the water, move the target input point to be within the drain pipe, but at the surface of the water
//This is so that solutes can continue flowing out as long as water is flowing out
    getInputPoint: function() {
      var solutionShapeBounds = model.solution.shape.get().getBounds2D();
      if ( solutionShapeBounds.getBounds2D().getMinY() < inputPoint.toPoint2D().getY() && inputPoint.toPoint2D().getY() < solutionShapeBounds.getBounds2D().getMaxY() ) {
        return inputPoint;
      }
      else {
        return new Vector2( inputPoint.getX(), solutionShapeBounds.getMaxY() );
      }
    },
//Copies this FaucetMetrics but with the substituted inputX value to ensure output drain input point is within the fluid so particles can reach it
    clampInputWithinFluid: function( inputX ) {
      return new FaucetMetrics( model, new Vector2( inputX, inputPoint.getY() ), outputPoint, faucetWidth );
    }
  } );
} );

