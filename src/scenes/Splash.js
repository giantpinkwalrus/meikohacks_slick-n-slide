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
    this.load.image('overlay', 'assets/maps/overlay.png')
    this.load.image('track_hacks', 'assets/maps/track_hacks.png')
    this.load.image('track_hacks_clean', 'assets/maps/track_hacks_clean.png')
  }

  create () {
    this.scene.start('GameScene')
  }

  update () {}
}
