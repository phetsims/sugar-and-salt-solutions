// Copyright 2014-2015, University of Colorado Boulder
/**
 * Absolute locations in model coordinates (in meters) of where
 * particles flow to leave the drain pipe, and where they leave when they exit the drain pipe.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {SugarAndSaltSolutionModel} model
   * @param {Vector2} inputPoint
   * @param {Vector2} outputPoint
   * @param {double} faucetWidth
   * @constructor
   */
  function FaucetMetrics( model, inputPoint, outputPoint, faucetWidth ) {

    //@private The main model is used to obtain the bounds for the solution
    this.model = model;
    //@private Location where particles enter the drain faucet
    this.inputPoint = inputPoint;

    //Location where particles leave the drain faucet
    this.outputPoint = outputPoint;

    //The width of the opening of the faucet where the water comes out,
    //used to create water rectangle of the right dimension
    this.faucetWidth = faucetWidth;
  }

  return inherit( Object, FaucetMetrics, {

    /**
     * If the center of the drain pipe input is above the water, move the target input point to be within the
     * drain pipe, but at the surface of the water
     * This is so that solutes can continue flowing out as long as water is flowing out
     *
     * @returns {Vector2}
     */
    getInputPoint: function() {
      var solutionShapeBounds = this.model.solution.shape.get().bounds;
      if ( solutionShapeBounds.getMinY() < this.inputPoint.y && this.inputPoint.y < solutionShapeBounds.getMaxY() ) {
        return this.inputPoint;
      }
      else {
        return new Vector2( this.inputPoint.x, solutionShapeBounds.getMaxY() );
      }
    },

    //Ashraf Did for debugging purposes, TODO clean up this method
    getImageInputPoint: function() {
      return this.inputPoint;
    },
    /**
     * Copies this FaucetMetrics but with the substituted inputX value to
     * ensure output drain input point is within the fluid so particles can reach it
     * @param {number} inputX
     * @returns {FaucetMetrics}
     */
    clampInputWithinFluid: function( inputX ) {
      return new FaucetMetrics( this.model, new Vector2( inputX, this.inputPoint.y ), this.outputPoint, this.faucetWidth );
    }

  }, {

    //static functions
    /**
     * Factory Method to support constructor overloading
     * Create a FaucetMetrics given the faucet node and root node
     * @param {ModelViewTransform2} transform
     * @param {SugarAndSaltSolutionsModel} model
     * @param {Node} rootNode
     * @param {Node} inputFaucetNode
     * @returns {FaucetMetrics}
     */
    createFaucetMetricsByFaucetNode: function( transform, model, rootNode, inputFaucetNode ) {
      var inputModelPos = transform.viewToModelPosition( rootNode.globalToLocalPoint( inputFaucetNode.getGlobalInputCenter() ) );
      var outputModelPos = transform.viewToModelPosition( rootNode.globalToLocalPoint( inputFaucetNode.getGlobalOutputCenter() ) );
      var faucetWidth = transform.viewToModelDeltaX( rootNode.globalToLocalBounds( inputFaucetNode.getGlobalOutputSize() ).getWidth() );
      return new FaucetMetrics( model, inputModelPos, outputModelPos, faucetWidth );
    }
  } );

} );

//public class FaucetMetrics {
//

//
//    //Creates a FaucetMetrics given the faucet node and root node
//    public FaucetMetrics( ModelViewTransform transform, SugarAndSaltSolutionModel model, PNode rootNode, FaucetNode faucetNode ) {
//        this( model,
//              transform.viewToModel( new Vector2D( rootNode.globalToLocal( faucetNode.getGlobalInputCenter() ) ) ),
//              transform.viewToModel( new Vector2D( rootNode.globalToLocal( faucetNode.getGlobalOutputCenter() ) ) ),
//              transform.viewToModelDeltaX( rootNode.globalToLocal( faucetNode.getGlobalOutputSize() ).getWidth() ) );
//    }
//
//    //Creates a FaucetMetrics with the previously computed positions
//    public FaucetMetrics( SugarAndSaltSolutionModel model, Vector2D inputPoint, Vector2D outputPoint, double faucetWidth ) {
//        this.inputPoint = inputPoint;
//        this.outputPoint = outputPoint;
//        this.model = model;
//        this.faucetWidth = faucetWidth;
//    }
//

//}
