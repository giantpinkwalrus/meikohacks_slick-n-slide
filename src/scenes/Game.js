/* globals __DEV__ */
import Phaser from 'phaser'

import Car from '../sprites/Car'

var cursors
export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }
  init () {}
  preload () {}
  update () {
    if (cursors.left.isDown) {
      this.car.body.setAngularVelocity(-300)
    } else if (cursors.right.isDown) {
      this.car.body.setAngularVelocity(300)
    } else {
      this.car.body.setAngularVelocity(0)
    }
  }

  create () {
    this.car = new Car({
      scene: this,
      x: 400,
      y: 300,
      asset: 'vehicle_car'
    })

    this.add.existing(this.car)
    this.physics.add.existing(this.car)
    this.car.body.useDamping = true
    this.car.body.setDrag(1000, 1000)
    cursors = this.input.keyboard.createCursorKeys()
    this.add.text(100, 100, 'Phaser 3 - ES6 - Webpack ', {
      font: '64px Bangers',
      fill: '#7744ff'
    })
  }
}
