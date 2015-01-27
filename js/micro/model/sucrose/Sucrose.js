//  Copyright 2002-2014, University of Colorado Boulder
/**
 * A single sucrose molecule, which is used in lattice creation
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SugarMolecule = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/SugarMolecule' );
  var SucrosePositions = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/SucrosePositions' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {Vector2} relativePosition
   * @param {number} angle
   * @constructor
   */
  function Sucrose( relativePosition, angle ) {

    relativePosition = relativePosition || Vector2.ZERO;
    angle = angle || Math.random() * 2 * Math.PI;
    SugarMolecule.call( this, relativePosition, angle, new SucrosePositions() );
  }

  return inherit( SugarMolecule, Sucrose );
} );

