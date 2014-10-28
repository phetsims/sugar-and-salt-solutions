// Copyright 2002-2012, University of Colorado
/**
 * Model element for the salt shaker, which includes its position and rotation and adds salt to the model when shaken.
 * Shaking (by acceleration and deceleration) along the axis produce salt.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2D = require( 'java.awt.geom.Dimension2D' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Random = require( 'java.util.Random' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var SaltShakerNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SaltShakerNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var createPolar = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.createPolar' );//static
  var VOLUME_PER_SOLID_MOLE_SALT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/macro/model/SoluteModel/VOLUME_PER_SOLID_MOLE_SALT' );//static

  function SaltShaker( x, y, beaker, moreAllowed, name, distanceScale, selectedType, type, model ) {
    //Some randomness in number of generated crystals when shaken

    //private
    this.random = new Random();
    //Keep track of how much the salt shaker was shaken, if so, then generate salt on the next updateModel() step

    //private
    this.shakeAmount;
    //Keep track of recorded positions when the shaker is translated so we can compute accelerations, which are responsible for shaking out the salt

    //private
    this.positions = [];
    Dispenser.call( this, x, y, Math.PI * 3 / 4, beaker, moreAllowed, name, distanceScale, selectedType, type, model );
    moreAllowed.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( allowed ) {
        //If the shaker is emptied, prevent spurious grains from coming out the next time it is refilled by setting the shake amount to 0.0 and clearing the sampled positions
        if ( !allowed ) {
          shakeAmount = 0;
          positions.clear();
        }
      }
    } ) );
  }

  return inherit( Dispenser, SaltShaker, {
//Translate the dispenser by the specified delta in model coordinates
    translate: function( delta ) {
      super.translate( delta );
      //Only increment the shake amount if the shaker is non-empty, otherwise when it refills it might automatically emit salt even though the user isn't controlling it
      if ( moreAllowed.get() ) {
        //Add the new position to the list, but keep the list short so there is no memory leak
        positions.add( center.get() );
        while ( positions.size() > 50 ) {
          positions.remove( 0 );
        }
        //to determine how much to shake out
        if ( positions.size() >= 20 ) {
          //Average the second derivatives
          var sum = new Vector2();
          var numIterations = 10;
          for ( var i = 0; i < numIterations; i++ ) {
            sum = sum.plus( getSecondDerivative( i ) );
          }
          sum = sum.times( 1.0 / numIterations );
          //Have to rotate by 90 degrees since for positions 0 degrees is to the right, but for the shaker 0 degrees is up
          var dist = Math.abs( sum.dot( createPolar( 1, angle.get() + Math.PI / 2 ) ) );
          //Account for the distance scale so we produce the same amount for micro translations as for macro translations
          dist = dist * distanceScale;
          //only add to the shake amount if it was vigorous enough
          if ( dist > 1E-4 ) {
            shakeAmount += dist;
          }
        }
      }
    },
//Called when the model steps in time, and adds any salt crystals to the sim if the dispenser is pouring
    updateModel: function() {
      //Check to see if we should be emitting salt crystals-- if the shaker was shaken enough
      if ( enabled.get() && shakeAmount > 0 && moreAllowed.get() ) {
        var numCrystals = (random.nextInt( 2 ) + Math.min( shakeAmount * 4000, 4 ));
        for ( var i = 0; i < numCrystals; i++ ) {
          //Hand tuned to match up with the image, will need to be re-tuned if the image changes
          var randUniform = (random.nextDouble() - 0.5) * 2;
          var outputPoint = center.get().plus( createPolar( dispenserHeight / 2 * 0.8, angle.get() - Math.PI / 2 + randUniform * Math.PI / 32 * 1.2 ) );
          //Add the salt to the model
          addSalt( model, outputPoint, VOLUME_PER_SOLID_MOLE_SALT, getCrystalVelocity( outputPoint ) );
          shakeAmount = 0.0;
        }
      }
    },
//Adds the salt to the model
    addSalt: function( model, outputPoint, volumePerSolidMole, crystalVelocity ) {},
//Create a SaltShakerNode for display and interaction with this model element
    createNode: function( transform, micro, constraint ) {
      return new SaltShakerNode( transform, this, micro, constraint );
    },
    reset: function() {
      super.reset();
      //Additionally make it so it won't emit salt right after reset
      shakeAmount = 0.0;
      positions.clear();
    },
//Estimate the acceleration at the specified point in the time series using centered difference approximation

    //private
    getSecondDerivative: function( i ) {
      var x0 = positions.get( positions.size() - 1 - i );
      var x1 = positions.get( positions.size() - 2 - i );
      var x2 = positions.get( positions.size() - 3 - i );
      return x0.minus( x1.times( 2 ) ).plus( x2 );
    }
  } );
} );

