// Copyright 2002-2011, University of Colorado
/**
 * Developer controls for water model tab physics.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var ActionEvent = require( 'java.awt.event.ActionEvent' );
  var ActionListener = require( 'java.awt.event.ActionListener' );
  var JButton = require( 'javax.swing.JButton' );
  var JLabel = require( 'javax.swing.JLabel' );
  var JPanel = require( 'javax.swing.JPanel' );
  var JSeparator = require( 'javax.swing.JSeparator' );
  var SwingConstants = require( 'javax.swing.SwingConstants' );
  var LineBorder = require( 'javax.swing.border.LineBorder' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var VerticalLayoutPanel = require( 'edu.colorado.phet.common.phetcommon.view.VerticalLayoutPanel' );
  var PropertySlider = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/PropertySlider' );
  var WaterModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterModel' );

  function DeveloperControl( waterModel ) {

    // non-static inner class: IntLabel
    var IntLabel =

      //private
      define( function( require ) {
        function IntLabel( k ) {
          JLabel.call( this, k.get() + "" );
          k.addObserver( new VoidFunction1().withAnonymousClassBody( {
            apply: function( integer ) {
              setText( integer + "" );
            }
          } ) );
        }

        return inherit( JLabel, IntLabel, {
        } );
      } );
    // non-static inner class: DoubleLabel
    var DoubleLabel =

      //private
      define( function( require ) {
        function DoubleLabel( k ) {
          JLabel.call( this, k.get() + "" );
          k.addObserver( new VoidFunction1().withAnonymousClassBody( {
            apply: function( integer ) {
              setText( integer + "" );
            }
          } ) );
        }

        return inherit( JLabel, DoubleLabel, {
        } );
      } );
    add( new VerticalLayoutPanel().withAnonymousClassBody( {
      initializer: function() {
        //Developer controls for physics settings,
        add( new JPanel().withAnonymousClassBody( {
          initializer: function() {
            add( new JButton( "Add Water" ).withAnonymousClassBody( {
              initializer: function() {
                addActionListener( new ActionListener().withAnonymousClassBody( {
                  actionPerformed: function( e ) {
                    waterModel.addWaterMolecule( waterModel.getRandomX(), waterModel.getRandomY(), 0 );
                  }
                } ) );
              }
            } ) );
            add( new JLabel( "num waters:" ) );
            add( new DoubleLabel( waterModel.waterList.size ) );
          }
        } ) );
        add( new JPanel().withAnonymousClassBody( {
          initializer: function() {
            add( new DoublePropertySlider( "coulomb strength  multiplier", 0, 200, waterModel.coulombStrengthMultiplier ) );
          }
        } ) );
        add( new JPanel().withAnonymousClassBody( {
          initializer: function() {
            add( new DoublePropertySlider( "coulomb power", 0, 4, waterModel.pow ) );
          }
        } ) );
        add( new JLabel( "model randomness" ) );
        add( new JPanel().withAnonymousClassBody( {
          initializer: function() {
            add( new PropertySlider( 0, 100, waterModel.randomness ) );
            add( new IntLabel( waterModel.randomness ) );
          }
        } ) );
        add( new JPanel().withAnonymousClassBody( {
          initializer: function() {
            add( new DoublePropertySlider( "prob. of interaction", 0, 1, waterModel.probabilityOfInteraction ) );
          }
        } ) );
        add( new JPanel().withAnonymousClassBody( {
          initializer: function() {
            add( new DoublePropertySlider( "time scale", 0, 1, waterModel.timeScale ) );
          }
        } ) );
        setBorder( new LineBorder( Color.black ) );
      }
    } ) );
    add( new JSeparator( SwingConstants.VERTICAL ) );
    add( new VerticalLayoutPanel().withAnonymousClassBody( {
      initializer: function() {
        add( new JLabel( "iterations per time step" ) );
        add( new JPanel().withAnonymousClassBody( {
          initializer: function() {
            add( new PropertySlider( 0, 500, waterModel.iterations ) );
            add( new IntLabel( waterModel.iterations ) );
          }
        } ) );
        add( new JLabel( "Overlaps" ) );
        add( new JPanel().withAnonymousClassBody( {
          initializer: function() {
            add( new PropertySlider( 0, 20, waterModel.overlaps ) );
            add( new IntLabel( waterModel.overlaps ) );
          }
        } ) );
        setBorder( new LineBorder( Color.black ) );
      }
    } ) );
  }

  return inherit( JPanel, DeveloperControl, {
  } );
} );

