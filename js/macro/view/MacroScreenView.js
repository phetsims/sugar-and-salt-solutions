//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var HSlider = require( 'SUN/HSlider' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BeakerAndShakerView = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/BeakerAndShakerView' );
  var CrystalMakerCanvasNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/CrystalMakerCanvasNode' );
  var VolumeIndicatorNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/VolumeIndicatorNode' );
  var PrecipitateNode = require( 'SUGAR_AND_SALT_SOLUTIONS/macro/view/PrecipitateNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var Units = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Units' );
  var Util = require( 'DOT/Util' );

  // images
  var mockupImage = require( 'image!SUGAR_AND_SALT_SOLUTIONS/mockup-macro.png' );

  /**
   * @param {MacroModel} macroModel
   * @constructor
   */
  function MacroScreenView( macroModel ) {

    var layoutBounds = SugarAndSaltConstants.LAYOUT_BOUNDS;
    var modelScale = 0.70;
    var modelBounds = macroModel.visibleRegion;
    var viewMinX = 15;
    var viewMinY = 155;
    var viewPortBounds = new Bounds2( viewMinX, viewMinY, viewMinX + layoutBounds.width * modelScale,
        viewMinY + (layoutBounds.height * modelScale) );

    var thisView = this;
    thisView.model = macroModel;

    // Manually tuned so that the model part shows up in the left side of the canvas,
    // leaving enough room for controls, labels, and positioning it so it appears near the bottom
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelBounds, viewPortBounds );
    BeakerAndShakerView.call( thisView, macroModel, layoutBounds, modelViewTransform );

    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.2 );
    var image = new Image( mockupImage, {pickable: false} );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, {min: 0, max: 1}, {top: 10, left: 500} ) );


    //Layer that holds the sugar and salt crystals
    var crystalLayer = new Node();

    //Show the crystal layer behind the water and beaker so the crystals look like they go
    // into the water instead of in front of it.
    thisView.submergedInWaterNode.addChild( crystalLayer );

    var crystalBounds = new Bounds2( 30, 0, 800, 500 );
    var crystalMakerCanvasNode = new CrystalMakerCanvasNode( macroModel, modelViewTransform, crystalBounds );
    crystalLayer.addChild( crystalMakerCanvasNode );

    //Show the precipitate as the sum of salt and sugar
    thisView.submergedInWaterNode.addChild( new PrecipitateNode( modelViewTransform,
      DerivedProperty.multilink( [macroModel.salt.solidVolume, macroModel.sugar.solidVolume], function( saltVolume, sugarVolume ) {
        return saltVolume + sugarVolume;
      } ), macroModel.beaker ) );

    //Readout function for the exact volume readout on the solution when the user selects "show values.
    //Read out more precisely than the fine-grained tick marks on the side
    var beakerVolumeReadoutFormat = function( volumeInMetersCubed ) {
      return Util.toFixed( Units.metersCubedToLiters( volumeInMetersCubed ), 2 );
    };

    //Readout the volume of the water in Liters, only visible if the user opted to show values (in the concentration bar chart)
    thisView.addChild( new VolumeIndicatorNode( modelViewTransform, macroModel.solution, macroModel.showConcentrationValues,
      macroModel.anySolutes, beakerVolumeReadoutFormat ) );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        macroModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( BeakerAndShakerView, MacroScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );