// Copyright 2002-2012, University of Colorado
/**
 * A single sugar molecule (such as glucose or sucrose), which is used to build up sugar crystals
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Compound' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var ProjectedPositions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ProjectedPositions' );
  var AtomPosition = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ProjectedPositions/AtomPosition' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var sizeScale = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsApplication/sizeScale' );//static

  function SugarMolecule( relativePosition, angle, //Positions for the atoms within the molecule
                          positions ) {
    Compound.call( this, relativePosition, angle );
    //Add the glucose molecule atoms in the right locations, and in the right z-ordering
    for ( var atomPosition in positions.getAtoms() ) {
      constituents.add( new Constituent( atomPosition.createConstituent(), relativePosition.plus( atomPosition.position.times( sizeScale.get() ) ) ) );
    }
    //Update positions so the lattice position overwrites constituent particle positions
    stepInTime( ZERO, 0.0 );
  }

  return inherit( Compound, SugarMolecule, {
  } );
} );

