// Copyright 2014-2017, University of Colorado Boulder
/**
 * Button that allows the user to remove a particular type of solute, only shown if the sim contains the solute.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SugarAndSaltSolutionsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsConstants' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  /**
   *
   * @param {string} text
   * @param {Property<boolean>} visibleProperty
   * @param {function} remove
   * @constructor
   */
  function RemoveSoluteButtonNode( text, visibleProperty, remove ) {
    var self = this;
    Node.call( self );
    var removeSoluteButton = new TextPushButton( text, {
      font: SugarAndSaltSolutionsConstants.CONTROL_FONT,
      baseColor: SugarAndSaltSolutionsConstants.BUTTON_COLOR,
      //When the user presses the button,clear the solute
      listener: function() {remove();}
    } );
    self.addChild( removeSoluteButton );

    //Only show the button if there is solute to be removed
    visibleProperty.link( function( visible ) {
      self.visible = visible;
    } );
  }

  sugarAndSaltSolutions.register( 'RemoveSoluteButtonNode', RemoveSoluteButtonNode );

  return inherit( Node, RemoveSoluteButtonNode );
} );


// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.common.view;
//
//import java.awt.event.ActionEvent;
//import java.awt.event.ActionListener;
//
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction0;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.piccolophet.nodes.TextButtonNode;
//
//import static edu.colorado.phet.sugarandsaltsolutions.common.view.BeakerAndShakerCanvas.BUTTON_COLOR;
//import static edu.colorado.phet.sugarandsaltsolutions.common.view.BeakerAndShakerCanvas.CONTROL_FONT;
//
///**
// * Button that allows the user to remove a particular type of solute, only shown if the sim contains the solute.
// *
// * @author Sam Reid
// */
//public class RemoveSoluteButtonNode extends TextButtonNode {
//    public RemoveSoluteButtonNode( String text, ObservableProperty<Boolean> visible, final VoidFunction0 remove ) {
//        super( text, CONTROL_FONT );
//        setBackground( BUTTON_COLOR );
//
//        //Only show the button if there is solute to be removed
//        visible.addObserver( new VoidFunction1<Boolean>() {
//            public void apply( Boolean visible ) {
//                setVisible( visible );
//            }
//        } );
//
//        //When the user presses the button ,clear the solute
//        addActionListener( new ActionListener() {
//            public void actionPerformed( ActionEvent e ) {
//                remove.apply();
//            }
//        } );
//    }
//}
