/* globals __DEV__ */
import Phaser from 'phaser'

import Mushroom from '../sprites/Mushroom'

var cursors
export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }
  init () {}
  preload () {}
  update () {
    if (cursors.left.isDown) {
      this.mushroom.body.setAngularVelocity(-300)
    } else if (cursors.right.isDown) {
      this.mushroom.body.setAngularVelocity(300)
    } else {
      this.mushroom.body.setAngularVelocity(0)
    }
  }

  create () {
    this.mushroom = new Mushroom({
      scene: this,
      x: 400,
      y: 300,
      asset: 'mushroom'
    })

    this.add.existing(this.mushroom)
    this.physics.add.existing(this.mushroom)
    this.mushroom.body.useDamping = true
    this.mushroom.body.setDrag(1000, 1000)
    cursors = this.input.keyboard.createCursorKeys()
    this.add.text(100, 100, 'Phaser 3 - ES6 - Webpack ', {
      font: '64px Bangers',
      fill: '#7744ff'
    })
  }
}
