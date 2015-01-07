//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.awt.Color;
//import java.awt.Shape;
//import java.awt.geom.Ellipse2D;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.sugarandsaltsolutions.SugarAndSaltSolutionsApplication;
//
//import static edu.colorado.phet.common.phetcommon.math.vector.Vector2D.ZERO;
//import static edu.colorado.phet.common.phetcommon.view.PhetColorScheme.RED_COLORBLIND;
//import static edu.colorado.phet.sugarandsaltsolutions.common.model.Units.picometersToMeters;
//import static java.awt.Color.*;
//
///**
// * This particle represents a single indivisible spherical particle.
// *
// * @author Sam Reid
// */
//public class SphericalParticle extends Particle {
//    public final double radius;
//


//
//    //This constructor matches the table given in the design doc and to-do doc,
//    public SphericalParticle( double radiusInPM, Color chargeColor, Color atomColor, double charge ) {
//        this( picometersToMeters( radiusInPM ) * SugarAndSaltSolutionsApplication.sizeScale.get(), ZERO, atomColor, charge, chargeColor );
//    }
//
//    public SphericalParticle( double radius, Vector2D position, Color color, double charge ) {
//        this( radius, position, color, charge, null );
//    }
//
//    private SphericalParticle( double radius, Vector2D position, Color color, double charge, Color chargeColor ) {
//        super( position );
//        this.radius = radius;
//        this.color = color;
//        this.charge = charge;
//        this.chargeColor = chargeColor;
//    }
//


