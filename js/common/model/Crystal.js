// Copyright 2002-2012, University of Colorado
/**
 * Marker class to signify which compounds are crystals vs noncrystals.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'KITE/Rectangle' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Collections = require( 'java.util.Collections' );
  var Comparator = require( 'java.util.Comparator' );
  var HashSet = require( 'java.util.HashSet' );
  var List = require( 'java.util.List' );
  var Random = require( 'java.util.Random' );
  var Logger = require( 'java.util.logging.Logger' );
  var Vector2 = require( 'DOT/Vector2' );
  var Option = require( 'edu.colorado.phet.common.phetcommon.util.Option' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var LoggingUtils = require( 'edu.colorado.phet.common.phetcommon.util.logging.LoggingUtils' );
  var DivisionResult = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/DivisionResult' );
  var OpenSite = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/OpenSite' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var min = require( 'java.util.Collections.min' );//static


  //private
  var LOGGER = LoggingUtils.getLogger( Crystal.class.getCanonicalName() );
//Construct the compound from the specified lattice
  function Crystal( formula, position, spacing, angle ) {
    //The chemical formula such as NaCl or CaCl2 for purposes of maintaining the formula ratio so the crystal can't become unbalanced
    this.formula;
    //The spacing between components on the lattice
    this.spacing;
    //Direction vectors (non-unit vectors) in the coordinate frame of the lattice, at the right spacing and angle for generating the lattice topology
    this.northUnitVector;
    this.southUnitVector;
    this.eastUnitVector;
    this.westUnitVector;
    //Randomness for growing the crystal
    this.random = new Random();
    Compound.call( this, position, angle );
    this.formula = formula;
    this.spacing = spacing;
    //Update positions so the lattice position overwrites constituent particle positions
    updateConstituentLocations();
    northUnitVector = new Vector2( 0, 1 ).times( spacing ).getRotatedInstance( angle );
    southUnitVector = new Vector2( 0, -1 ).times( spacing ).getRotatedInstance( angle );
    eastUnitVector = new Vector2( 1, 0 ).times( spacing ).getRotatedInstance( angle );
    westUnitVector = new Vector2( -1, 0 ).times( spacing ).getRotatedInstance( angle );
  }

  return inherit( Compound, Crystal, {
//Create an instance that could bond with the specified original particle for purposes of growing crystals from scratch
    createPartner: function( original ) {},
//Grow the crystal for the specified number of formula ratios
//Returns "true" if successful
    grow: function( numberFormulaRatios ) {
      //If the sim fails to grow a lattice, then the Crystal is cleared and the sim continues to run
      var numTries = 10000;
      for ( var tryIndex = 0; tryIndex < numTries; tryIndex++ ) {
        //Grow the full crystal
        var success = growRandomly( numberFormulaRatios );
        if ( success ) {
          return true;
        }
        else {
          //If there was a dead end, clear this crystal and try again
          console.log( "crystal growth failed: tryIndex = " + tryIndex );
          while ( numberConstituents() > 0 ) {
            removeConstituent( getConstituent( 0 ) );
          }
        }
      }
      //No success after numTries tries, so signify a failure (shouldn't happen unless you have an unusual lattice structure)
      return false;
    },
//Grow the entire crystal for the specified number of formula ratios, fails if it runs into a dead end.  In that case it should be re-run
//Returns "true" if successful

    //private
    growRandomly: function( numberFormulaRatios ) {
      for ( var i = 0; i < numberFormulaRatios; i++ ) {
        var success = growByOneFormulaUnit();
        if ( !success ) {
          //Indicate a failure immediately if we couldn't even grow by one formula unit
          return false;
        }
      }
      //All steps completed, so signify successful
      return true;
    },
//Grow the crystal randomly at one of the open sites by adding a full formula (such as 1 Ca and 2Cl for CaCl2)
//Returns "true" if successful
//If it is impossible to continue growing the crystal then exit by returning false
    growByOneFormulaUnit: function() {
      for ( var type in formula.getFormulaUnit() ) {
        if ( constituents.size() == 0 ) {
          addConstituent( new Constituent( createConstituentParticle( type ), ZERO ) );
        }
        else {
          //find any particle that has open bonds
          var openSites = getOpenSites().filter( new Function1().withAnonymousClassBody( {
            apply: function( site ) {
              return site.matches( type );
            }
          } ) );
          if ( openSites.size() > 0 ) {
            addConstituent( openSites.get( random.nextInt( openSites.size() ) ).toConstituent() );
          }
          else {
            return false;
          }
        }
      }
      return true;
    },
//Determine all of the available locations where an existing particle could be added
    getOpenSites: function() {
      var bondingSites = new ItemList();
      for ( var constituent in new ArrayList( constituents ) ) {
        for ( var direction in getPossibleDirections( constituent ) ) {
          var relativePosition = constituent.relativePosition.plus( direction );
          if ( !isOccupied( relativePosition ) ) {
            var opposite = createPartner( constituent.particle );
            var absolutePosition = relativePosition.plus( getPosition() );
            opposite.setPosition( absolutePosition );
            bondingSites.add( new OpenSite( relativePosition, opposite.getShape(), new Function0().withAnonymousClassBody( {
              apply: function() {
                return createPartner( constituent.particle );
              }
            } ), absolutePosition ) );
          }
        }
      }
      return bondingSites;
    },
//This method gets the possible directions in which the crystal can be grown from the given constituent.
//The default implementation here is a dense square lattice, like a checkerboard
//This method is overrideable so that other crystal types like CaCl2 can specify their own topology
//This may not generalize to non-square lattice topologies, but is sufficient for all currently requested crystal types for sugar and salt solutions
    getPossibleDirections: function( constituent ) {
      return new Vector2[]
      { northUnitVector, southUnitVector, eastUnitVector, westUnitVector }
      ;
    },
//Determine whether the specified location is available for bonding or already occupied by another particle
    isOccupied: function( location ) {
      return getConstituentAtLocation( location ).isSome();
    },
//Find the constituent at the specified location, if any
    getConstituentAtLocation: function( location ) {
      var atLocation = constituents.filter( new Function1().withAnonymousClassBody( {
        apply: function( constituent ) {
          return constituent.relativePosition.minus( location ).magnitude() < spacing / 100;
        }
      } ) );
      //Check to make sure there weren't too many at the specified location.  If so, this was an error during crystal growth.
      if ( atLocation.size() > 1 ) {
        //It has been difficult to identify the cause of this case, so we also overrode addConstituent to check for errors during the build process
        new RuntimeException( "Too many particles at the same location, getting one of them randomly" ).printStackTrace();
        var index = random.nextInt( atLocation.size() );
        return new Option.Some( atLocation.get( index ) );
      }
      else if ( atLocation.size() == 0 ) {
        return new Option.None();
      }
      else {
        return new Option.Some( atLocation.get( 0 ) );
      }
    },
//Overriden to check for errors during the assembly process
    addConstituent: function( constituent ) {
      super.addConstituent( constituent );
      //Make sure the constituent at the location is the one and only one we just added, otherwise it will cause an error by putting two constituents at the same lattice site
      var atLocation = getConstituentAtLocation( constituent.relativePosition );
      if ( atLocation.isSome() && atLocation.get() == constituent ) {
      }
      else {
        //Error during the build process, print an exception with the stack trace so we can find out which step in crystal constriction caused the problem
        new RuntimeException( "Wrong constituent during add process" ).printStackTrace();
      }
    },
//Create the first constituent particle in a crystal
    createConstituentParticle: function( type ) {},
//Choose a set of particles to dissolve from the crystal according to the formula ratio (e.g. NaCl = 1 Na + 1 Cl or CaCl2 = 1 Ca + 2 Cl) so the crystal and solution will remain balanced
    getConstituentsToDissolve: function( waterBounds ) {
      //For each type, get as many components as are specified in the formula
      var toDissolve = [];
      for ( var type in formula.getFormulaUnit() ) {
        var constituentToDissolve = getConstituentToDissolve( type, waterBounds, toDissolve );
        if ( constituentToDissolve == null ) {
          //If couldn't dissolve all elements of formula, then don't dissolve any
          return new Option.None();
        }
        else {
          toDissolve.add( constituentToDissolve );
        }
      }
      return new Option.Some( toDissolve );
    },
//Choose a particle of the specified type, to be dissolved off the crystal used by getConstituentsToDissolve to ensure it dissolves according to the formula ratio
    getConstituentToDissolve: function( type, waterBounds, ignore ) {
      //Also make sure it is the requested type (to match formula ratio), and make sure it hasn't already been flagged for removal
      var c = constituents.filter( new Function1().withAnonymousClassBody( {
        apply: function( constituent ) {
          return waterBounds.contains( constituent.particle.getShape().getBounds2D() );
        }
      } ) ).filter( new Function1().withAnonymousClassBody( {
        apply: function( constituent ) {
          return type.isInstance( constituent.particle );
        }
      } ) ).filter( new Function1().withAnonymousClassBody( {
        apply: function( constituent ) {
          return !ignore.contains( constituent );
        }
      } ) );
      //Make sure list not empty after filtering based on desired type
      if ( c.size() > 0 ) {
        //Find the smallest number of bonds of any of the particles
        var minBonds = getNumBonds( min( c, new Comparator().withAnonymousClassBody( {
          compare: function( o1, o2 ) {
            return Number.compare( getNumBonds( o1 ), getNumBonds( o2 ) );
          }
        } ) ) );
        //Only consider particles with the smallest number of bonds since they are closest to the edge
        c = c.filter( new Function1().withAnonymousClassBody( {
          apply: function( constituent ) {
            return getNumBonds( constituent ) == minBonds;
          }
        } ) );
        //Sort by y-value so that particles are taken from near the top instead of from the bottom (which would cause the crystal to fall)
        Collections.sort( c, new Comparator().withAnonymousClassBody( {
          compare: function( o1, o2 ) {
            return Number.compare( o1.particle.getPosition().getY(), o2.particle.getPosition().getY() );
          }
        } ) );
        LOGGER.fine( "Crystal num components = " + c.size() );
        for ( var i = 0; i < c.size(); i++ ) {
          LOGGER.fine( "" + i + ": " + getNumBonds( c.get( i ) ) );
        }
        LOGGER.fine( "END crystal" );
        //Return the highest item
        if ( c.size() > 0 ) {
          return c.get( c.size() - 1 );
        }
      }
      return null;
    },
//Determine whether all constituents in the crystal can be reached from all others.  If not, there is a hole in the lattice and the crystal should be dissolved.
    isConnected: function() {
      //Empty crystals are not a problem
      if ( constituents.isEmpty() ) {
        return true;
      }
      //Start with an arbitrary node and try to visit all others
      var toVisit = [].withAnonymousClassBody( {
        initializer: function() {
          add( constituents.get( 0 ) );
        }
      } );
      var visited = [];
      //Traverse any seen nodes and try to visit the entire graph
      while ( !toVisit.isEmpty() ) {
        //Choose an arbitrary node to visit next
        var c = toVisit.get( 0 );
        toVisit.remove( c );
        visited.add( c );
        //Signify that we should visit each unvisited neighbor
        for ( var neighbor in getNeighbors( c ) ) {
          if ( !toVisit.contains( neighbor ) && !visited.contains( neighbor ) ) {
            toVisit.add( neighbor );
          }
        }
      }
      //If we visited the entire graph, the graph is connected
      return visited.size() == constituents.size();
    },
//Find the neighbors for the specified constituent

    //private
    getNeighbors: function( constituent ) {
      var neighbors = new ItemList();
      for ( var direction in new Vector2[] { northUnitVector, southUnitVector, eastUnitVector, westUnitVector }
      )
      {
        var option = getConstituentAtLocation( constituent.relativePosition.plus( direction ) );
        if ( option.isSome() ) {
          neighbors.add( option.get() );
        }
      }
      return neighbors;
    },
//Count the number of bonds by which the constituent is attached, so that particles near the edges (instead of near the centers) will be selected for dissolving

    //private
    getNumBonds: function( constituent ) {
      return getNeighbors( constituent ).size();
    },
//Check to see if the crystal matches the formula ratio by dividing each constituent count by getting the division results for each, making sure they are the same, and making sure there is no remainder
    matchesFormulaRatio: function() {
      LOGGER.fine( "Crystal.matchesFormulaRatio" );
      var result = new HashSet();
      for ( var type in formula.getTypes() ) {
        var count = new ItemList( constituents.map( new Function1().withAnonymousClassBody( {
          apply: function( constituent ) {
            return constituent.particle;
          }
        } ) ) ).filter( type ).size();
        var factor = formula.getFactor( type );
        var e = new DivisionResult( count, factor );
        result.add( e );
        LOGGER.fine( e.toString() );
      }
      return result.size() == 1 && result.iterator().next().remainder == 0;
    }
  } );
} );

