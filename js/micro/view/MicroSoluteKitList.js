//  Copyright 2002-2014, University of Colorado Boulder
/**
 * List of the kits the user can choose from, for showing the appropriate bars in the concentration bar charts
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SphericalParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SphericalParticleNode' );
  var CompositeParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/CompositeParticleNode' );
  var MicroSoluteKit = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/MicroSoluteKit' );
  var BarItem = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/barchart/BarItem' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Sodium' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Chloride' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Calcium' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sucrose/Sucrose' );
  var Glucose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/glucose/Glucose' );
  var Nitrate = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/Nitrate' );
  var Vector2 = require( 'DOT/Vector2' );

  //strings
  var CHLORIDE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/chloride' );
  var CALCIUM = require( 'string!SUGAR_AND_SALT_SOLUTIONS/calcium' );
  var NITRATE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/nitrate' );
  var SUCROSE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sucrose' );
  var GLUCOSE = require( 'string!SUGAR_AND_SALT_SOLUTIONS/glucose' );
  var SODIUM = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sodium' );

  /**
   *
   * @param {MicroModel} model
   * @param {ModelViewTransform2} transform
   * @constructor
   */
  function MicroSoluteKitList( model, transform ) {
    // private
    this.kits = []; // Array<MicroSoluteKit>

    // Create icons to be shown beneath each bar.  Functions are used to create new icons for each kit since
    // giving the same PNode multiple parents caused layout problems
    var sodiumIcon = new SphericalParticleNode( transform, new Sodium(), model.showChargeColor );
    var chlorideIcon = new SphericalParticleNode( transform, new Chloride(), model.showChargeColor );
    var sucroseIcon = new CompositeParticleNode( transform, new Sucrose(), model.showChargeColor );
    var glucoseIcon = new CompositeParticleNode( transform, new Glucose(), model.showChargeColor );
    var calciumIcon = new SphericalParticleNode( transform, new Calcium(), model.showChargeColor );
    var nitrateIcon = new CompositeParticleNode( transform, new Nitrate( 0, Vector2.ZERO ), model.showChargeColor );


    //This is the logic for which components are present within each kit.  If kits change, this will need to be updated
    //Put the positive ions to the left of the negative ions
    this.kits.push( new MicroSoluteKit( [ new BarItem( model.sodium, SODIUM, sodiumIcon ),
      new BarItem( model.chloride, CHLORIDE, chlorideIcon ),
      new BarItem( model.sucrose, SUCROSE, sucroseIcon ) ] ) );

    this.kits.push( new MicroSoluteKit( [ new BarItem( model.sodium, SODIUM, sodiumIcon ),
      new BarItem( model.calcium, CALCIUM, calciumIcon ),
      new BarItem( model.chloride, CHLORIDE, chlorideIcon ) ] ) );

    this.kits.push( new MicroSoluteKit( [ new BarItem( model.sodium, SODIUM, sodiumIcon ),
      new BarItem( model.chloride, CHLORIDE, chlorideIcon ),
      new BarItem( model.nitrate, NITRATE, nitrateIcon ) ] ) );

    this.kits.push( new MicroSoluteKit( [ new BarItem( model.sucrose, SUCROSE, sucroseIcon ),
      new BarItem( model.glucose, GLUCOSE, glucoseIcon ) ] ) );

  }

  return inherit( Object, MicroSoluteKitList, {
    /**
     * @param {number} kit
     * @returns {MicroSoluteKit}
     */
    getKit: function( kit ) {
      return this.kits[ kit ];
    }

  } );
} );
