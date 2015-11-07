// Copyright 2015, University of Colorado Boulder
/**
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  //modules
  var FreeOxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/FreeOxygen' );
  var Nitrogen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Nitrogen' );

  //constants
  //The distance between nitrogen and oxygen should be the sum of their radii, but the blue background makes it hard to
  //tell that N and O are bonded. Therefore we bring the outer O's closer to the N so there is some overlap.
  var NITROGEN_OXYGEN_SPACING = ( new Nitrogen().radius + new FreeOxygen().radius ) * 0.85;

  return Object.freeze( { 'NITROGEN_OXYGEN_SPACING': NITROGEN_OXYGEN_SPACING } );


} );