// Copyright 2002-2014, University of Colorado Boulder

/**
 * This class handles incremental crystallization of particles when the concentration surpasses the saturation point.
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/Constituent' );
  var DynamicsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/DynamicsConstants' );
  var CrystallizationMatch = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/CrystallizationMatch' );
  var TargetConfiguration = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/dynamics/TargetConfiguration' );
  var SugarAndSalSolutionsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltConstants' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ItemList' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {MicroModel} model
   * @param {ItemList} crystals
   * @constructor
   */
  function CrystalGrowth( model, crystals ) {

    //@protected
    this.model = model;   //The main model for timing and adding/removing particles and crystals
    //@private
    this.crystals = crystals; //The list of all crystals of the appropriate type

    //Keep track of the last time a crystal was formed so that they can be created gradually instead of all at once
    this.lastNewCrystalFormationTime = 0;
  }

  return inherit( Object, CrystalGrowth, {
    /**
     * Check to see whether it is time to create or add to existing crystals, if the solution is over saturated
     * @param {number} dt
     * @param {Property<boolean>} saturated
     */
    allowCrystalGrowth: function( dt, saturated ) {
      var timeSinceLast = this.model.getTime() - this.lastNewCrystalFormationTime;

      //Require some time to pass since each crystallization event so it isn't too jumpy (but if water below threshold,
      //then proceed quickly or it will look unphysical as each ion jumps to the crystal one after the other
      var elapsedTimeLongEnough = timeSinceLast > 0.1 || this.model.isWaterBelowCrystalThreshold();

      //Form new crystals or add on to existing crystals
      if ( ( saturated.get() || this.model.isWaterBelowCrystalThreshold() ) && elapsedTimeLongEnough ) {
        this.lastNewCrystalFormationTime = this.model.getTime();
        if ( this.crystals.length === 0 ) {
          //Create a crystal if there weren't any
          if ( SugarAndSalSolutionsConstants.DEBUG ) {
            console.log( "No crystals, starting a new one, num crystals = " + this.crystals.length );
          }
          this.towardNewCrystal( dt );
        }
        //If the solution is saturated, try adding on to an existing crystal
        else {

          //Randomly choose an existing crystal to possibly bond to
          var crystal = this.crystals.get( _.random( this.crystals.length ) );
          //Find a good configuration to have the particles move toward, should be the closest one so that it can
          // easily be found again in subsequent steps
          var targetConfiguration = this.getTargetConfiguration( crystal );
          if ( targetConfiguration ) {
            //With some probability, form a new crystal anyways (if there aren't too many crystals)
            if ( _.random( 1, true ) > 0.8 && this.crystals.length <= 2 ) {
              if ( SugarAndSalSolutionsConstants.DEBUG ) {
                console.log( "Random choice to form new crystal instead of joining another" );
              }
              this.towardNewCrystal( dt );
            }
            //If close enough have all particles from the formula unit join the lattice at the same time.
            //Having a large factor here makes it possible for particles to jump on to crystals quickly
            //And fixes many problems in crystallization, including large or unbalanced concentrations
            else if ( targetConfiguration.distance <= DynamicsConstants.FREE_PARTICLE_SPEED * dt * 1000 ) {
              _.each( targetConfiguration.getMatches(), function( match ) {
                //Remove the particle from the list of free particles
                this.model.freeParticles.remove( match.particle );
                //Add it as a constituent of the crystal
                crystal.addConstituent( new Constituent( match.particle, match.site.relativePosition ) );
              } );
            }
            //Otherwise, move matching particles closer to the target location
            else if ( targetConfiguration.distance <= this.model.beaker.getWidth() / 2 ) {
              _.each( targetConfiguration.getMatches(), function( match ) {
                match.particle.velocity.set( match.site.absolutePosition.minus(
                  match.particle.getPosition() ).magnitude( DynamicsConstants.FREE_PARTICLE_SPEED ) );
              } );
            }
            else {
              if ( SugarAndSalSolutionsConstants.DEBUG ) {
                console.log( "Best match was too far away (" + targetConfiguration.distance / this.model.beaker.getWidth() + " beaker " +
                             "widths, so trying to form new crystal from lone ions" );
              }
              this.towardNewCrystal( dt );
            }
          }

          //No matches, so start a new crystal
          else {
            if ( SugarAndSalSolutionsConstants.DEBUG ) {
              console.log( "No matches, starting a new crystal" );
            }
            this.towardNewCrystal( dt );
          }
        }
      }
    },

    //Look for a place for each member of an entire formula unit to bind to the pre-existing crystal
    /**
     *
     * @param {Crystal} crystal
     * @returns {TargetConfiguration}
     */
    getTargetConfiguration: function( crystal ) {
      var matches = [];//Array<CrystallizationMatch>

      //Keep track of which particles have already been selected so one isn't given two goals
      var usedParticles = [];

      //Keep track of which locations have already been used, in CaCl2 this prevents two Cls from taking the same spot
      var usedLocations = []; //Array<Vector2>

      var self = this;
      //Iterate over all members of the formula
      _.each( crystal.formula.getFormulaUnit(), function( type ) {
        //Find the best match for this member of the formula ratio, but ignoring the previously used particles
        var match = self.findBestMatch( crystal, type, usedParticles, usedLocations );

        //If there was no suitable particle, then exit the routine and signify that crystal growth cannot occur
        if ( !match ) {
          return null;
        }
        //Otherwise keep the match for its part of the formula unit and signify that the particle should not target another region, and that no other particle can take the same location
        matches.push( match );
        usedParticles.push( match.particle );
        usedLocations.push( match.site.relativePosition );
      } );

      return new TargetConfiguration( new ItemList( matches ) );
    },

    /**
     * @private
     * Find the best match for this member of the formula ratio, but ignoring the previously used particles
     * @param {Crystal} crystal
     * @param {function.prototype.constructor<Particle>} type
     * @param {Array<Particles>} usedParticles
     * @param {Array<Vector2>} usedLocations
     * @returns {CrystallizationMatch}
     */
    findBestMatch: function( crystal, type, usedParticles, usedLocations ) {
      var matches = [];

      //find a particle that will move to this site, make sure the particle matches the desired type and the particle
      //hasn't already been used
      var particlesToConsider = this.model.freeParticles.filter( type ).filter( function( particle ) {
          return !_.contains( usedParticles, particle );
        }
      );

      //Only look for sites that match the type for the component in the formula
      var matchingSites = crystal.getOpenSites().filter( function( site ) {
          return site.matches( type ) && !_.contains( usedLocations, site.relativePosition );
        }
      );

      _.each( particlesToConsider, function( freeParticle ) {
        _.each( matchingSites, function( openSite ) {
          matches.push( new CrystallizationMatch( freeParticle, openSite ) );
        } );
      } );

      //Find the closest match
      matches = _.sortBy( matches, function( match ) {
        return match.distance;
      } );

      //Return the match if any
      if ( matches.length === 0 ) {
        return null;
      }
      else {
        return matches[0];
      }
    },

    /**
     * @private
     * Move nearby matching particles closer together, or, if close enough, form a 2-particle crystal with them
     * @param {number} dt
     */
    towardNewCrystal: function( dt ) {
      //Find the pair of particles closest to each other, and move them even closer to each other.
      //When they are close enough, form the crystal
      var seeds = this.getAllSeeds(); //Array<IFormulaUnit>
      seeds = _.sortBy( seeds.getArray(), function( formulaUnit ) {
        return formulaUnit.getDistance();
      } );

      //If there was a match, move the closest particles even closer together
      //If they are close enough, convert them into a crystal
      if ( seeds.length > 0 ) {
        var closestSet = seeds[0];
        closestSet.moveTogether( dt );
        if ( closestSet.getDistance() <= dt * DynamicsConstants.FREE_PARTICLE_SPEED ) {
          this.convertToCrystal( closestSet );

          //Record the crystal formation time so new crystals don't form too often
          this.lastNewCrystalFormationTime = this.model.getTime();
        }
      }
    },

    /**
     * @private
     * Convert the specified particles to a crystal and add the crystal to the model
     * @param {IFormulaUnit} seed
     */
    convertToCrystal: function( seed ) {
      var a = seed.getParticles()[0];
      var self = this;

      //Create a crystal based on the 'a' particle, then add the 'b' particle as the second constituent
      var crystal = this.newCrystal( a.getPosition() );
      _.each( seed.getParticles(), function( particle ) {
        if ( crystal.numberConstituents() === 0 ) {
          crystal.addConstituent( new Constituent( particle, new Vector2() ) );
        }
        else {
          var selectedSite = self.getBindingSite( crystal, particle );
          //Add the second particle as the second constituent of the crystal
          if ( !selectedSite ) {
            if ( SugarAndSalSolutionsConstants.DEBUG ) {
              console.log( "No available sites to bind to, this probably shouldn't have happened." );
            }
          }
          else {
            crystal.addConstituent( new Constituent( particle, selectedSite.relativePosition ) );
          }
        }
        self.model.freeParticles.remove( particle );
      } );
      this.crystals.add( crystal );
    },

    /**
     * @private
     * @param {Crystal} crystal
     * @param {Particle} b
     * @returns {OpenSite}
     */
    getBindingSite: function( crystal, b ) {
      //Choose a site that matches the first particle
      var sites = crystal.getOpenSites(); // ItemList
      sites = _.shuffle( sites.getArray() );
      var selectedSite = null;
      for ( var i = 0; i < sites.length; i++ ) {
        var site = sites[i];
        if ( site.matches( b ) ) {
          selectedSite = site;
          break;
        }
      }
      return selectedSite;
    },

    /**
     * @protected
     * @abstract
     * Create the right subtype of crystal at the specified location.  It will be populated by the convertToCrystal method
     * @param {Vector2} position
     * @return {Crystal}
     */
    newCrystal: function( position ) {
      throw new Error( 'newCrystal should be implemented in descendant classes of CrystalGrowth' );
    },

    /**
     * @protected
     * @abstract
     * Crystal-specific code to generate a list of all matching sets of particles according to the chemical formula,
     * these are particles that could form a new crystal, if they are close enough together
     * @return {Array<IFormulaUnit>}
     */
    getAllSeeds: function() {
      throw new Error( 'getAllSeeds should be implemented in descendant classes of CrystalGrowth' );
    }
  } );
} );


