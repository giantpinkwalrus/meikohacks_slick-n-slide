import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.load.image('vehicle_car', 'assets/images/vehicle_car.png')
    this.load.image('motor_bike', 'assets/images/vehicle_motorbike.png')
    this.load.image('vehicle_ufo', 'assets/images/vehicle_ufo.png')
    this.load.image('track_hacks_clean', 'assets/maps/track1/track_hacks_clean.png')
    this.load.image('track2', 'assets/maps/track2/track2.png')
    this.load.image('track3', 'assets/maps/track3/track3.png')
    this.load.image('track_nascar', 'assets/maps/track4/track_nascar.png')
  }

  create () {
    this.scene.start('GameScene')
  }

  update () {}
}
