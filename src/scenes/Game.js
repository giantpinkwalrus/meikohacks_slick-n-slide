/* globals __DEV__ */
import Phaser from 'phaser'

// import Car from '../sprites/Car'

var cursors
var keySpace
const carSpecs = {
  friction: 0.04,
  mass: 40,
  maxThrust: 0.035,
  turning: 2.7,
  handBreakModifier: 1.9
}
function clamp (min, max, value) {
  return Math.min(Math.max(value, min), max)
};
export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  init () {
  }

  preload () {
  }

  update () {
    if (cursors.left.isDown && this.car.getData('engineThrust')) {
      this.car.angle -= carSpecs.turning *
        this.car.getData('engineThrust') *
        (keySpace.isDown ? carSpecs.handBreakModifier : 1)
    } else if (cursors.right.isDown && this.car.getData('engineThrust')) {
      this.car.angle += carSpecs.turning *
        this.car.getData('engineThrust') *
        (keySpace.isDown ? carSpecs.handBreakModifier : 1)
    }

    this.car.thrust(this.car.getData('engineThrust') * carSpecs.maxThrust)
    if (cursors.up.isDown) {
      if (!keySpace.isDown) {
        this.car.setData('engineThrust', clamp(0, 1, this.car.getData('engineThrust') + 0.1))
      }
    } else {
      this.car.setData('engineThrust', clamp(0, 1, this.car.getData('engineThrust') - 0.005))
    }
  }

  create () {
    this.car = this.matter.add.image(400, 300, 'motor_bike')

    this.car.setAngle(0)
    this.car.setFrictionAir(carSpecs.friction)
    this.car.setMass(carSpecs.mass)
    this.car.setData('engineThrust', 0)
    cursors = this.input.keyboard.createCursorKeys()
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.add.text(100, 100, 'Phaser 3 - ES6 - Webpack ', {
      font: '64px Bangers',
      fill: '#7744ff'
    })
  }
}
