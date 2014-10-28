// Copyright 2002-2011, University of Colorado
/**
 * Debugging utility that shows the sites where a crystal lattice may be grown
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BasicStroke = require( 'java.awt.BasicStroke' );
  var Color = require( 'SCENERY/util/Color' );
  var ArrayList = require( 'java.util.ArrayList' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var CrystallizationMatch = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/CrystallizationMatch' );
  var TargetConfiguration = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/TargetConfiguration' );
  var Node = require( 'SCENERY/nodes/Node' );

  function BindingSiteDebugger( transform, model ) {
    model.stepFinishedListeners.add( new VoidFunction0().withAnonymousClassBody( {
      apply: function() {
        //Clear all children and repopulate
        removeAllChildren();
        //Get the list of targets for each crystal
        var matches = model.getAllBondingSites();
        for ( var matchesForCrystal in matches ) {
          //If there was a match, display it
          if ( matchesForCrystal != null ) {
            for ( var match in matchesForCrystal.getMatches() ) {
              //For each of the crystals match lists, show the bonding sites
              var baseColor = Color.green;
              addChild( new PhetPPath( transform.modelToView( match.getTargetShape() ), new BasicStroke( 2 ), new Color( baseColor.getRed(), baseColor.getGreen(), baseColor.getBlue(), 200 ) ) );
            }
          }
        }
        moveToFront();
      }
    } ) );
  }

  return inherit( Node, BindingSiteDebugger, {
  } );
} );

