// Copyright 2002-2011, University of Colorado
/**
 * Property that identifies the number of molecules in crystal form, for making sure the user doesn't exceed the allowed maximum
 * Should be rewritten with Property<Integer> but there is currently no good compositional support for it (using plus(), greaterThan(), etc)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SimpleObserver = require( 'edu.colorado.phet.common.phetcommon.util.SimpleObserver' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );

  function CrystalMoleculeCount( crystals ) {
    Property.call( this, 0.0 );
    //This watches the number of crystals but not the number of constituents in each crystal, but this hasn't caused any known problems so far
    crystals.size.addObserver( new SimpleObserver().withAnonymousClassBody( {
      update: function() {
        var count = 0;
        for ( var crystal in crystals ) {
          count = count + crystal.numberConstituents();
        }
        set( count + 0.0 );
      }
    } ) );
  }

  return inherit( Property, CrystalMoleculeCount, {
  } );
} );

