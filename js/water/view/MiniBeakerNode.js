// Copyright 2002-2011, University of Colorado
/**
 * Shows a small representation of a beaker with solution that is "zoomed in" on by the ParticleWindowNode
 * Uses features from "macro" tab that were not moved to "common" package.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var BeakerNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerNode' );
  var SolutionNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SolutionNode' );
  var MacroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroModel' );
  var MacroCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/view/MacroCanvas' );
  var Node = require( 'SCENERY/nodes/Node' );
  var WATER_COLOR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/WATER_COLOR' );//static

  function MiniBeakerNode() {
    //Create a whole model, but just for the purpose of making a beaker graphic.  Shouldn't be a memory leak since no listeners are wired up and this is done only once.
    var model = new MacroModel();
    var transform = MacroCanvas.createMacroTransform( model );
    //Add the beaker and water graphics
    addChild( new BeakerNode( transform, model.beaker ) );
    addChild( new SolutionNode( transform, model.solution, new Color( WATER_COLOR.getRed(), WATER_COLOR.getGreen(), WATER_COLOR.getBlue(), 255 ) ) );
    //Make it smaller so it will fit on the screen
    scale( 0.275 );
  }

  return inherit( Node, MiniBeakerNode, {
  } );
} );

