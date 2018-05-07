// Copyright 2014-2018, University of Colorado Boulder

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
  var glucoseString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/glucose' );
  var sucroseString = require( 'string!SUGAR_AND_SALT_SOLUTIONS/sucrose' );

  // chemical formulas do not require translation, see https://github.com/phetsims/sugar-and-salt-solutions/issues/19
  var calciumString = 'Ca<sup>2+</sup>';
  var chlorideString = 'Cl<sup>-</sup>';
  var nitrateString = 'NO<sub>3</sub><sup>-</sup>';
  var sodiumString = 'Na<sup>+</sup>';

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
    var sodiumIcon = new SphericalParticleNode( transform, new Sodium(), model.showChargeColorProperty );
    var chlorideIcon = new SphericalParticleNode( transform, new Chloride(), model.showChargeColorProperty );
    var sucroseIcon = new CompositeParticleNode( transform, new Sucrose(), model.showChargeColorProperty );
    var glucoseIcon = new CompositeParticleNode( transform, new Glucose(), model.showChargeColorProperty );
    var calciumIcon = new SphericalParticleNode( transform, new Calcium(), model.showChargeColorProperty );
    var nitrateIcon = new CompositeParticleNode( transform, new Nitrate( 0, Vector2.ZERO ), model.showChargeColorProperty );


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
