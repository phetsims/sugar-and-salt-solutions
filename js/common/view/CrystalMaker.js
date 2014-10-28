// Copyright 2002-2011, University of Colorado
/**
 * This class is used to create crystals and add them to the model.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var MacroCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/MacroCrystal' );
  var Node = require( 'SCENERY/nodes/Node' );
  var invokeLater = require( 'javax.swing.SwingUtilities.invokeLater' );//static

  function CrystalMaker( layer, createNode ) {

    //private
    this.layer;

    //private
    this.createNode;
    this.layer = layer;
    this.createNode = createNode;
  }

  return inherit( Object, CrystalMaker, {
    apply: function( salt ) {
      //Create the node
      var node = createNode.apply( salt );
      //Set up to remove the node and its listener when salt crystal removed from the model
      salt.addRemovalListener( new VoidFunction0().withAnonymousClassBody( {
        apply: function() {
          layer.removeChild( node );
          //Store a reference to the removalListener instance, for use in the anonymous inner class below
          var removalListener = this;
          //This code should be read with IDEA's closure folding
          invokeLater( new Runnable().withAnonymousClassBody( {
            run: function() {
              salt.removeRemovalListener( removalListener );
            }
          } ) );
        }
      } ) );
      layer.addChild( node );
    }
  } );
} );

