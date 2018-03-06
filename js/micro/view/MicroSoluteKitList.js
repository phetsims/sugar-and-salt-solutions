// Copyright 2014-2017, University of Colorado Boulder

/**
 * List of the kits the user can choose from, for showing the appropriate bars in the concentration bar charts
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarItem = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/barchart/BarItem' );
  var Calcium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Calcium' );
  var Chloride = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Chloride' );
  var CompositeParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/CompositeParticleNode' );
  var Glucose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/glucose/Glucose' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MicroSoluteKit = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/view/MicroSoluteKit' );
  var Nitrate = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sodiumnitrate/Nitrate' );
  var Sodium = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/sphericalparticles/Sodium' );
  var SphericalParticleNode = require( 'SUGAR_AND_SALT_SOLUTIONS/common/view/SphericalParticleNode' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/micro/model/sucrose/Sucrose' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var calciumString = 'Ca<sup>2+</sup>';
  var chlorideString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/chloride' );
  var glucoseString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/glucose' );
  var nitrateString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/nitrate' );
  var sodiumString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sodium' );
  var sucroseString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sucrose' );

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
    this.kits.push( new MicroSoluteKit( [ new BarItem( model.sodium, sodiumString, sodiumIcon ),
      new BarItem( model.chloride, chlorideString, chlorideIcon ),
      new BarItem( model.sucrose, sucroseString, sucroseIcon ) ] ) );

    this.kits.push( new MicroSoluteKit( [ new BarItem( model.sodium, sodiumString, sodiumIcon ),
      new BarItem( model.calcium, calciumString, calciumIcon ),
      new BarItem( model.chloride, chlorideString, chlorideIcon ) ] ) );

    this.kits.push( new MicroSoluteKit( [ new BarItem( model.sodium, sodiumString, sodiumIcon ),
      new BarItem( model.chloride, chlorideString, chlorideIcon ),
      new BarItem( model.nitrate, nitrateString, nitrateIcon ) ] ) );

    this.kits.push( new MicroSoluteKit( [ new BarItem( model.sucrose, sucroseString, sucroseIcon ),
      new BarItem( model.glucose, glucoseString, glucoseIcon ) ] ) );

  }

  sugarAndSaltSolutions.register( 'MicroSoluteKitList', MicroSoluteKitList );
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
