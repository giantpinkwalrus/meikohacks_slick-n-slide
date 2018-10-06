/* globals __DEV__ */
import Phaser from 'phaser'
import { events } from '../utils'

import Track from '../sprites/Track'
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
    events.on('position-change', (pos) => {
      const index = this.players.map(p => p.playerId).indexOf(pos.uuid)
      this.matterPlayers[index].x = pos.x
      this.matterPlayers[index].y = pos.y
      this.matterPlayers[index].angle = pos.angle
    })

    events.on('newPlayer', () => {
      this.players = window.game.players
    })

    events.on('player-disconnect', (name) => {
      const disconnect = this.add.text(10, 10, `${name} has been disconnected!`, {
        font: '24px sans-serif',
        fill: '#ff0000'
      })
      setTimeout(() => {
        disconnect.destroy()
      }, 5000)
    })

    events.on('starting-in', (time) => {
      this.starting.setText(time)
    })

    events.on('game-start', () => {
      this.lock = false
      this.starting.setText('GO!')
      setTimeout(() => { this.starting.setText('') }, 2000)
    })
  }

  preload () {
    this.track = new Track({ x: 0, y: 0, scene: this, asset: 'track_hacks_clean' })
  }

  update () {
    if (this.lock) {
      return
    }
    if (cursors.left.isDown && this.car.getData('engineThrust')) {
      this.car.angle -= carSpecs.turning *
        this.car.getData('engineThrust') *
        (keySpace.isDown ? carSpecs.handBreakModifier : 1)
    } else if (cursors.right.isDown && this.car.getData('engineThrust')) {
      this.car.angle += carSpecs.turning *
        this.car.getData('engineThrust') *
        (keySpace.isDown ? carSpecs.handBreakModifier : 1)
    }

    this.car.thrust(this.car.getData('engineThrust') * carSpecs.maxThrust / this.car.getData('engineThrustGrassMult'))
    if (cursors.up.isDown) {
      if (!keySpace.isDown) {
        this.car.setData('engineThrust',
          clamp(0,
            this.car.getData('engineThrustMax'),
            this.car.getData('engineThrust') + 0.1))
      }
    } else {
      this.car.setData('engineThrust',
        clamp(0,
          this.car.getData('engineThrustMax'),
          this.car.getData('engineThrust') - 0.005))
    }
    events.emit('position', {
      uuid: this.playerId,
      x: this.car.x,
      y: this.car.y,
      angle: this.car.angle
    })
    console.log(this.car)
  }

  create () {
    this.playerId = window.game.playerId
    this.currentPlayer = window.game.currentPlayer
    this.lock = true

    this.points = []
    this.origin = { x: null, y: null }
    this.input.on('pointerdown', function (pointer) {
      if (this.origin.x === null) {
        this.origin.x = pointer.x
        this.origin.y = pointer.y
      }
      this.points.push({ x: pointer.position.x, y: pointer.position.y })
      const graphics = this.add.graphics({ x: 0, y: 0 })

      graphics.lineStyle(2, 0xff00ff)

      graphics.beginPath()

      graphics.moveTo(this.points[0].x, this.points[0].y)

      for (let i = 1; i < this.points.length; i++) {
        graphics.lineTo(this.points[i].x, this.points[i].y)
      }
      graphics.closePath()
      graphics.strokePath()
    }, this)

    this.input.keyboard.on('keydown_A', function (event) {
      console.log(this.points.splice(0, this.points.length))
    }, this)

    this.track.setDisplayOrigin(0)
    this.add.existing(this.track)

    this.trackGrass = []

    this.track.trackdata.track_grass.forEach(poly => {
      if (poly.x == null || poly.y == null) {
        return
      }
      const collider = this.matter.add.fromVertices(
        poly.x ? poly.x : this.track.width / 2,
        poly.y ? poly.y : this.track.height / 2,
        poly.verts, { isStatic: true, isSensor: true })
      this.trackGrass.push(collider)
    })

    this.car = this.matter.add.image(this.currentPlayer.x, this.currentPlayer.y, 'motor_bike')
    this.car.setAngle(this.currentPlayer.angle)

    this.matterCollision.addOnCollideActive({
      objectA: this.car,
      objectB: this.trackGrass,
      callback: eventData => {
        this.car.setData('engineThrustGrassMult',
          clamp(1, 4,
            this.car.getData('engineThrustGrassMult') + 0.3))
        console.log('grass')
      }
    })

    this.matterCollision.addOnCollideStart({
      objectA: this.car,
      objectB: this.trackGrass,
      callback: eventData => {
        this.car.setData('engineThrustMax', 0.5)
      }
    })

    this.matterCollision.addOnCollideEnd({
      objectA: this.car,
      objectB: this.trackGrass,
      callback: eventData => {
        this.car.setData('engineThrustMax', 1)
        this.car.setData('engineThrustGrassMult', 1)
      }
    })

    this.car.setFrictionAir(carSpecs.friction)
    this.car.setMass(carSpecs.mass)
    this.car.setData('engineThrust', 0)
    this.car.setData('engineThrustGrassMult', 1)
    this.car.setData('engineThrustMax', 1)

    this.starting = this.add.text(400, 10, '30', {
      font: '24px sans-serif',
      fill: '#ff0000'
    })

    this.players = window.game.players
    this.matterPlayers = []
    if (this.players) {
      this.players.forEach((player, i) => {
        this.matterPlayers.push(this.matter.add.image(player.x, player.y, 'motor_bike'))
      })
    }
    // controls
    cursors = this.input.keyboard.createCursorKeys()
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }
}
