// Copyright 2002-2012, University of Colorado
/**
 * Provides physical locations (positions) of the atoms within a molecule.
 * Positions sampled from a 2d rasterized view from JMol with ProjectorUtil
 * <p/>
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var StringTokenizer = require( 'java.util.StringTokenizer' );
  var Vector2 = require( 'DOT/Vector2' );
  var Carbon = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Carbon' );
  var Hydrogen = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Hydrogen' );
  var NeutralOxygen = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/NeutralOxygen' );


  // static class: AtomPosition
  var AtomPosition =
//Data structure that has the type of the atom, its element identifier and the position in model space
    define( function( require ) {
      function AtomPosition( type, position ) {
        this.type;
        this.position;
        this.type = type;
        this.position = position;
      }

      return inherit( Object, AtomPosition, {
//Create the SphericalParticle corresponding to this atom type that can be used in the model
        createConstituent: function() {}
      } );
    } );
  ;
  function ProjectedPositions( text, scale ) {
    //Raw text to be parsed

    //private
    this.text;
    //Conversion factor from pixels to model units (meters)

    //private
    this.scale;
    this.text = text;
    this.scale = scale;
  }

  return inherit( Object, ProjectedPositions, {
//Get the positions for a specific list of atom types.
    getAtoms: function() {
      var list = [];
      var stringTokenizer = new StringTokenizer( text, "\n" );
      //Iterate over the list and convert each line to an atom instance
      while ( stringTokenizer.hasMoreTokens() ) {
        list.add( parseAtom( stringTokenizer.nextToken() ) );
      }
      return list;
    },
//Reads a line from the string and converts to an Atom instance at the right model location

    //private
    parseAtom: function( line ) {
      var st = new StringTokenizer( line, ", " );
      //Read the type and location
      var type = st.nextToken();
      var x = Number.parseDouble( st.nextToken() );
      var y = Number.parseDouble( st.nextToken() );
      //http://www.chemistryland.com/CHM130W/LabHelp/Experiment10/Exp10.html
      var charge = "";
      if ( st.hasMoreTokens() ) {
        charge = st.nextToken();
      }
      //Add an atom instance based on the type, location and partial charge (if any)
      var finalCharge = charge;
      return new AtomPosition( type, toModel( new Vector2( x, y ) ) ).withAnonymousClassBody( {
        createConstituent: function() {
          if ( type.equals( "H" ) ) {
            return new Hydrogen().withAnonymousClassBody( {
              getPartialChargeDisplayValue: function() {
                if ( finalCharge.equals( "charge" ) ) {
                  return super.getPartialChargeDisplayValue();
                }
                else {
                  return 0.0;
                }
              }
            } );
          }
          if ( type.equals( "C" ) ) {
            return new Carbon().withAnonymousClassBody( {
              getPartialChargeDisplayValue: function() {
                //All the charged carbons have a partial positive charge, see http://www.chemistryland.com/CHM130W/LabHelp/Experiment10/Exp10.html
                if ( finalCharge.equals( "charge" ) ) {
                  return 1.0;
                }
                else {
                  return 0.0;
                }
              }
            } );
          }
          if ( type.equals( "O" ) ) {
            return new NeutralOxygen().withAnonymousClassBody( {
              getPartialChargeDisplayValue: function() {
                if ( finalCharge.equals( "charge" ) ) {
                  return super.getPartialChargeDisplayValue();
                }
                else {
                  return 0.0;
                }
              }
            } );
          }
          throw new RuntimeException();
        }
      } );
    },
//Use the position of the first atom as the origin, which other positions will be based on.  Origin is in pixel coordinates and converted to model coordinates in toModel
    getOrigin: function() {
      var st = new StringTokenizer( text.substring( 0, text.indexOf( '\n' ) ), ", " );
      //Throw away the type
      st.nextToken();
      //Read the position
      return new Vector2( Number.parseDouble( st.nextToken() ), Number.parseDouble( st.nextToken() ) );
    },

    //private
    toModel: function( position ) {
      return position.minus( getOrigin() ).times( scale );
    }
  } );
} );

