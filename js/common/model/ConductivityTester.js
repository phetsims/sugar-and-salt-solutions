// Copyright 2014-2018, University of Colorado Boulder
/**
 * Conductivity tester that can be dipped in the water to light a light bulb.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  //Size of each probe in meters, corresponds to the side of the red or black object in model coordinates (meters),
  //might need to be changed if we want to make the conductivity tester probes bigger or smaller
  var PROBE_SIZE = new Dimension2( 0.0125, 0.025 );
  // Move the probes down to encourage the user to dip them in the water without
  // dipping the light bulb/battery in the water too, which would short out the circuit
  var PROBE_OFFSET_Y = 0.065;


  /**
   *
   * @param {Beaker} beaker
   * @constructor
   */
  function ConductivityTester( beaker ) {
    this.beaker = beaker;
    var location = new Vector2( 0, 0 );

    this.locationProperty = new Property( location );
    this.negativeProbeLocationProperty = new Property( new Vector2( location.x - 0.03, location.y - PROBE_OFFSET_Y ) );
    this.positiveProbeLocationProperty = new Property( new Vector2( location.x + 0.07, location.y - PROBE_OFFSET_Y ) );
    this.brightnessProperty = new Property( 0 );//Brightness value (between 0 and 1)
    this.visibleProperty = new Property( false ); //True if the user has selected to use the conductivity tester
    this.shortCircuitedProperty = new Property( false );

    //Model bounds corresponding to where the battery and bulb are (set by the view)
    this.batteryRegion = Bounds2.NOTHING;
    this.bulbRegion = Bounds2.NOTHING;
  }

  sugarAndSaltSolutions.register( 'ConductivityTester', ConductivityTester );

  return inherit( Object, ConductivityTester, {
    /**
     * Get the bulb brightness, a function of the conductivity of the liquid.
     * @returns {number}
     */
    getBrightness: function() {
      return this.brightnessProperty.value;
    },

    reset: function() {
      this.locationProperty.reset();
      this.negativeProbeLocationProperty.reset();
      this.positiveProbeLocationProperty.reset();
      this.brightnessProperty.reset();
      this.visibleProperty.reset();
      this.shortCircuitedProperty.reset();
    },

    /**
     * Sets the location of the unit (battery + bulb) and notifies listeners
     *
     */
    setLocation: function( location ) {
      this.locationProperty.value = location;
    },

    /**
     * Determine the size of the probes in meters
     * @returns {Dimension2}
     */
    getProbeSizeReference: function() {
      return PROBE_SIZE;
    },


    /**
     * Setters and getters for the battery region, set by the view since bulb and battery are primarily view components.
     * Used to determine if the circuit should short out.
     * @param {Bounds2} bounds
     */
    setBatteryRegion: function( bounds ) {
      this.batteryRegion = bounds;
    },

    /**
     * @returns {Bounds2}
     */
    getBatteryRegion: function() {
      return this.batteryRegion;
    },


    /**
     * Setters and getters for the bulb region, set by the view since bulb and battery are primarily view components.
     * Used to determine if the circuit should short out.
     * @param {Bounds2} bounds
     */
    setBulbRegion: function( bounds ) {
      this.bulbRegion = bounds;
    },

    /**
     * @returns {Bounds2}
     */
    getBulbRegion: function() {
      return this.bulbRegion;

    },

    /**
     * Returns the region in space occupied by the positive probe, used for hit detection with the entire probe region
     * @returns {Bounds2}
     */
    getPositiveProbeRegion: function() {
      return Bounds2.rect( this.positiveProbeLocationProperty.value.x - this.getProbeSizeReference().width / 2, this.positiveProbeLocationProperty.value.y,
        this.getProbeSizeReference().width, this.getProbeSizeReference().height );
    },

    /**
     * Returns the region in space occupied by the negative probe, used for hit detection with the entire probe region
     * @returns {Bounds2}
     */
    getNegativeProbeRegion: function() {
      return Bounds2.rect( this.negativeProbeLocationProperty.value.x - this.getProbeSizeReference().width / 2, this.negativeProbeLocationProperty.value.y,
        this.getProbeSizeReference().width, this.getProbeSizeReference().height );
    }

  } );

} )
;


// Copyright 2002-2015, University of Colorado Boulder
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

//

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

//}
