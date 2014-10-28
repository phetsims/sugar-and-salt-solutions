/**
 * This class observes an ItemList and creates a PNode when an item is added to the model list,
 * and removes it when the item is removed from the model list.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var ICanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/ICanvas' );
  var SphericalParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SphericalParticleNode' );

  function SphericalParticleNodeFactory( list, transform, canvas, showChargeColor ) {

    //private
    this.list;

    //private
    this.transform;

    //private
    this.canvas;

    //private
    this.showChargeColor;
    this.list = list;
    this.transform = transform;
    this.canvas = canvas;
    this.showChargeColor = showChargeColor;
  }

  return inherit( Object, SphericalParticleNodeFactory, {
//Create the PNode for the particle, and wire it up to be removed when the particle leaves the model
    apply: function( particle ) {
      var node = new SphericalParticleNode( transform, particle, showChargeColor );
      canvas.addChild( node );
      list.addElementRemovedObserver( particle, new VoidFunction0().withAnonymousClassBody( {
        apply: function() {
          list.removeElementRemovedObserver( particle, this );
          canvas.removeChild( node );
        }
      } ) );
    }
  } );
} );

