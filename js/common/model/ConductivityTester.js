//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Conductivity tester that can be dipped in the water to light a light bulb.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );


  function ConductivityTester( beaker ) {
    var thisTester = this;
    this.beaker = beaker;
    //Note that in the typical usage scenario (dragged out of a toolbox), these values are overriden with
    //other values in SugarAndSaltSolutionsConductivityTesterNode
    PropertySet.call( thisTester, {
      brightness: 0,//Brightness value (between 0 and 1)
      visible: false, //True if the user has selected to use the conductivity tester
      shortCircuited: false
    } );

    this.brightnessProperty.link( function( brightness ) {
      console.log( "brightness changed " + brightness );
    } );

  }

  return inherit( PropertySet, ConductivityTester, {
    /**
     * Get the bulb brightness, a function of the conductivity of the liquid.
     * @returns {number}
     */
    getBrightness: function() {
      return this.brightness;
    },

    reset: function() {
      PropertySet.prototype.reset.call( this );
    },

    /**
     * Sets the location of the unit (battery + bulb) and notifies listeners
     * @param {number} x
     * @param {number} y
     */
    setLocation: function( x, y ) {
      this.location.setXY( x, y );

    }
  } );
} );


//// Copyright 2002-2011, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.awt.Shape;
//import java.awt.geom.Point2D;
//import java.util.ArrayList;
//
//import edu.colorado.phet.common.phetcommon.math.ImmutableRectangle2D;
//import edu.colorado.phet.common.phetcommon.model.property.Property;
//import edu.colorado.phet.common.phetcommon.util.SimpleObserver;
//import edu.colorado.phet.common.piccolophet.nodes.conductivitytester.IConductivityTester;
//import edu.umd.cs.piccolo.util.PDimension;
//
///**
// *
// *
// * @author Sam Reid
// */
//public class ConductivityTester implements IConductivityTester {
//
//    private final Point2D.Double negativeProbeLocation;
//    private final Point2D.Double positiveProbeLocation;
//    private final Point2D.Double location;
//    private final double negativeProbeX;
//    private final double positiveProbeX;
//    final double defaultProbeY;
//

//
//    public ConductivityTester( double beakerWidth, double beakerHeight ) {

//    }
//
//    //Listeners
//    private final ArrayList<ConductivityTesterChangeListener> conductivityTesterListeners = new ArrayList<ConductivityTesterChangeListener>();
//

//


//
//    //Model shapes corresponding to where the battery and bulb are
//    private Shape batteryRegion;
//    private Shape bulbRegion;
//
//    //Determine if the conductivity tester is visible
//    public boolean isVisible() {
//        return visible.get();
//    }
//
//    //Add a listener
//    public void addConductivityTesterChangeListener( ConductivityTesterChangeListener conductivityTesterChangeListener ) {
//        conductivityTesterListeners.add( conductivityTesterChangeListener );
//    }
//
//    //Determine the size of the probes in meters
//    public PDimension getProbeSizeReference() {
//        return PROBE_SIZE;
//    }
//
//    //Returns the region in space occupied by the positive probe, used for hit detection with the entire probe region
//    public ImmutableRectangle2D getPositiveProbeRegion() {
//        return new ImmutableRectangle2D( positiveProbeLocation.getX() - getProbeSizeReference().getWidth() / 2, positiveProbeLocation.getY(),
//                                         getProbeSizeReference().getWidth(), getProbeSizeReference().getHeight() );
//    }
//
//    //Returns the region in space occupied by the negative probe, used for hit detection with the entire probe region
//    public ImmutableRectangle2D getNegativeProbeRegion() {
//        return new ImmutableRectangle2D( negativeProbeLocation.getX() - getProbeSizeReference().getWidth() / 2, negativeProbeLocation.getY(),
//                                         getProbeSizeReference().getWidth(), getProbeSizeReference().getHeight() );
//    }
//
//    //Determine the location of the positive probe
//    public Point2D getPositiveProbeLocationReference() {
//        return positiveProbeLocation;
//    }
//
//    //Determine the location of the bulb/battery unit.
//    public Point2D getLocationReference() {
//        return location;
//    }
//

//
//    //Get the location of the negative probe
//    public Point2D getNegativeProbeLocationReference() {
//        return negativeProbeLocation;
//    }

//

//
//    //Setters and getters for the battery region, set by the view since bulb and battery are primarily view components. Used to determine if the circuit should short out.
//    public void setBatteryRegion( Shape shape ) {
//        this.batteryRegion = shape;
//    }
//
//    public Shape getBatteryRegion() {
//        return batteryRegion;
//    }
//
//    //Setters and getters for the bulb region, set by the view since bulb and battery are primarily view components.  Used to determine if the circuit should short out.
//    public void setBulbRegion( Shape shape ) {
//        this.bulbRegion = shape;
//    }
//
//    public Shape getBulbRegion() {
//        return bulbRegion;
//    }
//}
