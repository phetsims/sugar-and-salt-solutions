// Copyright 2002-2011, University of Colorado
/**
 * Control node that allows the user to choose from different kits, which each have different combinations of solutes
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var TextButtonNode = require( 'edu.colorado.phet.common.piccolophet.nodes.TextButtonNode' );
  var Kit = require( 'edu.colorado.phet.common.piccolophet.nodes.kit.Kit' );
  var KitSelectionNode = require( 'edu.colorado.phet.common.piccolophet.nodes.kit.KitSelectionNode' );
  var VBox = require( 'edu.colorado.phet.common.piccolophet.nodes.layout.VBox' );
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType' );
  var DispenserRadioButtonSet = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/DispenserRadioButtonSet' );
  var SelectableSoluteItem = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SelectableSoluteItem' );
  var WhiteControlPanelNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/WhiteControlPanelNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Strings = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings' );//static ///*
  var DispenserType = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType' );//static ///*
  var GLUCOSE = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/GLUCOSE' );//static
  var SALT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/SALT' );//static
  var SUGAR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/DispenserType/SUGAR' );//static
  var createTitle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SoluteControlPanelNode/createTitle' );//static

  function MicroKitControlNode( selectedKit, dispenserType, //A button that shows the periodic table when pressed, shown inside the kit selection node since the selected item controls what is highlighted in the periodic table
                                periodicTableButton, onlyOneKit ) {
    this.kitSelectionNode;
    //For onlyOneKit, only show sugar and salt in the micro tab.  Used for wet lab in fall 2011 and can probably be deleted afterwards.
    kitSelectionNode = onlyOneKit ? new KitSelectionNode( selectedKit, createTitle(), new Kit( new DispenserRadioButtonSet( dispenserType, new SelectableSoluteItem( SODIUM_CHLORIDE_NA_CL, SALT ), new SelectableSoluteItem( SUCROSE_C_12_H_22_O_11, SUGAR ) ) ) ) : new KitSelectionNode( selectedKit, createTitle(), new Kit( new DispenserRadioButtonSet( dispenserType, new SelectableSoluteItem( SODIUM_CHLORIDE_NA_CL, SALT ), new SelectableSoluteItem( SUCROSE_C_12_H_22_O_11, SUGAR ) ) ), new Kit( new DispenserRadioButtonSet( dispenserType, new SelectableSoluteItem( SODIUM_CHLORIDE_NA_CL, SALT ), new SelectableSoluteItem( CALCIUM_CHLORIDE_CA_CL_2, CALCIUM_CHLORIDE ) ) ), new Kit( new DispenserRadioButtonSet( dispenserType, new SelectableSoluteItem( SODIUM_CHLORIDE_NA_CL, SALT ), new SelectableSoluteItem( SODIUM_NITRATE_NA_NO_3, SODIUM_NITRATE ) ) ), new Kit( new DispenserRadioButtonSet( dispenserType, new SelectableSoluteItem( SUCROSE_C_12_H_22_O_11, SUGAR ), new SelectableSoluteItem( GLUCOSE_C_6_H_12_O_6, GLUCOSE ) ) ) );
    //Show the selection dialog above the periodic table button
    addChild( new WhiteControlPanelNode( new VBox( kitSelectionNode, periodicTableButton ) ) );
    //When switching to a new kit, switch to a dispenser that is in the set (if not already selecting it).  If switching from a set that contains NaCl to a new set that also contains NaCl, then keep the selection
    selectedKit.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( index ) {
        kitSelectionNode.getKit( index ).content.setSelected();
      }
    } ) );
  }

  return inherit( Node, MicroKitControlNode, {
  } );
} );

