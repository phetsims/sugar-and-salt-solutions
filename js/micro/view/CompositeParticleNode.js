// Copyright 2014-2016, University of Colorado Boulder

/**
 * Shows all components of a molecule, used in bar chart legends, but not
 * used in the beaker play area--in that case each atom is a top-level node.
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SphericalParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SphericalParticleNode' );

  /**
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Compound} compound
   * @param {Property<boolean>} showChargeColor
   * @constructor
   */
  function CompositeParticleNode( modelViewTransform, compound, showChargeColor ) {
    Node.call( this );
    for ( var i = 0; i < compound.numberConstituents(); i++ ) {
      var constituent = compound.getConstituent( i );

      // Put particles at the correct relative locations and add as children, necessary for icons like NO3 in the bar chart
      constituent.particle.setPosition( constituent.relativePosition );
      this.addChild( new SphericalParticleNode( modelViewTransform, constituent.particle, showChargeColor ) );
    }
  }
  return inherit( Node, CompositeParticleNode );
} );

