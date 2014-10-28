// Copyright 2002-2012, University of Colorado
/**
 * Model for "water" tab for sugar and salt solutions.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Graphics = require( 'java.awt.Graphics' );
  var Point = require( 'java.awt.Point' );
  var Vector2 = require( 'java.awt.geom.Vector2' );
  var Rectangle = require( 'KITE/Rectangle' );
  var ArrayList = require( 'java.util.ArrayList' );
  var HashMap = require( 'java.util.HashMap' );
  var HashSet = require( 'java.util.HashSet' );
  var IdentityHashMap = require( 'java.util.IdentityHashMap' );
  var Random = require( 'java.util.Random' );
  var JFrame = require( 'javax.swing.JFrame' );
  var Vec2 = require( 'org.jbox2d.common.Vec2' );
  var World = require( 'org.jbox2d.dynamics.World' );
  var DebugDrawJ2D = require( 'org.jbox2d.testbed.framework.DebugDrawJ2D' );
  var TestPanel = require( 'org.jbox2d.testbed.framework.TestPanel' );
  var TestbedSettings = require( 'org.jbox2d.testbed.framework.TestbedSettings' );
  var ImmutableRectangle2D = require( 'edu.colorado.phet.common.phetcommon.math.ImmutableRectangle2D' );
  var Vector2 = require( 'DOT/Vector2' );
  var ConstantDtClock = require( 'edu.colorado.phet.common.phetcommon.model.clock.ConstantDtClock' );
  var Property = require( 'AXON/Property' );
  var Property = require( 'AXON/Property' );
  var Pair = require( 'edu.colorado.phet.common.phetcommon.util.Pair' );
  var Function1 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function1' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var AbstractSugarAndSaltSolutionsModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/AbstractSugarAndSaltSolutionsModel' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Compound' );
  var ItemList = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/ItemList' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/Sucrose' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static

//Thresholds and settings for artificial force on waters to split up salt or sucrose components that are too close to each other

  //private
  var SALT_ION_DISTANCE_THRESHOLD = new SaltIon.ChlorideIon().getShape().getBounds2D().getWidth() * 1.3;

  //private
  var SUCROSE_DISTANCE_THRESHOLD = new Sucrose().getShape().getBounds2D().getWidth();

  //private
  var DEFAULT_NUM_WATERS = 130;
//Coulomb's constant in SI, see http://en.wikipedia.org/wiki/Coulomb's_law

  //private
  var k = 8.987E9;

  function WaterModel() {
    //Lists of all water molecules
    this.waterList = new ItemList();
    //List of all sucrose crystals
    this.sucroseList = new ItemList();
    //List of all salt ions
    this.saltIonList = new ItemList();
    //Listeners who are called back when the physics updates

    //private
    this.frameListeners = [];
    //Box2d world which updates the physics
    this.world;
    //Randomness for laying out and propagating the particles

    //private
    this.random = new Random();
    //Dimensions of the particle window in meters, determines the zoom level in the view as well since it fits to the model particle window
    //Manually tuned until particles were big enough to see but small enough that you could see several but big enough that there wouldn't have to be too many of them

    //private
    this.particleWindowWidth = 1.84E-9;

    //private
    this.particleWindowHeight = particleWindowWidth * 0.65;
    //Dimensions of the particle window in meters, determines the zoom level in the view as well since it fits to the model particle window
    this.particleWindow = new ImmutableRectangle2D( -particleWindowWidth / 2, -particleWindowHeight / 2, particleWindowWidth, particleWindowHeight );
    //Boundary for water's periodic boundary conditions, so that particles don't disappear when they wrap from one side to the other
    //Different boundaries are used for different molecule types so we can keep the number of particles low; the largest molecule is sucrose
    //But if we used the expanded sucrose boundary for water, then we would need lots of extra water out of the visible region
    //This also has the effect of keeping salt ions or sucrose molecules away from the play area once they exit,
    //but that seems preferable to (less confusing than) re-entering the screen from a different direction
    this.waterBoundary = expand( particleWindow, getHalfDiagonal( new WaterMolecule().getShape().getBounds2D() ) );
    this.sucroseBoundary = expand( particleWindow, getHalfDiagonal( new Sucrose().getShape().getBounds2D() ) );
    this.chlorideBoundary = expand( particleWindow, getHalfDiagonal( new SaltIon.ChlorideIon().getShape().getBounds2D() ) );
    //Tuned with discussions with the chemistry team to make interactions strong enough but not too strong
    this.COULOMB_FORCE_SCALE_FACTOR = 1.0E-36;
    //Flag to indicate debugging of removal of water when sucrose added, to keep water density constant

    //private
    this.debugWaterRemoval = false;
    //Width of the box2D model.  Box2D is a physics engine used to drive the dynamics for this tab, see implementation-notes.txt and Box2DAdapter

    //private
    this.box2DWidth = 20;
    //units for water molecules are in SI
    //Beaker floor should be about 40 angstroms, to accommodate about 20 water molecules side-to-side
    //But keep box2d within -10..10 (i.e. 20 boxes wide)
    this.scaleFactor = box2DWidth / particleWindow.width;
    this.modelToBox2D = ModelViewTransform.createSinglePointScaleMapping( new Point(), new Point(), scaleFactor );
    //User settings
    this.showWaterCharges = new Property( false );
    this.showSugarPartialCharge = new Property( false );
    this.showSugarAtoms = new Property( false );
    this.showChargeColor = new Property( false );
    //Developer settings
    //Scale factor that increases the strength of coulomb repulsion/attraction
    this.coulombStrengthMultiplier = new Property( 100.0 );
    //Power in the coulomb force radius term
    this.pow = new Property( 2.0 );
    //How much randomness to add to the system
    this.randomness = new Property( 5 );
    //Some interactions are ignored on each time step to improve performance.  But don't ignore too many or it will destroy the dynamics.
    this.probabilityOfInteraction = new Property( 0.6 );
    //How fast the clock should run
    this.timeScale = new Property( 0.06 );
    //How many numerical iterations to run: more means more accurate but more processor used
    this.iterations = new Property( 100 );
    //Only remove water molecules that intersected this many sucrose atoms, so that the density of water remains about the same
    this.overlaps = new Property( 10 );
    //if the particles are too close, the coulomb force gets too big--a good way to limit the coulomb force is to limit the inter-particle distance used in the coulomb calculation
    this.MIN_COULOMB_DISTANCE = new WaterMolecule.Hydrogen().radius * 2;
    //List of adapters that manage both the box2D and actual model data

    //private
    this.box2DAdapters = new ItemList();
    //Panel that allows us to see jbox2d model and computations
    this.testPanel;
    //Flag to enable/disable the jbox2D DebugDraw mode, which shows the box2d model and computations

    //private
    this.useDebugDraw = false;
    //Keep track of how many waters get deleted when sucrose molecule is dropped so they can be added back when the user grabs the sucrose molecule

    //private
    this.deletedWaterCount = new HashMap();
    //Convenience adapters for reuse with CompoundListNode for adding/removing crystals or molecules
    this.addSucrose = new VoidFunction1().withAnonymousClassBody( {
      apply: function( sucrose ) {
        addSucroseMolecule( sucrose );
      }
    } );
    this.removeSucrose = new VoidFunction1().withAnonymousClassBody( {
      apply: function( sucrose ) {
        removeSucrose( sucrose );
      }
    } );
    this.addSaltIon = new VoidFunction1().withAnonymousClassBody( {
      apply: function( ion ) {
        addSaltIon( ion );
      }
    } );
    this.removeSaltIon = new VoidFunction1().withAnonymousClassBody( {
      apply: function( ion ) {
        removeSaltIon( ion );
      }
    } );
    AbstractSugarAndSaltSolutionsModel.call( this, new ConstantDtClock( 30 ) );
    //Create the Box2D world with no gravity
    world = new World( new Vec2( 0, 0 ), true );
    //Set up initial state, same as reset() method would do, such as adding water particles to the model
    initModel();
    //Set up jbox2D debug draw so we can see the model and computations
    if ( useDebugDraw ) {
      initDebugDraw();
    }
  }

  return inherit( AbstractSugarAndSaltSolutionsModel, WaterModel, {
//Expand a rectangle by the specified size in all 4 directions

    //private
    expand: function( r, size ) {
      return new ImmutableRectangle2D( r.x - size, r.y - size, r.width + size * 2, r.height + size * 2 );
    },
//Determine the length from one corner to the center of the rectangle, this is used to determine how far to move the periodic boundary condition from the visible model rectangle
//So that particles don't disappear when they wrap from one side to the other

    //private
    getHalfDiagonal: function( bounds2D ) {
      return new Vector2( new Vector2( bounds2D.getX(), bounds2D.getY() ), new Vector2( bounds2D.getCenterX(), bounds2D.getCenterY() ) ).magnitude();
    },

    //private
    addWaterParticles: function() {
      for ( var i = 0; i < DEFAULT_NUM_WATERS; i++ ) {
        addWaterMolecule( randomBetweenMinusOneAndOne() * particleWindow.width / 2, randomBetweenMinusOneAndOne() * particleWindow.height / 2, random.nextDouble() * Math.PI * 2 );
      }
    },
//Use the specified random number generator to get a number between [-1,1].

    //private
    randomBetweenMinusOneAndOne: function() {
      return (random.nextFloat() - 0.5) * 2;
    },
//Set up jbox2D debug draw so we can see the model and computations

    //private
    initDebugDraw: function() {
      //So instead we control the rendering ourselves
      testPanel = new TestPanel( new TestbedSettings() ).withAnonymousClassBody( {
        paintComponent: function( g ) {
          //To change body of overridden methods use File | Settings | File Templates.
          super.paintComponent( g );
          g.drawImage( dbImage, 0, 0, null );
        }
      } );
      //Create a frame to show the debug draw in
      var frame = new JFrame();
      frame.setContentPane( testPanel );
      frame.pack();
      frame.setVisible( true );
      world.setDebugDraw( new DebugDrawJ2D( testPanel ).withAnonymousClassBody( {
        initializer: function() {
          //Show the shapes in the debugger
          setFlags( e_shapeBit );
          //Move the camera over so that the shapes will show up at a good size and location
          setCamera( -10, 10, 20 );
        }
      } ) );
    },
//Adds a single water molecule
    addWaterMolecule: function( x, y, angle ) {
      var molecule = new WaterMolecule( new Vector2( x, y ), angle );
      waterList.add( molecule );
      //Add the adapter for box2D
      box2DAdapters.add( new Box2DAdapter( world, molecule, modelToBox2D ) );
    },
    updateModel: function( dt ) {
      //Iterate over all pairs of particles and apply the coulomb force, but only consider particles from different molecules (no intramolecular forces)
      for ( var box2DAdapter in box2DAdapters ) {
        if ( random.nextDouble() < probabilityOfInteraction.get() ) {
          for ( var target in box2DAdapter.compound ) {
            for ( var source in getAllParticles() ) {
              if ( !box2DAdapter.compound.containsParticle( source ) ) {
                var coulombForce = getCoulombForce( source, target ).times( COULOMB_FORCE_SCALE_FACTOR );
                box2DAdapter.applyModelForce( coulombForce, target.getPosition() );
              }
            }
          }
        }
      }
      //First find the ions that are too close together
      var saltTooClose = getSaltIonPairs().filter( new Function1().withAnonymousClassBody( {
        apply: function( pair ) {
          return pair._1.getDistance( pair._2 ) < SALT_ION_DISTANCE_THRESHOLD;
        }
      } ) );
      var sucroseTooClose = getSucrosePairs().filter( new Function1().withAnonymousClassBody( {
        apply: function( pair ) {
          return pair._1.getDistance( pair._2 ) < SUCROSE_DISTANCE_THRESHOLD;
        }
      } ) );
      var all = [].withAnonymousClassBody( {
        initializer: function() {
          addAll( saltTooClose );
          addAll( sucroseTooClose );
        }
      } );
      //Coulomb force is useful here so that it affects close-by particles more that particles that are distant
      for ( var box2DAdapter in box2DAdapters ) {
        if ( box2DAdapter.compound instanceof WaterMolecule ) {
          for ( var pair in all ) {
            //Find the centroid
            var p1 = pair._1.getPosition();
            var p2 = pair._2.getPosition();
            var center = p1.plus( p2 ).times( 0.5 );
            //The scale has to be strong enough to overcome other forces and dissolve the salt, but if it is too high then the water system will be too volatile
            var modelPosition = box2DAdapter.getModelPosition();
            var scale = 1;
            var coulombForce = getCoulombForce( center, modelPosition, scale, -scale ).times( COULOMB_FORCE_SCALE_FACTOR );
            box2DAdapter.applyModelForce( coulombForce, modelPosition );
          }
        }
      }
      //Factor out center of mass motion so no large scale drifts can occur
      subtractOutCenterOfMomentum();
      //It is supposed to run at 60Hz, with velocities not getting too large (300m/s is too large): http://www.box2d.org/forum/viewtopic.php?f=4&t=1205
      world.step( (dt * timeScale.get()), iterations.get(), iterations.get() );
      if ( useDebugDraw ) {
        //Turn off the animation thread in the test panel, we are doing the animation ourselves
        testPanel.stop();
        //Make sure the debug draw paints on the screen
        testPanel.render();
        world.drawDebugData();
        testPanel.paintImmediately( 0, 0, testPanel.getWidth(), testPanel.getHeight() );
      }
      //Apply periodic boundary conditions
      applyPeriodicBoundaryConditions();
      for ( var box2DAdapter in box2DAdapters ) {
        box2DAdapter.worldStepped();
      }
      //Notify listeners that the model changed
      for ( var frameListener in frameListeners ) {
        frameListener.apply();
      }
      //No water can be drained from the water module
      return 0;
    },
//Get all pairs of salt ions, including Na+/Cl- and Na+/Na+ combinations so that the water can make sure they dissolve and move far enough away

    //private
    getSaltIonPairs: function() {
      return new ItemList().withAnonymousClassBody( {
        initializer: function() {
          for ( var a in saltIonList ) {
            for ( var b in saltIonList ) {
              if ( a != b ) {
                add( new Pair( a, b ) );
              }
            }
          }
        }
      } );
    },
//Get all pairs of sucrose molecules so that the water can make sure they dissolve and move far enough away

    //private
    getSucrosePairs: function() {
      return new ItemList().withAnonymousClassBody( {
        initializer: function() {
          for ( var a in sucroseList ) {
            for ( var b in sucroseList ) {
              if ( a != b ) {
                add( new Pair( a, b ) );
              }
            }
          }
        }
      } );
    },
//Get all interacting particles from the lists of water, sucrose, etc.

    //private
    getAllParticles: function() {
      return [].withAnonymousClassBody( {
        initializer: function() {
          for ( var waterMolecule in waterList ) {
            for ( var waterAtom in waterMolecule ) {
              add( waterAtom );
            }
          }
          for ( var sucrose in sucroseList ) {
            for ( var sucroseAtom in sucrose ) {
              add( sucroseAtom );
            }
          }
          for ( var saltIon in saltIonList ) {
            for ( var saltAtom in saltIon ) {
              add( saltAtom );
            }
          }
        }
      } );
    },
//Get the coulomb force between two particles
//The particles should be from different compounds since compounds shouldn't have intra-molecular forces

    //private
    getCoulombForce: function( source, target ) {
      return getCoulombForce( source.getPosition(), target.getPosition(), source.getCharge(), target.getCharge() );
    },
//Get the coulomb force between two points with the specified charges

    //private
    getCoulombForce: function( sourcePosition, targetPosition, q1, q2 ) {
      if ( sourcePosition.equals( targetPosition ) ) {
        return ZERO;
      }
      var distance = sourcePosition.distance( targetPosition );
      if ( distance < MIN_COULOMB_DISTANCE ) {
        distance = MIN_COULOMB_DISTANCE;
      }
      var scale = k * q1 * q2 / Math.pow( distance, pow.get() ) / distance * coulombStrengthMultiplier.get();
      return new Vector2( (targetPosition.getX() - sourcePosition.getX()) * scale, (targetPosition.getY() - sourcePosition.getY()) * scale );
    },
//Factor out center of mass motion so no large scale drifts can occur

    //private
    subtractOutCenterOfMomentum: function() {
      var totalMomentum = getBox2DMomentum();
      for ( var molecule in box2DAdapters ) {
        var v = molecule.body.getLinearVelocity();
        var delta = totalMomentum.mul( (-1 / getBox2DMass()) );
        molecule.body.setLinearVelocity( v.add( delta ) );
      }
    },

    //private
    getBox2DMomentum: function() {
      var totalMomentum = new Vec2();
      for ( var adapter in box2DAdapters ) {
        var v = adapter.body.getLinearVelocity();
        totalMomentum.x += v.x * adapter.body.getMass();
        totalMomentum.y += v.y * adapter.body.getMass();
      }
      return totalMomentum;
    },

    //private
    getBox2DMass: function() {
      var m = 0.0;
      for ( var molecule in box2DAdapters ) {
        m += molecule.body.getMass();
      }
      return m;
    },
//Move particles from one side of the screen to the other if they went out of bounds
//Use the extended boundary to prevent flickering when a particle wraps from one side to the other

    //private
    applyPeriodicBoundaryConditions: function() {
      for ( var adapter in box2DAdapters ) {
        var particle = adapter.compound;
        var x = particle.getPosition().getX();
        var y = particle.getPosition().getY();
        var boundary = getBoundary( adapter.compound );
        //Move the particle away from the edge a little bit to prevent exact collisions, may not help that much but left here
        var delta = boundary.width / 100;
        if ( particle.getPosition().getX() > boundary.getMaxX() ) {
          adapter.setModelPosition( boundary.x + delta, y );
        }
        else if ( particle.getPosition().getX() < boundary.x ) {
          adapter.setModelPosition( boundary.getMaxX() - delta, y );
        }
        else if ( particle.getPosition().getY() > boundary.getMaxY() ) {
          adapter.setModelPosition( x, boundary.y + delta );
        }
        else if ( particle.getPosition().getY() < boundary.y ) {
          adapter.setModelPosition( x, boundary.getMaxY() - delta );
        }
      }
    },
//Lookup the boundary to use for the specified type, see docs at the declaration of the boundary instances for explanation

    //private
    getBoundary: function( compound ) {
      if ( compound instanceof Sucrose ) {
        return sucroseBoundary;
      }
      else if ( compound instanceof SaltIon.ChlorideIon ) {
        return chlorideBoundary;
      }
      else if ( compound instanceof SaltIon.SodiumIon ) {
        return chlorideBoundary;
      }
      else if ( compound instanceof WaterMolecule ) {
        return waterBoundary;
      }
      else {
        throw new IllegalArgumentException( "unknown type: " + compound.getClass() );
      }
    },
//Resets the model, clearing water molecules and starting over
    reset: function() {
      initModel();
      showSugarAtoms.reset();
      showWaterCharges.reset();
      showSugarPartialCharge.reset();
      clockRunning.reset();
    },
//Set up the initial model state, used on init and after reset
    initModel: function() {
      //Clear out the box2D world
      for ( var box2DAdapter in box2DAdapters ) {
        world.destroyBody( box2DAdapter.body );
      }
      box2DAdapters.clear();
      waterList.clear();
      sucroseList.clear();
      saltIonList.clear();
      //Add water particles
      addWaterParticles();
    },
//Gets a random number within the horizontal range of the beaker
    getRandomX: function() {
      return (random.nextFloat() * particleWindow.width - particleWindow.width / 2);
    },
//Gets a random number within the vertical range of the beaker
    getRandomY: function() {
      return (random.nextFloat() * particleWindow.height);
    },
//Remove the overlapping water so it doesn't overlap and cause box2d problems due to occupying the same space at the same time

    //private
    removeOverlappingWater: function( compound ) {
      var toRemove = getOverlappingWaterMolecules( compound );
      waterList.removeAll( toRemove );
      var box2DAdaptersToRemove = getBox2DAdapters( toRemove );
      for ( var box2DAdapter in box2DAdaptersToRemove ) {
        world.destroyBody( box2DAdapter.body );
        box2DAdapters.remove( box2DAdapter );
      }
      //Store the number of deleted waters so they can be added back if/when the user grabs the sucrose molecule
      deletedWaterCount.put( compound, toRemove.size() );
    },
//Find the Box2DAdapters for the specified water molecules, used for removing intersecting water when crystals are added by the user

    //private
    getBox2DAdapters: function( set ) {
      var box2DAdaptersToRemove = [];
      for ( var box2DAdapter in box2DAdapters ) {
        if ( set.contains( box2DAdapter.compound ) ) {
          box2DAdaptersToRemove.add( box2DAdapter );
        }
      }
      return box2DAdaptersToRemove;
    },
//Find which water molecules overlap with the specified crystal so they can be removed before the crystal is added, to prevent box2d body overlaps

    //private
    getOverlappingWaterMolecules: function( compound ) {
      return new HashSet().withAnonymousClassBody( {
        initializer: function() {
          var counts = new IdentityHashMap();
          //Iterate over all water atoms
          for ( var waterMolecule in waterList ) {
            //Make sure we aren't checking for the collisions with a water molecule itself
            if ( waterMolecule != compound ) {
              //Check the hydrogen atoms and oxygen atoms in the water
              for ( var waterAtom in waterMolecule ) {
                //Iterate over all sucrose atoms
                for ( var atom in compound ) {
                  //add if they are overlapping
                  if ( waterAtom.getPosition().distance( atom.getPosition() ) < waterAtom.radius + atom.radius ) {
                    counts.put( waterMolecule, counts.get( waterMolecule ) == null ? 1 : counts.get( waterMolecule ) + 1 );
                  }
                }
              }
            }
          }
          //Only remove water molecules that intersected several sucrose atoms, so that the density of water remains about the same
          for ( var waterMolecule in counts.keySet() ) {
            if ( counts.get( waterMolecule ) >= overlaps.get() ) {
              add( waterMolecule );
            }
          }
          //Diagnostic for determining how many waters would have been removed with our previous algorithm of intersecting only one particle
          if ( debugWaterRemoval ) {
            var oneSet = new HashSet();
            for ( var waterMolecule in counts.keySet() ) {
              if ( counts.get( waterMolecule ) >= 1 ) {
                oneSet.add( waterMolecule );
              }
            }
            console.log( "waterList.size = " + waterList.size() + ", oneSet.size() = " + oneSet.size() + ", useSet.size = " + size() );
          }
        }
      } );
    },
//Add the specified sucrose crystal to the model
    addSucroseMolecule: function( sucrose ) {
      //Remove the overlapping water so it doesn't overlap and cause box2d problems due to occupying the same space at the same time
      removeOverlappingWater( sucrose );
      //Add the sucrose crystal and box2d adapters for all its molecules so they will propagate with box2d physics
      sucroseList.add( sucrose );
      box2DAdapters.add( new Box2DAdapter( world, sucrose, modelToBox2D ) );
    },
//Remove a sucrose from the model.  This can be called when the user grabs a sucrose molecule in the play area, and is called so that box2D won't continue to move the sucrose while the user is moving it
    removeSucrose: function( sucrose ) {
      if ( sucroseList.contains( sucrose ) ) {
        //Find the box2D adapters to remove, hopefully there is only one!
        var toRemove = box2DAdapters.filterToArrayList( new Function1().withAnonymousClassBody( {
          apply: function( box2DAdapter ) {
            return box2DAdapter.compound == sucrose;
          }
        } ) );
        //Remove the box2D components
        for ( var box2DAdapter in toRemove ) {
          world.destroyBody( box2DAdapter.body );
          box2DAdapters.remove( box2DAdapter );
        }
        //Remove the sucrose itself
        sucroseList.remove( sucrose );
        //Add back as many waters as were deleted when the sucrose was added to the model to conserve water molecule count
        addWaterWhereSucroseWas( sucrose );
      }
    },
//Add back as many waters as were deleted when the sucrose was added to the model to conserve water molecule count

    //private
    addWaterWhereSucroseWas: function( sucrose ) {
      //First make sure we only add back missing molecules once for each time they were removed to conserve water molecule count
      if ( deletedWaterCount.containsKey( sucrose ) ) {
        var numWatersToAdd = deletedWaterCount.get( sucrose );
        //Randomly distribute the new water molecules in the region of the sucrose that was removed
        var bounds = sucrose.getShape().getBounds2D();
        for ( var i = 0; i < numWatersToAdd; i++ ) {
          addWaterMolecule( randomBetweenMinusOneAndOne() * bounds.getWidth() + bounds.getCenterX(), randomBetweenMinusOneAndOne() * bounds.getHeight() + bounds.getCenterY(), random.nextDouble() * 2 * Math.PI );
        }
        //Remove from the map to indicate we have accounted for the removed water particles
        deletedWaterCount.remove( sucrose );
      }
    },
//Add the specified ion crystal to the model, no need to remove overlapping water molecules in this case since the salt ions are small enough
    addSaltIon: function( ion ) {
      //Add the ion crystal and box2d adapters for all its molecules so they will propagate with box2d physics
      saltIonList.add( ion );
      box2DAdapters.add( new Box2DAdapter( world, ion, modelToBox2D ) );
    },
//Remove a sucrose from the model.  This can be called when the user grabs a sucrose molecule in the play area, and is called so that box2D won't continue to move the sucrose while the user is moving it
    removeSaltIon: function( ion ) {
      if ( saltIonList.contains( ion ) ) {
        //Find the box2D adapters to remove, hopefully there is only one!
        var toRemove = box2DAdapters.filterToArrayList( new Function1().withAnonymousClassBody( {
          apply: function( box2DAdapter ) {
            return box2DAdapter.compound == ion;
          }
        } ) );
        //Remove the box2D components
        for ( var box2DAdapter in toRemove ) {
          world.destroyBody( box2DAdapter.body );
          box2DAdapters.remove( box2DAdapter );
        }
        //Remove the sucrose itself
        saltIonList.remove( ion );
      }
    },
    main: function( args ) {
      var model = new WaterModel();
      var force = model.getCoulombForce( ZERO, new Vector2( 1, 0 ), 1, 1 );
      console.log( "force = " + force );
      console.log( "5E-36 / 10 * 2 = " + 5E-36 / 10 * 2 );
    }
  } );
} );

