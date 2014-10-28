// Copyright 2002-2011, University of Colorado
/**
 * This is a utility class that allows the user to use a screen shot to pick 2D projected coordinates from a rasterized 3D representation.
 * We are using this to pick good 2D positions for the 3D sucrose and glucose structure.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension = require( 'java.awt.Dimension' );
  var Graphics = require( 'java.awt.Graphics' );
  var Graphics2D = require( 'java.awt.Graphics2D' );
  var MouseAdapter = require( 'java.awt.event.MouseAdapter' );
  var MouseEvent = require( 'java.awt.event.MouseEvent' );
  var Rectangle = require( 'KITE/Rectangle' );
  var BufferedImage = require( 'java.awt.image.BufferedImage' );
  var File = require( 'java.io.File' );
  var IOException = require( 'java.io.IOException' );
  var ImageIO = require( 'javax.imageio.ImageIO' );
  var JComponent = require( 'javax.swing.JComponent' );
  var JFrame = require( 'javax.swing.JFrame' );

  function ProjectorUtil( image ) {

    //private
    this.frame;
    frame = new JFrame( getClass().getName() ).withAnonymousClassBody( {
      initializer: function() {
        setContentPane( new JComponent().withAnonymousClassBody( {
          initializer: function() {
            setPreferredSize( new Dimension( image.getWidth(), image.getHeight() ) );
            addMouseListener( new MouseAdapter().withAnonymousClassBody( {
              mousePressed: function( e ) {
                console.log( e.getX() + ", " + e.getY() );
                //Draw a rectangle to signify this atom has already been annotated
                var g2 = image.createGraphics();
                g2.setPaint( Color.blue );
                g2.draw( new Rectangle.Number( e.getX() - 4, e.getY() - 4, 8, 8 ) );
                g2.dispose();
                repaint();
              }
            } ) );
          },
          paintComponent: function( g ) {
            super.paintComponent( g );
            g.drawImage( image, 0, 0, null );
          }
        } ) );
        pack();
      }
    } );
  }

  return inherit( Object, ProjectorUtil, {
    main: function( args ) /*throws IOException*/ {
      new ProjectorUtil( ImageIO.read( new File( args[0] ) ) ).start();
    },

    //private
    start: function() {
      frame.setVisible( true );
    }
  } );
} );

