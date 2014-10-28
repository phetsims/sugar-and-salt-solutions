// Copyright 2002-2012, University of Colorado
/**
 * In order to treat sucrose and sodium chloride uniformly in the water tab, we use two levels of hierarchy for each:
 * Crystal contains Compound contains Atom
 * However, for sodium chloride all compounds just contain the single atom, which is modeled by SaltIon.
 * <p/>
 * This allows us to efficiently reuse software components in both the model and the view.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var Formula = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Formula' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Chloride' );
  var CHLORIDE = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/CHLORIDE' );//static
  var SODIUM = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/SODIUM' );//static

  function SodiumChlorideCrystal( position, angle ) {
    Crystal.call( this, new Formula( SaltIon.SodiumIon.class, SaltIon.ChlorideIon.class ), position, new Chloride().radius + new SphericalParticle.Sodium().radius, angle );
  }

  return inherit( Crystal, SodiumChlorideCrystal, {
//Randomly choose an initial particle for the crystal lattice
    createConstituentParticle: function( type ) {
      return type == SaltIon.SodiumIon.class ? new SaltIon( new SphericalParticle.Sodium(), SODIUM ) : new SaltIon( new Chloride(), CHLORIDE );
    },
//Create the bonding partner for growing the crystal
    createPartner: function( original ) {
      return original instanceof SaltIon.SodiumIon ? new SaltIon.ChlorideIon() : new SaltIon.SodiumIon();
    }
  } );
} );

