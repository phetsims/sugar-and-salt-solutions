// Copyright 2002-2012, University of Colorado
/**
 * The Box2DAdapter creates a connection between the Compound model object and its box2D representation, and can use values from one to update the other.
 * Box2D is used to perform the physics and dynamics (collisions, repulsions, attractions) between the particles.
 * This is so we can use Box2D for physics and piccolo for graphics
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CircleShape = require( 'org.jbox2d.collision.shapes.CircleShape' );
  var Vec2 = require( 'org.jbox2d.common.Vec2' );
  var Body = require( 'org.jbox2d.dynamics.Body' );
  var BodyDef = require( 'org.jbox2d.dynamics.BodyDef' );
  var BodyType = require( 'org.jbox2d.dynamics.BodyType' );
  var Fixture = require( 'org.jbox2d.dynamics.Fixture' );
  var World = require( 'org.jbox2d.dynamics.World' );
  var Vector2 = require( 'DOT/Vector2' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var Compound = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Compound' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );

  function Box2DAdapter( world, compound, transform ) {
    //The Box2D world instance
    this.world;
    //The compound to represent
    this.compound;
    //The transform from true model coordinates (meters) to box2D coordinates, see WaterModel for a description of these coordinates
    this.transform;
    //The Box2D body instance
    this.body;
    this.world = world;
    this.compound = compound;
    this.transform = transform;
    //First create the body def at the right location
    var bodyDef = new BodyDef().withAnonymousClassBody( {
      initializer: function() {
        var box2DPosition = transform.modelToView( compound.getPosition() );
        position = new Vec2( box2DPosition.getX(), box2DPosition.getY() );
        angle = compound.getAngle();
        //Have to specify the type as dynamic or it won't move
        type = BodyType.DYNAMIC;
      }
    } );
    body = world.createBody( bodyDef );
    //Add a little bit of linear and rotational friction so the system doesn't accelerate out of control
    body.setLinearDamping( 1 );
    body.setAngularDamping( 1 );
    //Add shapes for all of the constituents as rigid fixtures to the box2d shape
    for ( var i = 0; i < compound.numberConstituents(); i++ ) {
      var constituent = compound.getConstituent( i );
      //Create the shape to add to the body
      var shape = new CircleShape().withAnonymousClassBody( {
        initializer: function() {
          m_radius = transform.modelToViewDeltaX( constituent.particle.radius );
          //Set the position within the molecule
          var boxOffset = transform.modelToViewDelta( constituent.relativePosition );
          m_p.set( boxOffset.getX(), boxOffset.getY() );
        }
      } );
      //Add the shape to the body
      var f = body.createFixture( shape, 1 );
      //Add a little bit of bounciness to keep things moving randomly
      f.setRestitution( 0.1
      f
    )
      ;
    }
  }

  return inherit( Object, Box2DAdapter, {
//After the physics has been applied, update the true model position based on the box2D position
    worldStepped: function() {
      compound.setPositionAndAngle( transform.viewToModel( new Vector2( body.getPosition().x, body.getPosition().y ) ), body.getAngle() );
    },
//Apply a force in Newtons by converting it to box2d coordinates and applying it to the body
    applyModelForce: function( force, position ) {
      var box2DForce = transform.modelToViewDelta( force );
      var box2DPosition = transform.modelToView( position );
      applyBox2DForce( box2DForce.getX(), box2DForce.getY(), box2DPosition );
    },
//Apply a force to the body at the specified location
    applyBox2DForce: function( fx, fy, box2DPosition ) {
      body.applyForce( new Vec2( fx, fy ), new Vec2( box2DPosition.getX(), box2DPosition.getY() ) );
    },
//Convenience method to set the model position from double,double
    setModelPosition: function( x, y ) {
      setModelPosition( new Vector2( x, y ) );
    },
//Set the model position (in meters) of this compound, and update the box2D body to reflect the new coordinates so that it will be at the right place at the beginning of the next physics step
    setModelPosition: function( immutableVector2D ) {
      compound.setPosition( immutableVector2D );
      var box2D = transform.modelToView( immutableVector2D );
      body.setTransform( new Vec2( box2D.getX(), box2D.getY() ), compound.getAngle() );
    },
//Get the true model position (meters) of the compound
    getModelPosition: function() {
      return compound.getPosition();
    }
  } );
} );

