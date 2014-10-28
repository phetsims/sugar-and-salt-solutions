// Copyright 2002-2012, University of Colorado
/**
 * List of the kits the user can choose from, for showing the appropriate bars in the concentration bar charts
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrayList = require( 'java.util.ArrayList' );
  var Option = require( 'edu.colorado.phet.common.phetcommon.util.Option' );
  var Some = require( 'edu.colorado.phet.common.phetcommon.util.Option.Some' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var Particle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Particle' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Calcium' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Chloride' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle/Sodium' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/Sucrose' );
  var SphericalParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SphericalParticleNode' );
  var BarItem = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/barchart/BarItem' );
  var MicroModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/MicroModel' );
  var Glucose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/glucose/Glucose' );
  var Nitrate = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/micro/model/sodiumnitrate/Nitrate' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var Strings = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings' );//static ///*

  function MicroSoluteKitList( model, transform ) {

    //private
    this.kits = [];
    //Create icons to be shown beneath each bar.  Functions are used to create new icons for each kit since giving the same PNode multiple parents caused layout problems
    var sodiumIcon = new Function0().withAnonymousClassBody( {
      apply: function() {
        return new Some( new SphericalParticleNode( transform, new Sodium(), model.showChargeColor ) );
      }
    } );
    var chlorideIcon = new Function0().withAnonymousClassBody( {
      apply: function() {
        return new Some( new SphericalParticleNode( transform, new Chloride(), model.showChargeColor ) );
      }
    } );
    var sucroseIcon = new Function0().withAnonymousClassBody( {
      apply: function() {
        return new Some( new CompositeParticleNode( transform, new Sucrose(), model.showChargeColor ) );
      }
    } );
    var glucoseIcon = new Function0().withAnonymousClassBody( {
      apply: function() {
        return new Some( new CompositeParticleNode( transform, new Glucose(), model.showChargeColor ) );
      }
    } );
    var calciumIcon = new Function0().withAnonymousClassBody( {
      apply: function() {
        return new Some( new SphericalParticleNode( transform, new Calcium(), model.showChargeColor ) );
      }
    } );
    var nitrateIcon = new Function0().withAnonymousClassBody( {
      apply: function() {
        return new Some( new CompositeParticleNode( transform, new Nitrate( 0, ZERO ), model.showChargeColor ) );
      }
    } );
    //Put the positive ions to the left of the negative ions
    kits.add( new MicroSoluteKit( new BarItem( model.sodium, SODIUM, sodiumIcon ), new BarItem( model.chloride, CHLORIDE, chlorideIcon ), new BarItem( model.sucrose, SUCROSE, sucroseIcon ) ) );
    kits.add( new MicroSoluteKit( new BarItem( model.sodium, SODIUM, sodiumIcon ), new BarItem( model.calcium, CALCIUM, calciumIcon ), new BarItem( model.chloride, CHLORIDE, chlorideIcon ) ) );
    kits.add( new MicroSoluteKit( new BarItem( model.sodium, SODIUM, sodiumIcon ), new BarItem( model.chloride, CHLORIDE, chlorideIcon ), new BarItem( model.nitrate, NITRATE, nitrateIcon ) ) );
    kits.add( new MicroSoluteKit( new BarItem( model.sucrose, SUCROSE, sucroseIcon ), new BarItem( model.glucose, GLUCOSE, glucoseIcon ) ) );
  }

  return inherit( Object, MicroSoluteKitList, {
    getKit: function( kit ) {
      return kits.get( kit );
    }
  } );
} );

