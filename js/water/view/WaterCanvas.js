// Copyright 2002-2012, University of Colorado
/**
 * Canvas for the Water tab
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension = require( 'java.awt.Dimension' );
  var Rectangle = require( 'java.awt.Rectangle' );
  var Rectangle = require( 'KITE/Rectangle' );
  var PropertyChangeEvent = require( 'java.beans.PropertyChangeEvent' );
  var PropertyChangeListener = require( 'java.beans.PropertyChangeListener' );
  var ImmutableRectangle2D = require( 'edu.colorado.phet.common.phetcommon.math.ImmutableRectangle2D' );
  var Bucket = require( 'edu.colorado.phet.common.phetcommon.model.Bucket' );
  var CompositeProperty = require( 'edu.colorado.phet.common.phetcommon.model.property.CompositeProperty' );
  var Property = require( 'AXON/Property' );
  var Function0 = require( 'edu.colorado.phet.common.phetcommon.util.function.Function0' );
  var VoidFunction0 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction0' );
  var VoidFunction1 = require( 'edu.colorado.phet.common.phetcommon.util.function.VoidFunction1' );
  var Dimension2DDouble = require( 'edu.colorado.phet.common.phetcommon.view.Dimension2DDouble' );
  var ModelViewTransform = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform' );
  var PhetFont = require( 'edu.colorado.phet.common.phetcommon.view.util.PhetFont' );
  var BucketView = require( 'edu.colorado.phet.common.piccolophet.nodes.BucketView' );
  var FloatingClockControlNode = require( 'edu.colorado.phet.common.piccolophet.nodes.mediabuttons.FloatingClockControlNode' );
  var GlobalState = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/GlobalState' );
  var Constituent = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/Constituent' );
  var SphericalParticle = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/SphericalParticle' );
  var Sucrose = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/Sucrose' );
  var SucroseCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/model/sucrose/SucroseCrystal' );
  var SugarAndSaltSolutionsCanvas = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SugarAndSaltSolutionsCanvas' );
  var SugarAndSaltSolutionsResetAllButtonNode = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/SugarAndSaltSolutionsResetAllButtonNode' );
  var SaltIon = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/SaltIon' );
  var SodiumChlorideCrystal = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/SodiumChlorideCrystal' );
  var WaterModel = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterModel' );
  var WaterMolecule = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/water/model/WaterMolecule' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ZERO = require( 'edu.colorado.phet.common.phetcommon.math.vector.Vector2.ZERO' );//static
  var not = require( 'edu.colorado.phet.common.phetcommon.model.property.Not.not' );//static
  var createRectangleInvertedYMapping = require( 'edu.colorado.phet.common.phetcommon.view.graphics.transforms.ModelViewTransform.createRectangleInvertedYMapping' );//static
  var SALT = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/SALT' );//static
  var SUGAR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/SugarAndSaltSolutionsResources/Strings/SUGAR' );//static
  var INSET = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/INSET' );//static
  var WATER_COLOR = require( 'SUGAR_AND_SALT_SOLUTIONS/sugar-and-salt-solutions/common/view/BeakerAndShakerCanvas/WATER_COLOR' );//static
  var blue = require( 'java.awt.Color.blue' );//static

//Default size of the canvas.  Sampled at runtime on a large res screen from a sim with multiple tabs
  var canvasSize = new Dimension( 1008, 676 );
//Color for the buckets

  //private
  var BUCKET_COLOR = Color.white;

  function WaterCanvas( model, state ) {
    //Separate layer for the particles so they are always behind the control panel

    //private
    this.particleWindowNode;
    //Views for the salt and sugar bucket

    //private
    this.saltBucket;

    //private
    this.sugarBucket;
    //Layers for salt and sugar buckets

    //private
    this.saltBucketParticleLayer;

    //private
    this.sugarBucketParticleLayer;
    //Dialog in which to show the 3d JMol view of sucrose

    //private
    this.sucrose3DDialog;
    //Model view transform from model to stage coordinates
    this.transform;
    //The water model

    //private
    this.model;
    this.model = model;
    sucrose3DDialog = new Sucrose3DDialog( state.frame, WATER_COLOR );
    //Use the background color specified in the backgroundColor, since it is changeable in the developer menu
    state.colorScheme.backgroundColorSet.color.addObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( color ) {
        setBackground( color );
      }
    } ) );
    //Create the transform from model (SI) to view (stage) coordinates
    var inset = 40;
    var particleWindow = model.particleWindow;
    var particleWindowWidth = canvasSize.getWidth() * 0.7;
    var particleWindowHeight = model.particleWindow.height * particleWindowWidth / model.particleWindow.width;
    var particleWindowX = inset;
    var particleWindowY = inset;
    transform = createRectangleInvertedYMapping( particleWindow.toRectangle2D(), new Rectangle.Number( particleWindowX, particleWindowY, particleWindowWidth, particleWindowHeight ) );
    // Root of our scene graph
    addWorldChild( rootNode );
    //Add the region with the particles
    particleWindowNode = new ParticleWindowNode( model, transform );
    rootNode.addChild( particleWindowNode );
    //Set the transform from stage coordinates to screen coordinates
    setWorldTransformStrategy( new CenteredStage( this, canvasSize ) );
    //Create and add a small icon of the beaker to show that this tab is a zoomed in version of it
    var miniBeakerNode = new MiniBeakerNode().withAnonymousClassBody( {
      initializer: function() {
        translate( (canvasSize.getWidth() - getFullBounds().getWidth() - inset) / getScale(), 300 );
      }
    } );
    addChild( miniBeakerNode );
    //Show a graphic that shows the particle frame to be a zoomed in part of the mini beaker
    addChild( new ZoomIndicatorNode( new CompositeProperty( new Function0().withAnonymousClassBody( {
      apply: function() {
        return state.colorScheme.whiteBackground.get() ? blue : Color.yellow;
      }
    } ), state.colorScheme.whiteBackground ), miniBeakerNode, particleWindowNode ) );
    //Add the reset all button
    var resetAllButtonNode = new SugarAndSaltSolutionsResetAllButtonNode( canvasSize.width, canvasSize.height, new VoidFunction0().withAnonymousClassBody( {
      apply: function() {
        model.reset();
        //When the module is reset, put the salt and sugar back in the buckets
        addSaltToBucket();
        addSugarToBucket();
        sucrose3DDialog.reset();
      }
    } ) );
    addChild( resetAllButtonNode );
    //Control panel with user options
    var controlPanel = new WaterControlPanel( model, state, this, sucrose3DDialog ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( canvasSize.getWidth() - INSET - getFullBounds().getWidth(), resetAllButtonNode.getFullBounds().getY() - getFullBounds().getHeight() - INSET * 2 );
      }
    } );
    addChild( controlPanel );
    //The transform must have inverted Y so the bucket is upside-up.
    var referenceRect = new Rectangle( 0, 0, 1, 1 );
    var bucketTransform = createRectangleInvertedYMapping( referenceRect, referenceRect );
    var bucketSize = new Dimension2DDouble( 205, 80 );
    var bucketSeparation = 210;
    sugarBucket = new BucketView( new Bucket( particleWindowX + particleWindowWidth / 2 + bucketSeparation / 2, -canvasSize.getHeight() + bucketSize.getHeight(), bucketSize, BUCKET_COLOR, SUGAR ), bucketTransform, Color.black, new PhetFont( 22, true ) );
    saltBucket = new BucketView( new Bucket( particleWindowX + particleWindowWidth / 2 - bucketSeparation / 2, -canvasSize.getHeight() + bucketSize.getHeight(), bucketSize, BUCKET_COLOR, SALT ), bucketTransform, Color.black, new PhetFont( 22, true ) );
    //Add the buckets to the view
    addChild( sugarBucket.getHoleNode() );
    addChild( saltBucket.getHoleNode() );
    //Create layers for the sugar and salt particles
    saltBucketParticleLayer = new Node();
    addChild( saltBucketParticleLayer );
    addChild( saltBucket.getFrontNode() );
    sugarBucketParticleLayer = new Node();
    addChild( sugarBucketParticleLayer );
    addChild( sugarBucket.getFrontNode() );
    //So the sucrose molecules will act as a single large 2-molecule crystal
    sugarBucketParticleLayer.addPropertyChangeListener( Node.PROPERTY_CHILDREN, new PropertyChangeListener().withAnonymousClassBody( {
      propertyChange: function( evt ) {
        if ( sugarBucketParticleLayer.getChildrenCount() == 2 ) {
          addSugarToBucket();
        }
      }
    } ) );
    //Add clock controls for pause/play/step
    addChild( new FloatingClockControlNode( model.clockRunning, NO_READOUT, model.clock, "", new Property( Color.white ) ).withAnonymousClassBody( {
      initializer: function() {
        setOffset( INSET, canvasSize.getHeight() - getFullBounds().getHeight() - INSET );
      }
    } ) );
    //When a water molecule is added in the model, add graphics for each atom in the view
    model.waterList.addElementAddedObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( waterMolecule ) {
        for ( var waterAtom in waterMolecule ) {
          var node = new SphericalParticleNodeWithText( transform, waterAtom, model.showChargeColor, model.showWaterCharges );
          particleWindowNode.particleLayer.addChild( node );
          model.waterList.addElementRemovedObserver( waterMolecule, new VoidFunction0().withAnonymousClassBody( {
            apply: function() {
              model.waterList.removeElementRemovedObserver( waterMolecule, this );
              particleWindowNode.particleLayer.removeChild( node );
            }
          } ) );
        }
      }
    } ) );
    //When a sucrose molecule is added in the model, add graphics for each atom in the view
    model.sucroseList.addElementAddedObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( sucrose ) {
        var compoundListNode = new CompoundListNode( transform, model, sugarBucket, sugarBucketParticleLayer, WaterCanvas.this, model.addSucrose, model.removeSucrose, not( model.showSugarAtoms ), new SucroseLabel(), true, model.showSugarPartialCharge, model.clockRunning, sucrose );
        compoundListNode.setIcon( false );
        compoundListNode.setInBucket( false );
        particleWindowNode.particleLayer.addChild( compoundListNode );
        model.sucroseList.addElementRemovedObserver( sucrose, new VoidFunction0().withAnonymousClassBody( {
          apply: function() {
            model.sucroseList.removeElementRemovedObserver( sucrose, this );
            particleWindowNode.particleLayer.removeChild( compoundListNode );
          }
        } ) );
      }
    } ) );
    //When a salt ion is added in the model, add graphics for each atom in the view
    model.saltIonList.addElementAddedObserver( new VoidFunction1().withAnonymousClassBody( {
      apply: function( ion ) {
        var compoundListNode = new CompoundListNode( transform, model, saltBucket, saltBucketParticleLayer, WaterCanvas.this, model.addSaltIon, model.removeSaltIon, model.showChargeColor, new SaltIonLabel(), false, new Property( false ), model.clockRunning, ion );
        compoundListNode.setIcon( false );
        compoundListNode.setInBucket( false );
        particleWindowNode.particleLayer.addChild( compoundListNode );
        model.saltIonList.addElementRemovedObserver( ion, new VoidFunction0().withAnonymousClassBody( {
          apply: function() {
            model.saltIonList.removeElementRemovedObserver( ion, this );
            particleWindowNode.particleLayer.removeChild( compoundListNode );
          }
        } ) );
      }
    } ) );
    //Start out the buckets with salt and sugar
    addSaltToBucket();
    addSugarToBucket();
    //When the sim resets, put the sugar and salt back in the buckets
    model.addResetListener( new VoidFunction0().withAnonymousClassBody( {
      apply: function() {
        addSaltToBucket();
        addSugarToBucket();
      }
    } ) );
  }

  return inherit( SugarAndSaltSolutionsCanvas, WaterCanvas, {
//Called when the user switches to the water tab from another tab.  Remembers if the JMolDialog was showing and restores it if so
      moduleActivated: function() {
        sucrose3DDialog.activate();
      },
//Called when the user switches to another tab.  Stores the state of the jmol dialog so that it can be restored when the user comes back to this tab
      moduleDeactivated: function() {
        sucrose3DDialog.deactivate();
      },
//Puts a single salt crystal in the sugar bucket for the user to drag out

      //private
      addSaltToBucket: function() {
        saltBucketParticleLayer.removeAllChildren();
        //Create a model element for the sucrose crystal that the user will drag
        var crystal = new SodiumChlorideCrystal( ZERO, 0 ).withAnonymousClassBody( {
          initializer: function() {
            addConstituent( new Constituent( new SaltIon.ChlorideIon(), ZERO ) );
            //Add in the experimentally determined order so it will form a small square crystal
            addConstituent( getOpenSites().get( 1 ).toConstituent() );
            addConstituent( getOpenSites().get( 2 ).toConstituent() );
            addConstituent( getOpenSites().get( 4 ).toConstituent() );
          }
        } );
        //Create the node for sugar that will be shown in the bucket that the user can grab
        var compoundListNode = new CompoundListNode( transform, model, saltBucket, saltBucketParticleLayer, this, model.addSaltIon, model.removeSaltIon, model.showChargeColor, new SaltIonLabel(), true, new Property( false ), model.clockRunning, crystal.getConstituentParticleList().toArray( new SaltIon[crystal.getConstituentParticleList().size()] ) );
        //Initially put the crystal node in between the front and back of the bucket layers, it changes layers when grabbed so it will be in front of the bucket
        saltBucketParticleLayer.addChild( compoundListNode );
        //Center it on the bucket hole after it has been added to the layer
        compoundListNode.moveToBucket();
      },
//Puts a single sugar crystal in the salt bucket for the user to grab

      //private
      addSugarToBucket: function() {
        sugarBucketParticleLayer.removeAllChildren();
        //Create a model element for the sucrose crystal that the user will drag
        var crystal = new SucroseCrystal( ZERO, 0 ).withAnonymousClassBody( {
          initializer: function() {
            addConstituent( new Constituent( new Sucrose( ZERO, Math.PI / 2 ), ZERO ) );
            //Add at the 2nd open site instead of relying on random so that it will be horizontally latticed, so it will fit in the bucket
            addConstituent( new Constituent( new Sucrose( ZERO, Math.PI / 2 ), getOpenSites().get( 2 ).relativePosition ) );
          }
        } );
        //Create the node for sugar that will be shown in the bucket that the user can grab
        var compoundListNode = new CompoundListNode( transform, model, sugarBucket, sugarBucketParticleLayer, this, model.addSucrose, model.removeSucrose, not( model.showSugarAtoms ), new SucroseLabel(), true, model.showSugarPartialCharge, model.clockRunning, crystal.getConstituentParticleList().toArray( new Sucrose[crystal.getConstituentParticleList().size()] ) );
        //Initially put the crystal node in between the front and back of the bucket layers, it changes layers when grabbed so it will be in front of the bucket
        sugarBucketParticleLayer.addChild( compoundListNode );
        //Center it on the bucket hole after it has been added to the layer
        compoundListNode.moveToBucket();
      }
    },
//statics
    {
      canvasSize: canvasSize
    } );
} );

