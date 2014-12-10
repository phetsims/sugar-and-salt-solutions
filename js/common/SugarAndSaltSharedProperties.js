// Copyright 2002-2014, University of Colorado Boulder

/**
 * Class that holds application wide Properties
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';
  //modules
  var Property = require( 'AXON/Property' );

  return {
    //Global property for setting the size for atoms and molecules, since they are supposed to look and act smaller
    //in the Micro tab than in real life.This was designed as a global property since propagating the scale
    //through the object graphs on initialization was much more complex and confusing
    sizeScale: new Property( 1.0 )
   };

} );