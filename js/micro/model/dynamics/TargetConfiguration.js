// Copyright 2002-2011, University of Colorado
/**
 * A TargetConfiguration indicates target positions and matching crystal lattice sites for each member of a formula unit
 * so that a crystal can be grown by one formula unit at a time so that it will never become unbalanced
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Function2 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function2' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );

  function TargetConfiguration( list ) {

    //private
    this.list;
    this.distance;
    this.list = list;
    this.distance = list.foldLeft( 0.0, new Function2().withAnonymousClassBody( {
      apply: function( match, runningTotal ) {
        return match.distance + runningTotal;
      }
    } ) );
  }

  return inherit( Object, TargetConfiguration, {
    getMatches: function() {
      return list;
    },
    toString: function() {
      return list.toString();
    }
  } );
} );

