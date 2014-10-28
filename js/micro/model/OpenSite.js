// Copyright 2002-2012, University of Colorado
/**
 * Location in a crystal where a new atom could attach.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );

  function OpenSite( relativePosition, shape, newInstance, absolutePosition ) {
    //Position relative to the origin of the crystal
    this.relativePosition;
    //Absolute location for checking bounds against water bounds
    this.shape;
    //Absolute position in the model
    this.absolutePosition;

    //private
    this.newInstance;
    this.relativePosition = relativePosition;
    this.shape = shape;
    this.newInstance = newInstance;
    this.absolutePosition = absolutePosition;
  }

  return inherit( Object, OpenSite, {
    toConstituent: function() {
      return new Constituent( newInstance.apply(), relativePosition );
    },
    matches: function( other ) {
      return newInstance.apply().getClass().equals( other.getClass() );
    },
    matches: function( type ) {
      return newInstance.apply().getClass().equals( type );
    }
  } );
} );