//// Copyright 2002-2012, University of Colorado
//package edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.Comparator;
//import java.util.Random;
//import java.util.logging.Logger;
//
//import edu.colorado.phet.common.phetcommon.math.vector.Vector2D;
//import edu.colorado.phet.common.phetcommon.model.property.ObservableProperty;
//import edu.colorado.phet.common.phetcommon.util.function.Function1;
//import edu.colorado.phet.common.phetcommon.util.logging.LoggingUtils;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Constituent;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Crystal;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.ItemList;
//import edu.colorado.phet.sugarandsaltsolutions.common.model.Particle;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.MicroModel;
//import edu.colorado.phet.sugarandsaltsolutions.micro.model.OpenSite;
//
//import static edu.colorado.phet.common.phetcommon.math.vector.Vector2D.ZERO;
//import static edu.colorado.phet.sugarandsaltsolutions.micro.model.dynamics.UpdateStrategy.FREE_PARTICLE_SPEED;
//import static java.util.Collections.sort;
//
///**

// *
// * @author Sam Reid
// */
//public abstract class CrystalGrowth<T extends Particle, U extends Crystal<T>> {
//

//
//    //The main model for timing and adding/removing particles and crystals
//    protected final MicroModel model;
//
//    //The list of all crystals of the appropriate type
//    private final ItemList<U> crystals;
//
//    //Randomness for crystal formation times and which crystals to bond to
//    private final Random random = new Random();
//
//    private static final Logger LOGGER = LoggingUtils.getLogger( CrystalGrowth.class.getCanonicalName() );
//
//    public CrystalGrowth( MicroModel model, ItemList<U> crystals ) {

