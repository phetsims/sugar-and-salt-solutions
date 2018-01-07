// Copyright 2014-2017, University of Colorado Boulder

/**
 * A single sugar molecule (such as glucose or sucrose), which is used to build up sugar crystals
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Compound' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Constituent' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SugarAndSaltSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSharedProperties' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {Vector2} relativePosition
   * @param {number} angle
   * @param {ProjectedPositions} positions //Positions for the atoms within the molecule
   * @constructor
   */
  function SugarMolecule( relativePosition, angle, positions ) {
    var self = this;
    Compound.call( this, relativePosition, angle );
    //Add the glucose molecule atoms in the right locations, and in the right z-ordering
    _.each( positions.getAtoms(), function( atomPosition ) {
      self.constituents.add( new Constituent( atomPosition.createConstituent(),
        relativePosition.plus( atomPosition.position.times( SugarAndSaltSharedProperties.sizeScale.get() ) ) ) );

    } );

    //Update positions so the lattice position overwrites constituent particle positions
    this.stepInTime( Vector2.ZERO, 0.0 );
  }

  return inherit( Compound, SugarMolecule );

} );
