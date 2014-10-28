// Copyright 2002-2011, University of Colorado
/**
 * Conductivity tester that can be dipped in the water to light a light bulb.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var ArrayList = require( 'java.util.ArrayList' );
  var ImmutableRectangle2D = require( 'edu.colorado.phet.common.phetcommon.math.ImmutableRectangle2D' );
  var Property = require( 'AXON/Property' );
  var SimpleObserver = require( 'edu.colorado.phet.common.phetcommon.util.SimpleObserver' );
  var IConductivityTester = require( 'edu.colorado.phet.common.piccolophet.nodes.conductivitytester.IConductivityTester' );
  var PDimension = require( 'edu.umd.cs.piccolo.util.PDimension' );

  function ConductivityTester( beakerWidth, beakerHeight ) {

    //private
    this.negativeProbeLocation;

    //private
    this.positiveProbeLocation;

    //private
    this.location;

    //private
    this.negativeProbeX;

    //private
    this.positiveProbeX;
    this.defaultProbeY;
    //Size of each probe in meters, corresponds to the side of the red or black object in model coordinates (meters), might need to be changed if we want to make the conductivity tester probes bigger or smaller

    //private
    this.PROBE_SIZE = new PDimension( 0.0125, 0.025 );
    //Listeners

    //private
    this.conductivityTesterListeners = [];
    //True if the user has selected to use the conductivity tester
    this.visible = new Property( false );
    //Brightness value (between 0 and 1)
    this.brightness = new Property( 0.0 ).withAnonymousClassBody( {
      initializer: function() {
        //When brightness changes, forward change events to ConductivityTesterChangeListeners
        addObserver( new SimpleObserver().withAnonymousClassBody( {
          update: function() {
            for ( var conductivityTesterListener in conductivityTesterListeners ) {
              conductivityTesterListener.brightnessChanged();
            }
          }
        } ) );
      }
    } );
    this.shortCircuited = new Property( false );
    //Model shapes corresponding to where the battery and bulb are

    //private
    this.batteryRegion;

    //private
    this.bulbRegion;
    //Note that in the typical usage scenario (dragged out of a toolbox), these values are overriden with other values in SugarAndSaltSolutionsConductivityTesterNode
    defaultProbeY = beakerHeight;
    negativeProbeX = -beakerWidth / 3;
    positiveProbeX = +beakerWidth / 3;
    //Position of the probes, in model coordinates
    negativeProbeLocation = new Vector2( negativeProbeX, defaultProbeY );
    positiveProbeLocation = new Vector2( positiveProbeX, defaultProbeY );
    //Set the initial position
    location = new Vector2( 0, defaultProbeY );
  }

  return inherit( Object, ConductivityTester, {
//Determine if the conductivity tester is visible
    isVisible: function() {
      return visible.get();
    },
//Add a listener
    addConductivityTesterChangeListener: function( conductivityTesterChangeListener ) {
      conductivityTesterListeners.add( conductivityTesterChangeListener );
    },
//Determine the size of the probes in meters
    getProbeSizeReference: function() {
      return PROBE_SIZE;
    },
//Returns the region in space occupied by the positive probe, used for hit detection with the entire probe region
    getPositiveProbeRegion: function() {
      return new ImmutableRectangle2D( positiveProbeLocation.getX() - getProbeSizeReference().getWidth() / 2, positiveProbeLocation.getY(), getProbeSizeReference().getWidth(), getProbeSizeReference().getHeight() );
    },
//Returns the region in space occupied by the negative probe, used for hit detection with the entire probe region
    getNegativeProbeRegion: function() {
      return new ImmutableRectangle2D( negativeProbeLocation.getX() - getProbeSizeReference().getWidth() / 2, negativeProbeLocation.getY(), getProbeSizeReference().getWidth(), getProbeSizeReference().getHeight() );
    },
//Determine the location of the positive probe
    getPositiveProbeLocationReference: function() {
      return positiveProbeLocation;
    },
//Determine the location of the bulb/battery unit.
    getLocationReference: function() {
      return location;
    },
//Set the location of the positive probe and notify observers
    setPositiveProbeLocation: function( x, y ) {
      positiveProbeLocation.setLocation( x, y );
      for ( var listener in conductivityTesterListeners ) {
        listener.positiveProbeLocationChanged();
      }
    },
//Get the location of the negative probe
    getNegativeProbeLocationReference: function() {
      return negativeProbeLocation;
    },
//Set the location of the negative probe and notify observers
    setNegativeProbeLocation: function( x, y ) {
      negativeProbeLocation.setLocation( x, y );
      for ( var listener in conductivityTesterListeners ) {
        listener.negativeProbeLocationChanged();
      }
    },
//Get the bulb brightness, a function of the conductivity of the liquid.  This method is necessary so that ConductivityTester can implement the getBrightness method in IConductivityTester
    getBrightness: function() {
      return brightness.get();
    },
    reset: function() {
      visible.reset();
      brightness.reset();
      //Reset the location of the probes
      setNegativeProbeLocation( negativeProbeX, defaultProbeY );
      setPositiveProbeLocation( positiveProbeX, defaultProbeY );
    },
//Sets the location of the unit (battery + bulb) and notifies listeners
    setLocation: function( x, y ) {
      location.setLocation( x, y );
      for ( var listener in conductivityTesterListeners ) {
        listener.locationChanged();
      }
    },
//Setters and getters for the battery region, set by the view since bulb and battery are primarily view components. Used to determine if the circuit should short out.
    setBatteryRegion: function( shape ) {
      this.batteryRegion = shape;
    },
    getBatteryRegion: function() {
      return batteryRegion;
    },
//Setters and getters for the bulb region, set by the view since bulb and battery are primarily view components.  Used to determine if the circuit should short out.
    setBulbRegion: function( shape ) {
      this.bulbRegion = shape;
    },
    getBulbRegion: function() {
      return bulbRegion;
    }
  } );
} );

