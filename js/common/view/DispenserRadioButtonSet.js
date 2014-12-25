//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Radio buttons to choose between dispensers and hence solutes
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  /**
   *
   * @param {Property<DispenserType>} dispenserType
   * @param {Array<SelectableSoluteItem>}items
   * @constructor
   */
  function DispenserRadioButtonSet( dispenserType, items ) {

    //@private
    this.dispenserType = dispenserType;
    //@private
    this.items = items;

    var radioButtonFont = new PhetFont( { size: 12, weight: 'bold' } );
    var dispensersRadioItems = [];
    _.each( items, function( item ) {
      dispensersRadioItems.push( { node: new Text( item.name, {font: radioButtonFont} ),
        property: dispenserType,
        value: item.dispenserType } );
    } );

    Panel.call( this, new VerticalAquaRadioButtonGroup( dispensersRadioItems ),{
      // panel options
      fill: 'rgb(238,238,238)',
      xMargin: 2,
      yMargin: 2,
      lineWidth: 0
    } );
  }

  return inherit( Panel, DispenserRadioButtonSet, {
    /**
     * When switching to a new kit, switch to a dispenser that is in the set if not already selecting it).
     * If switching from a set that contains NaCl to a new set that also contains NaCl,then keep the selection
     */
    setSelected: function() {
      if ( !this.containsDispenser() ) {
        this.dispenserType.set( this.items[0].dispenserType );
      }
    },

    /**
     * @private
     * Determine whether the currently selected dispenser is one of the choices in this kit
     * @returns {boolean}
     */
    containsDispenser: function() {
      var isDispenserAvailable = false;
      var thisSet = this;
      _.each( this.items, function( item ) {
        if ( item.dispenserType === thisSet.dispenserType.get() ) {
          isDispenserAvailable = true;
        }
      } );

      return isDispenserAvailable;
    }

  } );
} );

//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.view;
//
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.view.VerticalLayoutPanel;
//import edu.colorado.phet.common.phetcommon.view.controls.PropertyRadioButton;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.DispenserType;
//import edu.umd.cs.piccolox.pswing.PSwing;
//
//import static edu.colorado.phet.sugarandsaltsolutions.common.view.BeakerAndShakerCanvas.CONTROL_FONT;
//
///**
// * Radio buttons to choose between dispensers and hence solutes
// *
// * @author Sam Reid
// */
//public class DispenserRadioButtonSet extends PSwing {
//    private final Property<DispenserType> dispenserType;
//    private final SelectableSoluteItem[] items;
//
//    public DispenserRadioButtonSet( final Property<DispenserType> dispenserType, final SelectableSoluteItem... items ) {
//        super( new VerticalLayoutPanel() {{
//            for ( SelectableSoluteItem item : items ) {
//                add( new PropertyRadioButton<DispenserType>( item.name, dispenserType, item.dispenserType ) {{setFont( CONTROL_FONT );}} );
//            }
//        }} );
//        this.dispenserType = dispenserType;
//        this.items = items;
//    }
//
//    //When switching to a new kit, switch to a dispenser that is in the set (if not already selecting it).  If switching from a set that contains NaCl to a new set that also contains NaCl, then keep the selection
//    public void setSelected() {
//        if ( !containsDispenser() ) {
//            dispenserType.set( items[0].dispenserType );
//        }
//    }
//
//    //Determine whether the currently selected dispenser is one of the choices in this kit
//    private boolean containsDispenser() {
//        boolean isDispenserAvailable = false;
//        for ( SelectableSoluteItem item : items ) {
//            if ( item.dispenserType == dispenserType.get() ) {
//                isDispenserAvailable = true;
//            }
//        }
//        return isDispenserAvailable;
//    }
//}