//    }
//
//    //Check to see whether it is time to create or add to existing crystals, if the solution is over saturated
//    public void allowCrystalGrowth( double dt, ObservableProperty<Boolean> saturated ) {
//        double timeSinceLast = model.getTime() - lastNewCrystalFormationTime;
//
//        //Require some time to pass since each crystallization event so it isn't too jumpy (but if water below threshold, then proceed quickly or it will look unphysical as each ion jumps to the crystal one after the other
//        boolean elapsedTimeLongEnough = timeSinceLast > 0.1 || model.isWaterBelowCrystalThreshold();
//
//        //Form new crystals or add on to existing crystals
//        if ( ( saturated.get() || model.isWaterBelowCrystalThreshold() ) && elapsedTimeLongEnough ) {
//            lastNewCrystalFormationTime = model.getTime();
//            if ( crystals.size() == 0 ) {
//                //Create a crystal if there weren't any
//                LOGGER.fine( "No crystals, starting a new one, num crystals = " + crystals.size() );
//                towardNewCrystal( dt );
//            }
//
//            //If the solution is saturated, try adding on to an existing crystal
//            else {
//
//                //Randomly choose an existing crystal to possibly bond to
//                Crystal<T> crystal = crystals.get( random.nextInt( crystals.size() ) );
//
//                //Find a good configuration to have the particles move toward, should be the closest one so that it can easily be found again in subsequent steps
//                TargetConfiguration<T> targetConfiguration = getTargetConfiguration( crystal );
//                if ( targetConfiguration != null ) {
//
//                    //With some probability, form a new crystal anyways (if there aren't too many crystals)
//                    if ( random.nextDouble() > 0.8 && crystals.size() <= 2 ) {
//                        LOGGER.fine( "Random choice to form new crystal instead of joining another" );
//                        towardNewCrystal( dt );
//                    }
//
//                    //If close enough have all particles from the formula unit join the lattice at the same time.
//                    //Having a large factor here makes it possible for particles to jump on to crystals quickly
//                    //And fixes many problems in crystallization, including large or unbalanced concentrations
//                    else if ( targetConfiguration.distance <= FREE_PARTICLE_SPEED * dt * 1000 ) {
//
//                        for ( CrystallizationMatch<T> match : targetConfiguration.getMatches() ) {
//
//                            //Remove the particle from the list of free particles
//                            model.freeParticles.remove( match.particle );
//
//                            //Add it as a constituent of the crystal
//                            crystal.addConstituent( new Constituent<T>( match.particle, match.site.relativePosition ) );
//                        }
//                    }
//
//                    //Otherwise, move matching particles closer to the target location
//                    else if ( targetConfiguration.distance <= model.beaker.getWidth() / 2 ) {
//                        for ( CrystallizationMatch<T> match : targetConfiguration.getMatches() ) {
//                            match.particle.velocity.set( match.site.absolutePosition.minus( match.particle.getPosition() ).getInstanceOfMagnitude( FREE_PARTICLE_SPEED ) );
//                        }
//                    }
//
//                    else {
//                        LOGGER.fine( "Best match was too far away (" + targetConfiguration.distance / model.beaker.getWidth() + " beaker widths, so trying to form new crystal from lone ions" );
//                        towardNewCrystal( dt );
//                    }
//                }
//
//                //No matches, so start a new crystal
//                else {
//                    LOGGER.fine( "No matches, starting a new crystal" );
//                    towardNewCrystal( dt );
//                }
//            }
//        }
//    }
//
//    //Look for a place for each member of an entire formula unit to bind to the pre-existing crystal
//    public TargetConfiguration<T> getTargetConfiguration( Crystal<T> crystal ) {
//        ArrayList<CrystallizationMatch<T>> matches = new ArrayList<CrystallizationMatch<T>>();
//
//        //Keep track of which particles have already been selected so one isn't given two goals
//        ArrayList<Particle> usedParticles = new ArrayList<Particle>();
//
//        //Keep track of which locations have already been used, in CaCl2 this prevents two Cls from taking the same spot
//        ArrayList<Vector2D> usedLocations = new ArrayList<Vector2D>();
//
//        //Iterate over all members of the formula
//        for ( Class<? extends Particle> type : crystal.formula.getFormulaUnit() ) {
//
//            //Find the best match for this member of the formula ratio, but ignoring the previously used particles
//            CrystallizationMatch<T> match = findBestMatch( crystal, type, usedParticles, usedLocations );
//
//            //If there was no suitable particle, then exit the routine and signify that crystal growth cannot occur
//            if ( match == null ) {
//                return null;
//            }
//
//            //Otherwise keep the match for its part of the formula unit and signify that the particle should not target another region, and that no other particle can take the same location
//            matches.add( match );
//            usedParticles.add( match.particle );
//            usedLocations.add( match.site.relativePosition );
//        }
//
//        return new TargetConfiguration<T>( new ItemList<CrystallizationMatch<T>>( matches ) );
//    }
//
//    //Find the best match for this member of the formula ratio, but ignoring the previously used particles
//    private CrystallizationMatch<T> findBestMatch( Crystal<T> crystal, final Class<? extends Particle> type,
//                                                   final ArrayList<Particle> usedParticles, final ArrayList<Vector2D> usedLocations ) {
//        ArrayList<CrystallizationMatch<T>> matches = new ArrayList<CrystallizationMatch<T>>();
//
//        //find a particle that will move to this site, make sure the particle matches the desired type and the particle hasn't already been used
//        Iterable<? extends Particle> particlesToConsider = model.freeParticles.filter( type ).filter( new Function1<Particle, Boolean>() {
//            public Boolean apply( Particle particle ) {
//                return !usedParticles.contains( particle );
//            }
//        } );
//
//        //Only look for sites that match the type for the component in the formula
//        ItemList<OpenSite<T>> matchingSites = crystal.getOpenSites().filter( new Function1<OpenSite<T>, Boolean>() {
//            public Boolean apply( OpenSite<T> site ) {
//                return site.matches( type ) && !usedLocations.contains( site.relativePosition );
//            }
//        } );
//
//        //                        model.solution.shape.get().contains( openSite.shape.getBounds2D() ) &&
//        for ( Particle freeParticle : particlesToConsider ) {
//            for ( OpenSite<T> openSite : matchingSites ) {
//                matches.add( new CrystallizationMatch<T>( (T) freeParticle, openSite ) );
//            }
//        }
//
//        //Find the closest match
//        sort( matches, new Comparator<CrystallizationMatch>() {
//            public int compare( CrystallizationMatch o1, CrystallizationMatch o2 ) {
//                return Double.compare( o1.distance, o2.distance );
//            }
//        } );
//
//        //Return the match if any
//        if ( matches.size() == 0 ) {
//            return null;
//        }
//        else {
//            return matches.get( 0 );
//        }
//    }
//
//    //Move nearby matching particles closer together, or, if close enough, form a 2-particle crystal with them
//    private void towardNewCrystal( double dt ) {
//
//        //Find the pair of particles closest to each other, and move them even closer to each other.  When they are close enough, form the crystal
//        ArrayList<IFormulaUnit> seeds = getAllSeeds();
//        sort( seeds, new Comparator<IFormulaUnit>() {
//            public int compare( IFormulaUnit o1, IFormulaUnit o2 ) {
//                return Double.compare( o1.getDistance(), o2.getDistance() );
//            }
//        } );
//
//        //If there was a match, move the closest particles even closer together
//        //If they are close enough, convert them into a crystal
//        if ( seeds.size() > 0 ) {
//            IFormulaUnit closestSet = seeds.get( 0 );
//            closestSet.moveTogether( dt );
//            if ( closestSet.getDistance() <= dt * UpdateStrategy.FREE_PARTICLE_SPEED ) {
//                convertToCrystal( closestSet );
//
//                //Record the crystal formation time so new crystals don't form too often
//                lastNewCrystalFormationTime = model.getTime();
//            }
//        }
//    }
//
//    //Crystal-specific code to generate a list of all matching sets of particles according to the chemical formula,
//    //these are particles that could form a new crystal, if they are close enough together
//    protected abstract ArrayList<IFormulaUnit> getAllSeeds();
//
//    //Convert the specified particles to a crystal and add the crystal to the model
//    private void convertToCrystal( IFormulaUnit<T> seed ) {
//
//        T a = seed.getParticles().get( 0 );
//
//        //Create a crystal based on the 'a' particle, then add the 'b' particle as the second constituent
//        U crystal = newCrystal( a.getPosition() );
//
//        for ( T particle : seed.getParticles() ) {
//
//            if ( crystal.numberConstituents() == 0 ) {
//                crystal.addConstituent( new Constituent<T>( particle, ZERO ) );
//            }
//            else {
//
//                OpenSite<T> selectedSite = getBindingSite( crystal, particle );
//                //Add the second particle as the second constituent of the crystal
//                if ( selectedSite == null ) {
//                    LOGGER.fine( "No available sites to bind to, this probably shouldn't have happened." );
//                }
//                else {
//                    crystal.addConstituent( new Constituent<T>( particle, selectedSite.relativePosition ) );
//                }
//            }
//            model.freeParticles.remove( particle );
//        }
//        crystals.add( crystal );
//    }
//
//    private OpenSite<T> getBindingSite( U crystal, T b ) {
//        //Choose a site that matches the first particle
//        ItemList<OpenSite<T>> sites = crystal.getOpenSites();
//        Collections.shuffle( sites );
//        OpenSite<T> selectedSite = null;
//        for ( OpenSite<T> site : sites ) {
//            if ( site.matches( b ) ) {
//                selectedSite = site;
//                break;
//            }
//        }
//        return selectedSite;
//    }
//
//    //Create the right subtype of crystal at the specified location.  It will be populated by the convertToCrystal method
//    protected abstract U newCrystal( Vector2D position );
//}
