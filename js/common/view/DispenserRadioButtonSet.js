// Copyright 2002-2011, University of Colorado
/**
 * Radio buttons to choose between dispensers and hence solutes
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var VerticalLayoutPanel = require( 'edu.colorado.phet.common.phetcommon.view.VerticalLayoutPanel' );
  var PropertyRadioButton = require( 'edu.colorado.phet.common.phetcommon.view.controls.PropertyRadioButton' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType' );
  var PSwing = require( 'edu.umd.cs.piccolox.pswing.PSwing' );
  var CONTROL_FONT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/CONTROL_FONT' );//static

  function DispenserRadioButtonSet( dispenserType, items ) {

    //private
    this.dispenserType;

    //private
    this.items;
    PSwing.call( this, new VerticalLayoutPanel().withAnonymousClassBody( {
      initializer: function() {
        for ( var item in items ) {
          add( new PropertyRadioButton( item.name, dispenserType, item.dispenserType ).withAnonymousClassBody( {
            initializer: function() {
              setFont( CONTROL_FONT );
            }
          } ) );
        }
      }
    } ) );
    this.dispenserType = dispenserType;
    this.items = items;
  }

  return inherit( PSwing, DispenserRadioButtonSet, {
//When switching to a new kit, switch to a dispenser that is in the set (if not already selecting it).  If switching from a set that contains NaCl to a new set that also contains NaCl, then keep the selection
    setSelected: function() {
      if ( !containsDispenser() ) {
        dispenserType.set( items[0].dispenserType );
      }
    },
//Determine whether the currently selected dispenser is one of the choices in this kit

    //private
    containsDispenser: function() {
      var isDispenserAvailable = false;
      for ( var item in items ) {
        if ( item.dispenserType == dispenserType.get() ) {
          isDispenserAvailable = true;
        }
      }
      return isDispenserAvailable;
    }
  } );
} );

