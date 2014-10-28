// Copyright 2002-2012, University of Colorado
/**
 * A single sucrose molecule, which is used in lattice creation
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var SucrosePositions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SucrosePositions' );
  var SugarMolecule = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/SugarMolecule' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static

  function Sucrose() {
    this( ZERO, Math.random() * 2 * Math.PI );
  }

  function Sucrose( relativePosition ) {
    this( relativePosition, Math.random() * 2 * Math.PI );
  }

  function Sucrose( relativePosition, angle ) {
    SugarMolecule.call( this, relativePosition, angle, new SucrosePositions() );
  }

  return inherit( SugarMolecule, Sucrose, {
  } );
} );

