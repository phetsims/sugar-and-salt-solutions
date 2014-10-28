// Copyright 2002-2012, University of Colorado
/**
 * Shows all components of a molecule, used in bar chart legends, but not used in the beaker play area--in that case each atom is a top-level node.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var SwingUtilities = require( 'javax.swing.SwingUtilities' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Compound' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/Sucrose' );
  var SphericalParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SphericalParticleNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PFrame = require( 'edu.umd.cs.piccolox.PFrame' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var createOffsetScaleMapping = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform.createOffsetScaleMapping' );//static

  function CompositeParticleNode( transform, compound, showChargeColor ) {
    for ( var i = 0; i < compound.numberConstituents(); i++ ) {
      var constituent = compound.getConstituent( i );
      //Put particles at the correct relative locations and add as children, necessary for icons like NO3 in the bar chart
      constituent.particle.setPosition( constituent.relativePosition );
      addChild( new SphericalParticleNode( transform, constituent.particle, showChargeColor ) );
    }
  }

  return inherit( Node, CompositeParticleNode, {
//Test main
    main: function( args ) {
      SwingUtilities.invokeLater( new Runnable().withAnonymousClassBody( {
        run: function() {
          new PFrame().withAnonymousClassBody( {
            initializer: function() {
              //Large transform is needed since nodes are rasterized
              getCanvas().getLayer().addChild( new CompositeParticleNode( createOffsetScaleMapping( new Vector2( 0, 0 ), 1E11 ), new Sucrose( ZERO ), new Property( false ) ).withAnonymousClassBody( {
                initializer: function() {
                  var width = getFullBounds().getWidth();
                  console.log( "width = " + width );
                  translate( 200, 200 );
                }
              } ) );
              setDefaultCloseOperation( EXIT_ON_CLOSE );
            }
          } ).setVisible( true );
        }
      } ) );
    }
  } );
} );

