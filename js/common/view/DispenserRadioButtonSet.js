// Copyright 2014-2015, University of Colorado Boulder

/**
 * Radio buttons to choose between dispensers and hence solutes
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );

  /**
   *
   * @param {Property<DispenserType>} dispenserType
   * @param {Array<SelectableSoluteItem>}items
   * @constructor
   */
  function DispenserRadioButtonSet( dispenserType, items ) {
    var thisNode = this;
    Node.call( thisNode );
    //@private
    this.dispenserType = dispenserType;
    //@private
    this.items = items;

    var dispensersRadioItems = [];
    _.each( items, function( item ) {
      dispensersRadioItems.push( { node: new Text( item.name, {font: SugarAndSaltConstants.CONTROL_FONT} ),
        property: dispenserType,
        value: item.dispenserType } );
    } );

    thisNode.addChild( new VerticalAquaRadioButtonGroup( dispensersRadioItems, { touchXPadding: 5 } ) );
  }

  return inherit( Node, DispenserRadioButtonSet, {
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
