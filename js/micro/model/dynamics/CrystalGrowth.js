// Copyright 2002-2012, University of Colorado
/**
 * This class handles incremental crystallization of particles when the concentration surpasses the saturation point.
 * I originally tried just specifying the "T extends particle" generic type and using Crystal
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Collections = require( 'java.util.Collections' );
  var Comparator = require( 'java.util.Comparator' );
  var Random = require( 'java.util.Random' );
  var Logger = require( 'java.util.logging.Logger' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var LoggingUtils = require( 'edu.colorado.phet.common.phetcommon.util.logging.LoggingUtils' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var Crystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Crystal' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var OpenSite = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/OpenSite' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var FREE_PARTICLE_SPEED = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/dynamics/UpdateStrategy/FREE_PARTICLE_SPEED' );//static
  var sort = require( 'java.util.Collections.sort' );//static


  //private
  var LOGGER = LoggingUtils.getLogger( CrystalGrowth.class.getCanonicalName() );

  function CrystalGrowth( model, crystals ) {
    //Keep track of the last time a crystal was formed so that they can be created gradually instead of all at once

    //private
    this.lastNewCrystalFormationTime;
    //The main model for timing and adding/removing particles and crystals
    this.model;
    //The list of all crystals of the appropriate type

    //private
    this.crystals;
    //Randomness for crystal formation times and which crystals to bond to

    //private
    this.random = new Random();
    this.model = model;
    this.crystals = crystals;
  }

  return inherit( Object, CrystalGrowth, {
//Check to see whether it is time to create or add to existing crystals, if the solution is over saturated
    allowCrystalGrowth: function( dt, saturated ) {
      var timeSinceLast = model.getTime() - lastNewCrystalFormationTime;
      //Require some time to pass since each crystallization event so it isn't too jumpy (but if water below threshold, then proceed quickly or it will look unphysical as each ion jumps to the crystal one after the other
      var elapsedTimeLongEnough = timeSinceLast > 0.1 || model.isWaterBelowCrystalThreshold();
      //Form new crystals or add on to existing crystals
      if ( (saturated.get() || model.isWaterBelowCrystalThreshold()) && elapsedTimeLongEnough ) {
        lastNewCrystalFormationTime = model.getTime();
        if ( crystals.size() == 0 ) {
          //Create a crystal if there weren't any
          LOGGER.fine( "No crystals, starting a new one, num crystals = " + crystals.size() );
          towardNewCrystal( dt );
        }
        else //If the solution is saturated, try adding on to an existing crystal
        {
          //Randomly choose an existing crystal to possibly bond to
          var crystal = crystals.get( random.nextInt( crystals.size() ) );
          //Find a good configuration to have the particles move toward, should be the closest one so that it can easily be found again in subsequent steps
          var targetConfiguration = getTargetConfiguration( crystal );
          if ( targetConfiguration != null ) {
            //With some probability, form a new crystal anyways (if there aren't too many crystals)
            if ( random.nextDouble() > 0.8 && crystals.size() <= 2 ) {
              LOGGER.fine( "Random choice to form new crystal instead of joining another" );
              towardNewCrystal( dt );
            }
            else //And fixes many problems in crystallization, including large or unbalanced concentrations
            if ( targetConfiguration.distance <= FREE_PARTICLE_SPEED * dt * 1000 ) {
              for ( var match in targetConfiguration.getMatches() ) {
                //Remove the particle from the list of free particles
                model.freeParticles.remove( match.particle );
                //Add it as a constituent of the crystal
                crystal.addConstituent( new Constituent( match.particle, match.site.relativePosition ) );
              }
            }
            else //Otherwise, move matching particles closer to the target location
            if ( targetConfiguration.distance <= model.beaker.getWidth() / 2 ) {
              for ( var match in targetConfiguration.getMatches() ) {
                match.particle.velocity.set( match.site.absolutePosition.minus( match.particle.getPosition() ).getInstanceOfMagnitude( FREE_PARTICLE_SPEED ) );
              }
            }
            else {
              LOGGER.fine( "Best match was too far away (" + targetConfiguration.distance / model.beaker.getWidth() + " beaker widths, so trying to form new crystal from lone ions" );
              towardNewCrystal( dt );
            }
          }
          else //No matches, so start a new crystal
          {
            LOGGER.fine( "No matches, starting a new crystal" );
            towardNewCrystal( dt );
          }
        }
      }
    },
//Look for a place for each member of an entire formula unit to bind to the pre-existing crystal
    getTargetConfiguration: function( crystal ) {
      var matches = [];
      //Keep track of which particles have already been selected so one isn't given two goals
      var usedParticles = [];
      //Keep track of which locations have already been used, in CaCl2 this prevents two Cls from taking the same spot
      var usedLocations = [];
      //Iterate over all members of the formula
      for ( var type in crystal.formula.getFormulaUnit() ) {
        //Find the best match for this member of the formula ratio, but ignoring the previously used particles
        var match = findBestMatch( crystal, type, usedParticles, usedLocations );
        //If there was no suitable particle, then exit the routine and signify that crystal growth cannot occur
        if ( match == null ) {
          return null;
        }
        //Otherwise keep the match for its part of the formula unit and signify that the particle should not target another region, and that no other particle can take the same location
        matches.add( match );
        usedParticles.add( match.particle );
        usedLocations.add( match.site.relativePosition );
      }
      return new TargetConfiguration( new ItemList( matches ) );
    },
//Find the best match for this member of the formula ratio, but ignoring the previously used particles

    //private
    findBestMatch: function( crystal, type, usedParticles, usedLocations ) {
      var matches = [];
      //find a particle that will move to this site, make sure the particle matches the desired type and the particle hasn't already been used
      var particlesToConsider = model.freeParticles.filter( type ).filter( new Function1().withAnonymousClassBody( {
        apply: function( particle ) {
          return !usedParticles.contains( particle );
        }
      } ) );
      //Only look for sites that match the type for the component in the formula
      var matchingSites = crystal.getOpenSites().filter( new Function1().withAnonymousClassBody( {
        apply: function( site ) {
          return site.matches( type ) && !usedLocations.contains( site.relativePosition );
        }
      } ) );
      //                        model.solution.shape.get().contains( openSite.shape.getBounds2D() ) &&
      for ( var freeParticle in particlesToConsider ) {
        for ( var openSite in matchingSites ) {
          matches.add( new CrystallizationMatch( freeParticle, openSite ) );
        }
      }
      //Find the closest match
      sort( matches, new Comparator().withAnonymousClassBody( {
        compare: function( o1, o2 ) {
          return Number.compare( o1.distance, o2.distance );
        }
      } ) );
      //Return the match if any
      if ( matches.size() == 0 ) {
        return null;
      }
      else {
        return matches.get( 0 );
      }
    },
//Move nearby matching particles closer together, or, if close enough, form a 2-particle crystal with them

    //private
    towardNewCrystal: function( dt ) {
      //Find the pair of particles closest to each other, and move them even closer to each other.  When they are close enough, form the crystal
      var seeds = getAllSeeds();
      sort( seeds, new Comparator().withAnonymousClassBody( {
        compare: function( o1, o2 ) {
          return Number.compare( o1.getDistance(), o2.getDistance() );
        }
      } ) );
      //If they are close enough, convert them into a crystal
      if ( seeds.size() > 0 ) {
        var closestSet = seeds.get( 0 );
        closestSet.moveTogether( dt );
        if ( closestSet.getDistance() <= dt * UpdateStrategy.FREE_PARTICLE_SPEED ) {
          convertToCrystal( closestSet );
          //Record the crystal formation time so new crystals don't form too often
          lastNewCrystalFormationTime = model.getTime();
        }
      }
    },
//Crystal-specific code to generate a list of all matching sets of particles according to the chemical formula,
//these are particles that could form a new crystal, if they are close enough together
    getAllSeeds: function() {},
//Convert the specified particles to a crystal and add the crystal to the model

    //private
    convertToCrystal: function( seed ) {
      var a = seed.getParticles().get( 0 );
      //Create a crystal based on the 'a' particle, then add the 'b' particle as the second constituent
      var crystal = newCrystal( a.getPosition() );
      for ( var particle in seed.getParticles() ) {
        if ( crystal.numberConstituents() == 0 ) {
          crystal.addConstituent( new Constituent( particle, ZERO ) );
        }
        else {
          var selectedSite = getBindingSite( crystal, particle );
          //Add the second particle as the second constituent of the crystal
          if ( selectedSite == null ) {
            LOGGER.fine( "No available sites to bind to, this probably shouldn't have happened." );
          }
          else {
            crystal.addConstituent( new Constituent( particle, selectedSite.relativePosition ) );
          }
        }
        model.freeParticles.remove( particle );
      }
      crystals.add( crystal );
    },

    //private
    getBindingSite: function( crystal, b ) {
      //Choose a site that matches the first particle
      var sites = crystal.getOpenSites();
      Collections.shuffle( sites );
      var selectedSite = null;
      for ( var site in sites ) {
        if ( site.matches( b ) ) {
          selectedSite = site;
          break;
        }
      }
      return selectedSite;
    },
//Create the right subtype of crystal at the specified location.  It will be populated by the convertToCrystal method
    newCrystal: function( position ) {}
  } );
} );

