// Copyright 2014-2018, University of Colorado Boulder
/**
 * Provides physical locations (positions) of the atoms within a glucose molecule.
 * Positions sampled from a 2d rasterized view of glucose from JMol with ProjectorUtil
 * <p/>
 * C6H12O6
 *
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ProjectedPositions = require( 'SUGAR_AND_SALT_SOLUTIONS/common/model/ProjectedPositions' );
  var sugarAndSaltSolutions = require( 'SUGAR_AND_SALT_SOLUTIONS/sugarAndSaltSolutions' );
  var SugarAndSaltSolutionsConstants = require( 'SUGAR_AND_SALT_SOLUTIONS/common/SugarAndSaltSolutionsConstants' );

  /**
   * @constructor
   */
  function GlucosePositions() {

    ProjectedPositions.call( this, 'H 465, 311\n' +
                                   'H 558, 513\n' +
                                   'H 344, 500\n' +
                                   'H 768, 389\n' +
                                   'H 680, 665\n' +
                                   'C 509, 331\n' +
                                   'C 625, 398\n' +
                                   'O 697, 339\n' +
                                   'C 603, 526\n' +
                                   'C 505, 588\n' +
                                   'C 394, 516\n' +
                                   'O 435, 394\n' +
                                   'C 288, 572\n' +
                                   'O 254, 690\n' +
                                   'O 467, 692\n' +
                                   'H 220, 509\n' +
                                   'H 185, 720\n' +
                                   'H 336, 596\n' +
                                   'H 424, 742\n' +
                                   'H 549, 625\n' +
                                   'H 681, 402\n' +
                                   'O 532, 213\n' +
                                   'H 577, 231\n' +
                                   'O 704, 591',

      //Make sure it is qualitatively smaller than Sucrose
      SugarAndSaltSolutionsConstants.SUCROSE_SCALE * 0.7 );
  }

  sugarAndSaltSolutions.register( 'GlucosePositions', GlucosePositions );

  return inherit( ProjectedPositions, GlucosePositions );
} );
