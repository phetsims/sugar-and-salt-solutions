// Copyright 2002-2011, University of Colorado
/**
 * The fluid combination of water and dissolved solutes, sitting on top of any precipitated solid.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'java.awt.Shape' );
  var CompositeProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.CompositeProperty' );
  var Property = require( 'AXON/Property' );
  var DoubleProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.doubleproperty.DoubleProperty' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );

  function Solution( waterVolume, beaker ) {
    //Volume of the solution (water plus dissolved solutes)
    this.volume;
    //Get the shape this water takes in its containing beaker
    this.shape;
    // this.volume = waterVolume.plus( dissolvedSaltVolume, dissolvedSugarVolume );
    this.volume = waterVolume;
    shape = new CompositeProperty( new Function0().withAnonymousClassBody( {
      apply: function() {
        //Assumes the beaker is rectangular
        return beaker.getWaterShape( 0, waterVolume.get() );
      }
    } ), volume );
  }

  return inherit( Object, Solution, {
  } );
} );

