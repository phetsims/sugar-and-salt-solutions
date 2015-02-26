// Copyright 2002-2014, University of Colorado Boulder

/**
 * Marker class to signify which compounds are crystals vs noncrystals.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Compound' );
  var OpenSite = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/OpenSite' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ItemList' );
  var DivisionResult = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/DivisionResult' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Constituent' );
  var Vector2 = require( 'DOT/Vector2' );


  /**
   * Construct the compound from the specified lattice
   * @param {Formula} formula
   * @param {Vector2} position
   * @param {number} spacing
   * @param {number} angle
   * @constructor
   * @abstract
   */
  function Crystal( formula, position, spacing, angle ) {
    Compound.call( this, position, angle );

    //The chemical formula such as NaCl or CaCl2 for purposes of maintaining the
    //formula ratio so the crystal can't become unbalanced
    this.formula = formula;

    //The spacing between components on the lattice
    this.spacing = spacing;

    //Update positions so the lattice position overwrites constituent particle positions
    this.updateConstituentLocations();

    //Direction vectors (non-unit vectors) in the coordinate frame of the lattice, at the right spacing
    //and angle for generating the lattice topology
    //@protected
    this.northUnitVector = new Vector2( 0, 1 ).times( spacing ).rotated( angle );
    this.southUnitVector = new Vector2( 0, -1 ).times( spacing ).rotated( angle );
    this.eastUnitVector = new Vector2( 1, 0 ).times( spacing ).rotated( angle );
    this.westUnitVector = new Vector2( -1, 0 ).times( spacing ).rotated( angle );
  }

  return inherit( Compound, Crystal, {
    /**
     * Create an instance that could bond with the specified original particle for purposes of growing crystals from scratch
     * @param {Particle} original
     * @return {Particle}
     * @abstract
     */
    createPartner: function( original ) {
      throw new Error( 'createPartner should be implemented in descendant classes of Crystal' );
    },

    /**
     * Grow the crystal for the specified number of formula ratios,Returns "true" if successful
     * @param {number} numberFormulaRatios
     * @returns {boolean}
     */
    grow: function( numberFormulaRatios ) {

      //There is a random aspect to crystal growth and in some cases (particularly for the more constrained case of CaCl2's
      //lattice topology).The growth can run into a dead end where it is impossible to add a full formula unit.
      //To handle this problem, try many times to generate a crystal and keep the first one that doesn't run into a dead end
      //If the sim fails to grow a lattice, then the Crystal is cleared and the sim continues to run
      var numTries = 10000;
      for ( var tryIndex = 0; tryIndex < numTries; tryIndex++ ) {
        //Grow the full crystal
        var success = this.growRandomly( numberFormulaRatios );
        if ( success ) {
          return true;
        }
        else {
          //If there was a dead end, clear this crystal and try again
          console.log( "crystal growth failed: tryIndex = " + tryIndex );
          while ( this.numberConstituents() > 0 ) {
            this.removeConstituent( this.getConstituent( 0 ) );
          }
        }
      }
      //No success after numTries tries, so signify a failure (shouldn't happen unless you have an unusual lattice structure)
      return false;
    },

    /**
     * Grow the entire crystal for the specified number of formula ratios, fails if it runs into a dead end.
     * In that case it should be re-run.Returns "true" if successful
     * @private
     * @param {number} numberFormulaRatios
     * @returns {boolean}
     */
    growRandomly: function( numberFormulaRatios ) {
      for ( var i = 0; i < numberFormulaRatios; i++ ) {
        var success = this.growByOneFormulaUnit();
        if ( !success ) {
          //Indicate a failure immediately if we couldn't even grow by one formula unit
          return false;
        }
      }
      //All steps completed, so signify successful
      return true;
    },

    /**
     * Grow the crystal randomly at one of the open sites by adding a full formula (such as 1 Ca and 2Cl for CaCl2)
     * Returns "true" if successful
     * If it is impossible to continue growing the crystal then exit by returning false
     * @returns {boolean}
     */
    growByOneFormulaUnit: function() {
      var self = this;
      _.each( self.formula.getFormulaUnit(), function( type ) {
        if ( self.constituents.length === 0 ) {
          self.addConstituent( new Constituent( self.createConstituentParticle( type ), new Vector2() ) );
        }
        else {
          //find any particle that has open bonds
          var openSites = self.getOpenSites().filter( function( site ) {
            return site.matches( type );
          } );

          if ( openSites.length > 0 ) {
            var randIndex = _.random( openSites.length - 1 );
            var randSite = openSites.get( randIndex );
            self.addConstituent( randSite.toConstituent() );
          }
          else {
            return false;
          }
        }
      } );
      return true;
    },

    /**
     * Determine all of the available locations where an existing particle could be added
     * @returns {ItemList<OpenSite>}
     */
    getOpenSites: function() {
      var bondingSites = new ItemList();
      var self = this;
      this.constituents.forEach( function( constituent ) {
        _.each( self.getPossibleDirections( constituent ), function( direction ) {
          var relativePosition = constituent.relativePosition.plus( direction );
          if ( !self.isOccupied( relativePosition ) ) {
            var opposite = self.createPartner( constituent.particle );
            var absolutePosition = relativePosition.plus( self.getPosition() );
            opposite.setPosition( absolutePosition );
            bondingSites.add( new OpenSite( relativePosition, opposite.getShape(), function() {
              return self.createPartner( constituent.particle );
            }, absolutePosition ) );
          }
        } );
      } );
      return bondingSites;
    },

    /**
     * This method gets the possible directions in which the crystal can be grown from the given constituent.
     * The default implementation here is a dense square lattice, like a checkerboard
     * This method is overrideable so that other crystal types like CaCl2 can specify their own topology
     * This may not generalize to non-square lattice topologies, but is sufficient for all currently requested crystal types
     * for sugar and salt solutions
     *
     * @param {Constituent} constituent
     * @returns {Array<Vector2>}
     */
    getPossibleDirections: function( constituent ) {
      return [ this.northUnitVector, this.southUnitVector, this.eastUnitVector, this.westUnitVector ];
    },

    /**
     * Determine whether the specified location is available for bonding or already occupied by another particle
     * @param location
     * @returns {boolean}
     */
    isOccupied: function( location ) {
      return this.getConstituentAtLocation( location ) ? true : false;  // mimicking isSome TODO
    },

    /**
     * Find the constituent at the specified location, if any
     * @param {Vector2} location
     * @returns {Constituent | null}
     */
    getConstituentAtLocation: function( location ) {
      var self = this;
      var atLocation = this.constituents.filter( function( constituent ) {
        return constituent.relativePosition.minus( location ).magnitude() < self.spacing / 100;
      } );

      //Check to make sure there weren't too many at the specified location.  If so, this was an error during crystal growth.
      if ( atLocation.length > 1 ) {
        //It has been difficult to identify the cause of this case, so we also overrode addConstituent to check for errors
        //during the build process
        var err = new Error( "Too many particles at the same location, getting one of them randomly" );
        console.log( err.stack );
        var index = _.random( atLocation.length );
        return atLocation.get( index );
      }
      else if ( atLocation.length === 0 ) {
        return null;
      }
      else {
        return atLocation.get( 0 );
      }
    },

    /**
     * @override
     * Overriden to check for errors during the assembly process
     * @param {Constituent} constituent
     */
    addConstituent: function( constituent ) {
      Compound.prototype.addConstituent.call( this, constituent );
      //Make sure the constituent at the location is the one and only one we just added, otherwise it will cause an
      //error by putting two constituents at the same lattice site
      var atLocation = this.getConstituentAtLocation( constituent.relativePosition );
      if ( atLocation === constituent ) {
        //All is well
      }
      else {
        //Error during the build process, print an exception with the stack trace so we can find out
        //which step in crystal constriction caused the problem
        var err = new Error( "Wrong constituent during add process" );
        console.log( err.stack );
      }
    },

    /**
     * Create the first constituent particle in a crystal
     * @protected
     * @param {function} type
     */
    createConstituentParticle: function( type ) {
      throw new Error( 'createConstituentParticle should be implemented in descendant classes of Crystal' );
    },

    /**
     * Choose a set of particles to dissolve from the crystal according to the
     * formula ratio (e.g. NaCl = 1 Na + 1 Cl or CaCl2 = 1 Ca + 2 Cl) so the crystal and solution will remain balanced
     * @param {Bounds2} waterBounds
     * @returns {Array<Constituent>|null}
     */
    getConstituentsToDissolve: function( waterBounds ) {
      var self = this;
      //For each type, get as many components as are specified in the formula
      var toDissolve = []; //Array<Constituent>
      _.each( this.formula.getFormulaUnit(), function( type ) {
        var constituentToDissolve = self.getConstituentToDissolve( type, waterBounds, toDissolve );
        if ( !constituentToDissolve ) {
          //If couldn't dissolve all elements of formula, then don't dissolve any
          return null;
        }
        else {
          toDissolve.push( constituentToDissolve );
        }
      } );
      return toDissolve;
    },
    //Choose a particle of the specified type, to be dissolved off the crystal used by
    // getConstituentsToDissolve to ensure it dissolves according to the formula ratio
    /**
     *
     * @param type
     * @param waterBounds
     * @param {Array<Constituent>} ignore
     * @returns {Constituent|null}
     */
    getConstituentToDissolve: function( type, waterBounds, ignore ) {

      var self = this;
      //Only consider particles that are completely submerged because it would be incorrect for particles outside of the fluid to
      //suddenly disassociate from the crystal
      //Also make sure it is the requested type (to match formula ratio), and make sure it hasn't already been flagged for removal
      var c = _.chain( this.constituents.getArray() ).
        filter( function( constituent ) {
          return waterBounds.contains( constituent.particle.getShape().bounds );
        } ).filter( function( constituent ) {
          return constituent.particle instanceof type;
        } ).filter( function( constituent ) {
          return !_.contains( ignore, constituent );
        } ).value();

      //Make sure list not empty after filtering based on desired type
      if ( c.length > 0 ) {

        //Find the smallest number of bonds of any of the particles
        var minBonds = self.getNumBonds( _.min( c, function( constituent ) {
          self.getNumBonds( constituent );
        } ) );

        //Only consider particles with the smallest number of bonds since they are closest to the edge
        c = _.filter( c, function( constituent ) {
          return self.getNumBonds( constituent ) === minBonds;
        } );

        //Sort by y-value so that particles are taken from near the top instead of from the
        // bottom (which would cause the crystal to fall)
        c = _.sortBy( c, function( constituent ) {
          return constituent.particle.getPosition().y;
        } );

        console.log( "Crystal num components = " + c.length );
        for ( var i = 0; i < c.length; i++ ) {
          console.log( "" + i + ": " + self.getNumBonds( c[ i ] ) );
        }
        console.log( "END crystal" );

        //Return the highest item
        if ( c.length > 0 ) {
          return c[ c.length - 1 ];
        }
      }
      return null;
    },

    /**
     * Determine whether all constituents in the crystal can be reached from all others.
     * If not, there is a hole in the lattice and the crystal should be dissolved.
     * @returns {boolean}
     */
    isConnected: function() {
      var self = this;
      //Empty crystals are not a problem
      if ( _.isEmpty( this.constituents.getArray() ) ) {
        return true;
      }

      //Start with an arbitrary node and try to visit all others
      var toVisit = [];
      var visited = [];
      toVisit.push( this.constituents.get( 0 ) );

      //Traverse any seen nodes and try to visit the entire graph
      while ( !_.isEmpty( toVisit ) ) {

        //Choose an arbitrary node to visit next
        var c = toVisit[ 0 ];
        toVisit = _.without( toVisit, c ); // remove element from array
        visited.push( c );

        //Signify that we should visit each unvisited neighbor
        _.each( self.getNeighbors( c ), function( neighbor ) {
          if ( !_.contains( toVisit, neighbor ) && !_.contains( visited, neighbor ) ) {
            toVisit.push( neighbor );
          }
        } );
      }
      //If we visited the entire graph, the graph is connected
      return visited.length === this.constituents.length;
    },

    /**
     * @private
     * Find the neighbors for the specified constituent
     * @param {Constituent} constituent
     * @returns {Array<Constituent>}
     */
    getNeighbors: function( constituent ) {
      var self = this;
      var neighbors = []; // Array<Constituent>
      _.each( [ this.northUnitVector, this.southUnitVector, this.eastUnitVector, this.westUnitVector ], function( direction ) {
        var constituentAtLocation = self.getConstituentAtLocation( constituent.relativePosition.plus( direction ) );
        if ( constituentAtLocation ) {
          neighbors.push( constituentAtLocation );
        }
      } );
      return neighbors;
    },

    /**
     * Count the number of bonds by which the constituent is attached, so that particles near the
     * edges(instead of near the centers) will be selected for dissolving
     * @param {Constituent} constituent
     * @returns {number}
     */
    getNumBonds: function( constituent ) {
      return this.getNeighbors( constituent ).length;
    },

    /**
     * Check to see if the crystal matches the formula ratio by dividing each constituent count by getting the division results for each, making sure
     * they are the same, and making sure there is no remainder
     * @returns {boolean}
     */
    matchesFormulaRatio: function() {
      var self = this;
      var result = [];
      _.each( self.formula.getTypes(), function( type ) {
        var particles = _.map( self.constituents.getArray(), function( constituent ) {
          return constituent.particle;
        } );

        var count = _.filter( particles, function( particle ) {
          return particle instanceof type;
        } ).length;

        var factor = self.formula.getFactor( type );
        var e = new DivisionResult( count, factor );
        result.push( e );
      } );

      _.uniq( result, function( divisionResult ) {
        //divisionResult's uniqueness is defined by quotient and remainder
        return divisionResult.quotient + "#" + divisionResult.remainder;
      } );
      return result.length === 1 && result[ 0 ].remainder === 0;
    }
  } );
} );
