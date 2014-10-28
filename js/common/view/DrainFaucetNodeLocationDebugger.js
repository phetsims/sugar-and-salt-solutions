// Copyright 2002-2011, University of Colorado
/**
 * Debugging utility to show the location of the faucet where the particles will drain out
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'KITE/Rectangle' );
  var SimpleObserver = require( 'edu.colorado.phet.common.phetcommon.util.SimpleObserver' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetPPath = require( 'edu.colorado.phet.common.piccolophet.nodes.PhetPPath' );
  var SugarAndSaltSolutionModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SugarAndSaltSolutionModel' );
  var Node = require( 'SCENERY/nodes/Node' );

//Flag to indicate whether the debugging is enabled

  //private
  var enabled = false;

  function DrainFaucetNodeLocationDebugger( transform, model ) {
    if ( enabled ) {
      var length = 4;
      //Show the location where particles enter the drain faucet
      addChild( new PhetPPath( new Rectangle.Number( -length, -length, length * 2, length * 2 ), Color.red ).withAnonymousClassBody( {
        initializer: function() {
          //Whenever the model solution changes, the drain point could change, so watch it for updates
          model.solution.shape.addObserver( new SimpleObserver().withAnonymousClassBody( {
            update: function() {
              setOffset( transform.modelToView( model.getDrainFaucetMetrics().getInputPoint().toPoint2D() ) );
            }
          } ) );
        }
      } ) );
      //Show the location where particles leave through the drain faucet
      addChild( new PhetPPath( new Rectangle.Number( -length, -length, length * 2, length * 2 ), Color.red ).withAnonymousClassBody( {
        initializer: function() {
          setOffset( transform.modelToView( model.getDrainFaucetMetrics().outputPoint.toPoint2D() ) );
        }
      } ) );
    }
  }

  return inherit( Node, DrainFaucetNodeLocationDebugger, {
  } );
} );

