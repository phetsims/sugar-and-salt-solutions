// Copyright 2002-2012, University of Colorado
/**
 * Data structure for a nitrate (NO3) including references to the particles and the locations relative to the central nitrogen.
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
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var FreeOxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/FreeOxygen' );
  var Nitrogen = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Nitrogen' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var createPolar = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.createPolar' );//static
  var NITROGEN_OXYGEN_SPACING = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumnitrate/SodiumNitrateCrystal/NITROGEN_OXYGEN_SPACING' );//static

  function Nitrate() {
    this( 0, ZERO );
  }

  function Nitrate( angle, relativePosition ) {
    Compound.call( this, relativePosition, angle );
    constituents.add( new Constituent( new FreeOxygen(), createPolar( NITROGEN_OXYGEN_SPACING, Math.PI * 2 * 0 / 3.0 + angle ) ) );
    constituents.add( new Constituent( new FreeOxygen(), createPolar( NITROGEN_OXYGEN_SPACING, Math.PI * 2 * 1 / 3.0 + angle ) ) );
    constituents.add( new Constituent( new FreeOxygen(), createPolar( NITROGEN_OXYGEN_SPACING, Math.PI * 2 * 2 / 3.0 + angle ) ) );
    constituents.add( new Constituent( new Nitrogen(), ZERO ) );
  }

  return inherit( Compound, Nitrate, {
  } );
} );

