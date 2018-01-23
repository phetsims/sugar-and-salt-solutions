// Copyright 2014-2017, University of Colorado Boulder
/**
 * Provides physical locations (positions) of the atoms within a molecule.
 * Positions sampled from a 2d rasterized view from JMol with ProjectorUtil
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var AtomPosition = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/AtomPosition' );
  var Carbon = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Carbon' );
  var Hydrogen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Hydrogen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NeutralOxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/NeutralOxygen' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/SphericalParticle' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {string} text
   * @param {number} scale
   * @constructor
   */
  function ProjectedPositions( text, scale ) {
    //@private Raw text to be parsed
    this.text = text;

    //@private conversion factor from pixels to model units (meters)
    this.scale = scale;
  }

  sugarAndSaltSolutions.register( 'ProjectedPositions', ProjectedPositions );

  return inherit( Object, ProjectedPositions, {

    /**
     * Get the positions for a specific list of atom types.
     * @returns {Array<AtomPosition>}
     */
    getAtoms: function() {
      var list = [];
      var self = this;
      _.each( this.text.split( '\n' ), function( row ) {
        //Iterate over the list and convert each line to an atom instance
        list.push( self.parseAtom( row ) );
      } );
      return list;
    },

    /**
     * @private
     * @param position
     * @returns {Vector2}
     */
    toModel: function( position ) {
      return position.minus( this.getOrigin() ).times( this.scale );
    },

    /**
     * Use the position of the first atom as the origin, which other positions will be based on.
     * Origin is in pixel coordinates and converted to model coordinates in toModel
     * @returns {Vector2}
     */
    getOrigin: function() {
      var line = ( this.text.substring( 0, this.text.indexOf( '\n' ) ) );
      return this.readPosition( line );
    },

    /**
     * Refactored position reading function into a common code - Ashraf
     * @param {string} line
     * @returns {Vector2}
     */
    readPosition: function( line ) {
      var items = line.split( ',' );
      //Read the type and location
      var x = +items[ 0 ].split( ' ' )[ 1 ];
      var y = +items[ 1 ];

      assert && assert( !isNaN( x ), 'x should be a number' );
      assert && assert( !isNaN( y ), 'y should be a number' );
      return new Vector2( x, y );
    },


    /**
     * Reads a line from the string and converts to an Atom instance at the right model location
     * @param {string} line
     * @returns {AtomPosition}
     */
    parseAtom: function( line ) {

      var items = line.split( ',' );

      //Read the type and location
      var type = items[ 0 ].split( ' ' )[ 0 ]; // TODO remove duplicate Ashraf
      var x = +items[ 0 ].split( ' ' )[ 1 ];
      var y = +items[ 1 ].trim().split( ' ' )[ 0 ]; // drop "charge" when it exists

      //For showing partial charges on sucrose, read from the file from certain atoms that have a charge
      //http://www.chemistryland.com/CHM130W/LabHelp/Experiment10/Exp10.html
      var charge = '';
      if ( items[ 2 ] ) {
        charge = items[ 2 ];
      }

      //Add an atom instance based on the type, location and partial charge (if any)
      var finalCharge = charge;

      assert && assert( !isNaN( x ), 'x should be a number' );
      assert && assert( !isNaN( y ), 'y should be a number' );
      var atomPosition = new AtomPosition( type, this.toModel( new Vector2( x, y ) ) );

      //override
      atomPosition.createConstituent = function() {
        if ( type === 'H' ) {
          var hydrogen = new Hydrogen();

          //override
          hydrogen.getPartialChargeDisplayValue = function() {
            if ( finalCharge.equals( 'charge' ) ) {
              return SphericalParticle.prototype.getPartialChargeDisplayValue.call( this );
            }
            else { return 0.0; }
          };
          return hydrogen;
        }
        if ( type === 'C' ) {
          var carbon = new Carbon();
          //override
          carbon.getPartialChargeDisplayValue = function() {
            //All the charged carbons have a partial positive charge,
            //see http://www.chemistryland.com/CHM130W/LabHelp/Experiment10/Exp10.html
            if ( finalCharge.equals( 'charge' ) ) { return 1.0; }
            else { return 0.0; }
          };
          return carbon;
        }
        if ( type === 'O' ) {
          var neutralOxygen = new NeutralOxygen();
          neutralOxygen.getPartialChargeDisplayValue = function() {
            if ( finalCharge.equals( 'charge' ) ) {
              return SphericalParticle.prototype.getPartialChargeDisplayValue.call( this );
            }
            else { return 0.0; }
          };
          return neutralOxygen;
        }
      };
      return atomPosition;
    }

  } );

} );
