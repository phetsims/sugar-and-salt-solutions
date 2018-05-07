// Copyright 2015-2018, University of Colorado Boulder

/**
 * Canvas for the "micro" tab of the sugar and salt solutions sim.  This shares
 * lots of functionality with the first tab, so much of that code is reused by extending BeakerAndShakerCanvas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeakerAndShakerView = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/BeakerAndShakerView' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ExpandableConcentrationBarChartNode = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/ExpandableConcentrationBarChartNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MicroSoluteKitList = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/MicroSoluteKitList' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var SphericalParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SphericalParticleNode' );
  var SugarAndSaltSolutionsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsConstants' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );

  // constants
  // Insets to be used for padding between edge of canvas and controls, or between controls
  var CONCENTRATION_PANEL_INSET = 25;

  /**
   *
   * @param {MicroModel} microModel
   * @constructor
   */
  function MicroScreenView( microModel ) {
    var layoutBounds = SugarAndSaltSolutionsConstants.LAYOUT_BOUNDS;
    var modelScale = 0.70;
    var modelBounds = microModel.visibleRegion;
    var viewMinX = 45;
    var viewMinY = 155;
    var viewPortBounds = new Bounds2( viewMinX, viewMinY, viewMinX + layoutBounds.width * modelScale,
      viewMinY + ( layoutBounds.height * modelScale ) );

    var self = this;
    self.model = microModel;

    // Manually tuned so that the model part shows up in the left side of the canvas,
    // leaving enough room for controls, labels, and positioning it so it appears near the bottom
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelBounds, viewPortBounds );
    BeakerAndShakerView.call( self, microModel, layoutBounds, modelViewTransform );

    // List of the kits the user can choose from, for showing the appropriate bar charts + controls
    self.kitList = new MicroSoluteKitList( microModel, modelViewTransform );

    // TODO - All periodic table, kit selection,

    // Show the concentration bar chart behind the shaker so the user can drag the shaker in front
    var concentrationBarChart = new ExpandableConcentrationBarChartNode( microModel.showConcentrationBarChartProperty, microModel.showConcentrationValuesProperty );
    concentrationBarChart.x = self.layoutBounds.maxX - concentrationBarChart.bounds.getWidth() - CONCENTRATION_PANEL_INSET;
    concentrationBarChart.y = CONCENTRATION_PANEL_INSET;

    microModel.selectedKitProperty.link( function( kit ) {
      concentrationBarChart.setBars( self.kitList.getKit( kit ).barItems );
    } );

    self.behindShakerNode.addChild( concentrationBarChart );

    // When any spherical particle is added in the model, add graphics for them in the view
    self.model.sphericalParticles.addItemAddedListener( function( addedParticle ) {
      var sphericalParticleNode = new SphericalParticleNode( modelViewTransform, addedParticle,
        self.model.showChargeColorProperty );
      self.addChild( sphericalParticleNode );

      // Create the Node for the particle, and wire it up to be removed when the particle leaves the model
      self.model.sphericalParticles.addItemRemovedListener( function removalListener( removedParticle ) {
        if ( removedParticle === addedParticle ) {
          self.removeChild( sphericalParticleNode );
          self.model.sphericalParticles.removeItemRemovedListener( removalListener );
        }
      } );

    } );

  }

  sugarAndSaltSolutions.register( 'MicroScreenView', MicroScreenView );
  return inherit( BeakerAndShakerView, MicroScreenView, {
    step: function( dt ) {
      // Handle view animation here.
    }
  } );

} );