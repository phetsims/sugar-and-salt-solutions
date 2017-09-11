// Copyright 2014-2015, University of Colorado Boulder
/**
 * A single glucose molecule, which is used in lattice creation
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var GlucosePositions = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/GlucosePositions' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SugarMolecule = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/SugarMolecule' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {Vector2} relativePosition
   * @param {number} angle
   * @constructor
   */
  function Glucose( relativePosition, angle ) {
    SugarMolecule.call( this, relativePosition || new Vector2(), angle || Math.random() * 2 * Math.PI,
      new GlucosePositions() );
  }

  return inherit( SugarMolecule, Glucose );
} );

