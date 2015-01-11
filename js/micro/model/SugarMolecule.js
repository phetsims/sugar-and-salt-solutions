// Copyright 2002-2014, University of Colorado Boulder

/**
 * A single sugar molecule (such as glucose or sucrose), which is used to build up sugar crystals
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Compound' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Constituent' );
  var Vector2 = require( 'DOT/Vector2' );
  var SugarAndSaltSharedProperties = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSharedProperties' );

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


//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.micro.model;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Compound;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Constituent;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ProjectedPositions;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ProjectedPositions.AtomPosition;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.SphericalParticle;
//
//import static edu.colorado.phet.common.phetcommon.math.vector.Vector2D.ZERO;
//import static edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsApplication.sizeScale;
//
///**
// * A single sugar molecule (such as glucose or sucrose), which is used to build up sugar crystals
// *
// * @author Sam Reid
// */
//public class SugarMolecule extends Compound<SphericalParticle> {
//
//    public SugarMolecule( Vector2D relativePosition, double angle,
//
//                          //Positions for the atoms within the molecule
//                          ProjectedPositions positions ) {
//        super( relativePosition, angle );
//

//    }
//}
