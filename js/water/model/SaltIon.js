// Copyright 2002-2012, University of Colorado
/**
 * In order to treat sucrose and sodium chloride uniformly in the water tab, we use two levels of hierarchy for each:
 * Crystal contains Compound contains Atom
 * However, for sodium chloride all compounds just contain the single atom, which is modeled by SaltIon
 * <p/>
 * This allows us to efficiently reuse software components in both the model and the view.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Compound' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var CHLORIDE = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/CHLORIDE' );//static
  var SODIUM = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/SODIUM' );//static


  // static class: SodiumIon
  var SodiumIon =
    define( function( require ) {
      function SodiumIon() {
        SaltIon.call( this, new SphericalParticle.Sodium(), SODIUM );
      }

      return inherit( SaltIon, SodiumIon, {
      } );
    } );
  ;
  // static class: ChlorideIon
  var ChlorideIon =
    define( function( require ) {
      function ChlorideIon() {
        SaltIon.call( this, new SphericalParticle.Chloride(), CHLORIDE );
      }

      return inherit( SaltIon, ChlorideIon, {
      } );
    } );
  ;
  function SaltIon( particle, name ) {

    //private
    this.name;
    Compound.call( this, ZERO, 0 );
    this.name = name;
    addConstituent( new Constituent( particle, ZERO ) );
  }

  return inherit( Compound, SaltIon, {
//Return the name of the ion such as "Na+" to be shown on the graphic as a label
    getName: function() {
      return name;
    },
  } );
} );

