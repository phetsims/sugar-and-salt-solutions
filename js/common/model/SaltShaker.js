// Copyright 2014-2015, University of Colorado Boulder
/**
 * Model element for the salt shaker, which includes its position and rotation and adds salt to the model when shaken.
 * Shaking (by acceleration and deceleration) along the axis produce salt.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dispenser = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Dispenser' );
  var SugarAndSaltConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var SaltShakerNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SaltShakerNode' );


  /**
   * @param {number} x
   * @param {number} y
   * @param {Beaker} beaker
   * @param {Property<Boolean>} moreAllowed
   * @param {string} name
   * @param {number} distanceScale
   * @param {Property<DispenserType>} selectedType
   * @param {DispenserType} type
   * @param {SugarAndSaltSolutionModel} model
   * @constructor
   */
  function SaltShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    var thisShaker = this;
    Dispenser.call( thisShaker, x, y, Math.PI * 3 / 4, beaker, moreAllowed, name, distanceScale, selectedType, type, model );

    //@private Keep track of how much the salt shaker was shaken, if so, then generate salt on the next updateModel() step
    thisShaker.shakeAmount = 0;

    //@private Keep track of recorded positions when the shaker is translated so we can compute accelerations, which are
    //responsible for shaking out the salt
    this.positions = [];

    moreAllowed.link( function( allowed ) {
        //If the shaker is emptied, prevent spurious grains from coming out the next time it is refilled by setting
        // the shake amount to 0.0 and clearing the sampled positions
        if ( !allowed ) {
          thisShaker.shakeAmount = 0;
          thisShaker.positions = [];
        }
      }
    );

  }

  return inherit( Dispenser, SaltShaker, {
    //Called when the model steps in time, and adds any salt crystals to the sim if the dispenser is pouring
    updateModel: function() {
      //Check to see if we should be emitting salt crystals-- if the shaker was shaken enough
      if ( this.enabled.get() && this.shakeAmount > 0 && this.moreAllowed.get() ) {
        var numCrystals = ( Math.floor( Math.random() * 2 ) + Math.min( this.shakeAmount * 4000, 4 ) );
        for ( var i = 0; i < numCrystals; i++ ) {

          //Determine where the salt should come out
          //Hand tuned to match up with the image, will need to be re-tuned if the image changes
          var randUniform = ( Math.random() - 0.5 ) * 2;
          var outputPoint = this.center.get().plus( Vector2.createPolar( this.dispenserHeight / 2 * 0.8, this.angle.get() - Math.PI / 2 + randUniform * Math.PI / 32 * 1.2 ) );

          //Add the salt to the model
          this.addSalt( this.model, outputPoint, SugarAndSaltConstants.VOLUME_PER_SOLID_MOLE_SALT, this.getCrystalVelocity( outputPoint ) );
          this.shakeAmount = 0.0;
          //don't clear the position array here since the user may still be shaking the shaker
        }
      }
    },
    /**
     * called when Dispenser is dragged
     */
    translate: function() {
      //Only increment the shake amount if the shaker is non-empty, otherwise when it refills it might
      //automatically emit salt even though the user isn't controlling it
      if ( this.moreAllowed.get() ) {
        //Add the new position to the list, but keep the list short so there is no memory leak
        this.positions.push( this.center.get() );
        while ( this.positions.length > 50 ) {
          this.positions.shift();
        }

        //Make sure we have enough data, then compute accelerations of the shaker in the direction of its axis
        //to determine how much to shake out
        if ( this.positions.length >= 20 ) {

          //Average the second derivatives
          var sum = new Vector2();
          var numIterations = 10;
          for ( var i = 0; i < numIterations; i++ ) {
            sum = sum.plus( this.getSecondDerivative( i ) );
          }
          sum = sum.times( 1.0 / numIterations );

          //But only take the component along the axis
          //Have to rotate by 90 degrees since for positions 0 degrees is to the right, but for the shaker 0 degrees is up
          var dist = Math.abs( sum.dot( Vector2.createPolar( 1, this.angle.get() + Math.PI / 2 ) ) );

          //Account for the distance scale so we produce the same amount for micro translations as for macro translations
          dist = dist * this.distanceScale;

          //only add to the shake amount if it was vigorous enough
          if ( dist > 1E-4 ) {
            this.shakeAmount += dist;
          }
        }
      }
    },
    /**
     * @Override
     * Create a SaltShakerNode for display and interaction with this model element
     * @param {ModelViewTransform2} transform
     * @param {boolean} micro
     * @param {function} constraint
     * @returns {Node}
     */
    createNode: function( transform, micro, constraint ) {
      return new SaltShakerNode( transform, this, micro, constraint );
    },
    /**
     * @protected
     * Adds the salt to the model
     * @param {SugarAndSaltSolutionModel}model
     * @param {Vector2} outputPoint
     * @param {number} volumePerSolidMole
     * @param {Vector2} crystalVelocity
     */
    addSalt: function( model, outputPoint, volumePerSolidMole, crystalVelocity ) {
      throw new Error( 'addSalt should be implemented in descendant classes of SaltShaker .' );
    },
    /**
     * Estimate the acceleration at the specified point in the time series using centered difference approximation
     * @param {number} i
     * @returns {Vector2}
     */
    getSecondDerivative: function( i ) {
      var x0 = this.positions[this.positions.length - 1 - i ];
      var x1 = this.positions[this.positions.length - 2 - i ];
      var x2 = this.positions[this.positions.length - 3 - i ];
      return x0.minus( x1.times( 2 ) ).plus( x2 );
    }
  } );
} );


// Copyright 2002-2015, University of Colorado Boulder
//package edu.colorado.phet.sugarandsaltsolutions.common.model;
//
//import java.awt.geom.Dimension2D;
//import java.awt.geom.Point2D;
//import java.util.ArrayList;
//import java.util.Random;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.util.function.VoidFunction1;
//import edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform;
//import edu.colorado.phet.sugarandsaltsolutions.common.view.SaltShakerNode;
//import edu.umd.cs.piccolo.PNode;
//
//import static edu.colorado.phet.common.phetcommon.math.vector.Vector2D.createPolar;
//import static edu.colorado.phet.sugarandsaltsolutions.macro.model.SoluteModel.VOLUME_PER_SOLID_MOLE_SALT;
//
///**
// * Model element for the salt shaker, which includes its position and rotation and adds salt to the model when shaken.
// * Shaking (by acceleration and deceleration) along the axis produce salt.
// *
// * @author Sam Reid
// */
//public abstract class SaltShaker<T extends SugarAndSaltSolutionModel> extends Dispenser<T> {
//
//    //Some randomness in number of generated crystals when shaken
//    private final Random random = new Random();

//
//    public SaltShaker( double x, double y, Beaker beaker, ObservableProperty<Boolean> moreAllowed, String name, double distanceScale, ObservableProperty<DispenserType> selectedType, DispenserType type, T model ) {
//        super( x, y, Math.PI * 3 / 4, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
//
//    }


//    @Override public void reset() {
//        super.reset();
//        //Additionally make it so it won't emit salt right after reset
//        shakeAmount = 0.0;
//        positions.clear();
//    }
//

//}
