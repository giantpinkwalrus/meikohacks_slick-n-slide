/* globals __DEV__ */
import Phaser from 'phaser'

import Car from '../sprites/Car'

var cursors
export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  init () {
  }

  preload () {
  }

  update () {
    if (cursors.left.isDown && cursors.up.isDown) {
      Phaser.Physics.Matter.Matter.Body.setAngularVelocity(this.car.body, -0.02)
      this.car.angle -= 2
    } else if (cursors.right.isDown && cursors.up.isDown) {
      Phaser.Physics.Matter.Matter.Body.setAngularVelocity(this.car.body, 0.02)
      this.car.angle += 2
    }

    if (cursors.up.isDown) {
      this.car.thrust(0.025)
    } else if (cursors.down.isDown) {
      this.car.thrustBack(0.025)
    }
  }

  create () {
    this.car = this.matter.add.image(400, 300, 'motor_bike')

    this.car.setAngle(0)
    this.car.setFrictionAir(0.2)
    this.car.setMass(10)
    cursors = this.input.keyboard.createCursorKeys()
    this.add.text(100, 100, 'Phaser 3 - ES6 - Webpack ', {
      font: '64px Bangers',
      fill: '#7744ff'
    })
  }
}
