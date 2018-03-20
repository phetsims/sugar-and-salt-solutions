// Copyright 2014-2017, University of Colorado Boulder
/**
 * If you're not part of the solution, you're part of the precipitate.  This node draws the
 * clump of crystals that has come out of solution (because of passing the saturation point)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  /**
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<number>} precipitateVolume
   * @param {Beaker} beaker
   * @constructor
   */
  function PrecipitateNode( modelViewTransform, precipitateVolume, beaker ) {
    var self = this;
    Path.call( self, new Shape(), {
      //Show as white, but it renders between the water layers so it looks like it is in the water
      //(unless it passes the top of the water)
      fill: Color.white,
      //Make it not intercept mouse events so the user can still retrieve a
      // probe that is buried in the precipitate
      pickable: false
    } );

    precipitateVolume.link( function( volume ) {

      //Scale up the precipitate volume to convert from meters cubed to stage coordinates, manually tuned
      //We tried showing as a wide and short ellipse (a clump centered in the beaker), but that creates complications when it comes to showing the water level
      //Note, this assumes that the beaker (and precipitate) are rectangular
      self.setShape( modelViewTransform.modelToViewShape( Shape.rectangle( beaker.getX(),
        beaker.getY(), beaker.getWidth(), beaker.getHeightForVolume( volume ) ) ) );

    } );
  }

  sugarAndSaltSolutions.register( 'PrecipitateNode', PrecipitateNode );
  return inherit( Path, PrecipitateNode );
} );

