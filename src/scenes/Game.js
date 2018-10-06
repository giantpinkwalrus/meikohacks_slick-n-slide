/* globals __DEV__ */
import Phaser from 'phaser'
import { events } from '../utils'

import Track from '../sprites/Track'
// import Car from '../sprites/Car'

var cursors
var keySpace
let carSpecs
const carSpecsDefault = {
  friction: 0.04,
  mass: 44,
  maxThrust: 0.0365,
  turning: 3.2,
  handBreakModifier: 1.95,
  asset: 'vehicle_car'
}
const carSpecsTank = {
  friction: 0.04,
  mass: 94,
  maxThrust: 0.0365,
  turning: 3.2,
  handBreakModifier: 1.95,
  asset: 'vehicle_tank'
}
const carSpecsBike = {
  friction: 0.04,
  mass: 34,
  maxThrust: 0.0365,
  turning: 3.2,
  handBreakModifier: 1.95,
  asset: 'motor_bike'
}
const carSpecsUfo = {
  friction: 0.04,
  mass: 44,
  maxThrust: 0.0365,
  turning: 6.2,
  handBreakModifier: 5.95,
  asset: 'vehicle_ufo'
}
const carSpecsWilliams = {
  friction: 0.04,
  mass: 44,
  maxThrust: 0.0365,
  turning: 3.2,
  handBreakModifier: 1.95,
  asset: 'williams'
}
const carSpecsToyota = {
  friction: 0.04,
  mass: 44,
  maxThrust: 0.0265,
  turning: 5.2,
  handBreakModifier: 1.95,
  asset: 'toyota'
}
const carSpecsFerrari = {
  friction: 0.04,
  mass: 54,
  maxThrust: 0.0365,
  turning: 3.2,
  handBreakModifier: 2.95,
  asset: 'ferrari'
}
const carSpecsDrag = {
  friction: 0.04,
  mass: 34,
  maxThrust: 0.0465,
  turning: 3.2,
  handBreakModifier: 0.95,
  asset: 'vehicle_dragcar'
}
function clamp (min, max, value) {
  return Math.min(Math.max(value, min), max)
};
function calcRectDim (point1, point2) {
  return Math.max(point1, point2) - Math.min(point1, point2)
}
export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  init (config) {
    this.config = config
    switch(this.config.car) {
      case 'motor_bike':
        carSpecs = carSpecsBike
        break;
      case 'vehicle_dragcar':
        carSpecs = carSpecsDrag
        break;
      case 'toyota':
        carSpecs = carSpecsToyota
        break;
      case 'williams':
        carSpecs = carSpecsWilliams
        break;
      case 'ferrari':
        carSpecs = carSpecsFerrari
        break;
      case 'vehicle_tank':
        carSpecs = carSpecsTank
        break;
      case 'vehicle_ufo':
        carSpecs = carSpecsUfo
        break;
      default:
        carSpecs = carSpecsDefault
    }
    console.log(carSpecs);
    events.on('position-change', (pos) => {
      const index = this.players.map(p => p.playerId).indexOf(pos.uuid)
      this.matterPlayers[index].x = pos.x
      this.matterPlayers[index].y = pos.y
      this.matterPlayers[index].angle = pos.angle
    })

    events.on('newPlayer', (data) => {
      this.players = window.game.players
      this.matterPlayers.push(this.matter.add.image(data.x, data.y, 'motor_bike'))
    })

    events.on('player-disconnect', (player) => {
      const disconnect = this.add.text(10, 10, `${player.name} has been disconnected!`, {
        font: '24px sans-serif',
        fill: '#ff0000'
      })
      const index = this.players.map(p => p.playerId).indexOf(player.playerId)
      this.players.splice(index, index + 1)
      this.matterPlayers[index].destroy()
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
    this.running.play()
    if (this.lock) {
      return
    }
    if (this.car.getData('lapcount') >= 4) {
      // Track complete!
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

    this.hudLaps.setText(`${this.car.getData('lapcount')} / 4`)

    const currentLapText = this.time
    this.laptimesText.setText(`time: ${this.laptimes.map(l => l)}${this.laptimes.length ? ',' : ''}${currentLapText}`)
  }

  create () {
    // this.break = window.game.sound.add('break')
    // this.running = window.game.sound.add('running')
    // this.running.loop = true
    // this.running.volume = 0.5
    // this.running.detune = 0.4

    this.playerId = window.game.playerId
    this.currentPlayer = window.game.currentPlayer
    this.lock = true
    this.time = 0
    this.timer = setInterval(() => { this.time += 1 }, 1000)
    this.laptimes = []

    /*
    this.points = []

    this.input.on('pointerdown', function (pointer) {
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
    */

    this.input.on('pointerup', function (pointer) {
      const x1 = pointer.downX
      const y1 = pointer.downY
      const x2 = pointer.upX
      const y2 = pointer.upY
      const width = calcRectDim(x1, x2)
      const height = calcRectDim(y1, y2)
      const xpos = Math.min(x1, x2) + width / 2
      const ypos = Math.min(y1, y2) + height / 2
      const rect = new Phaser.Geom.Rectangle(xpos, ypos, width, height)
      console.log(rect)
      this.add.rectangle(xpos, ypos, width, height, 0xff0000, 0.5)
    }, this)

    this.track.setDisplayOrigin(0)
    this.add.existing(this.track)

    this.trackGrass = []
    this.trackCheckpoints = this.track.trackdata.checkpoints.map(({ x, y, width, height }, idx) =>
      this.matter.add.rectangle(x, y, width, height, { isStatic: true, isSensor: true, _order: idx }))

    this.track.trackdata.track_grass.forEach(poly => {
      if (poly.x == null || poly.y == null) {
        return
      }
      let collider
      if (poly.verts != null) {
        collider = this.matter.add.fromVertices(
          poly.x ? poly.x : this.track.width / 2,
          poly.y ? poly.y : this.track.height / 2,
          poly.verts, { isStatic: true, isSensor: true })
      } else {
        collider = this.matter.add.rectangle(poly.x, poly.y, poly.width, poly.height, { isStatic: true, isSensor: true })
      }
      this.trackGrass.push(collider)
    })

    this.car = this.matter.add.image(this.currentPlayer.x, this.currentPlayer.y, this.config.car)
    this.car.setAngle(this.currentPlayer.angle)
    this.car.setData('curCheckpoint', 0)
    this.car.setData('lapcount', 0)

    this.matterCollision.addOnCollideStart({
      objectA: this.car,
      objectB: this.trackCheckpoints,
      callback: eventdata => {
        const { bodyB: checkpoint } = eventdata
        const curCheckpoint = this.car.getData('curCheckpoint')
        if (checkpoint._order === curCheckpoint) {
          let nextCheckpoint = this.car.getData('curCheckpoint') + 1
          if (nextCheckpoint === this.trackCheckpoints.length) {
            this.car.setData('curCheckpoint', 0)
            this.car.setData('lapcount', this.car.getData('lapcount') + 1)
            this.laptimes.push(this.time)
            this.laptimesText.setText(this.laptimes.map(time => time))
            this.time = 0
            console.log(this.car.getData('lapcount'))
          } else {
            this.car.setData('curCheckpoint', nextCheckpoint)
          }
        }
      }
    })

    this.matterCollision.addOnCollideActive({
      objectA: this.car,
      objectB: this.trackGrass,
      callback: eventData => {
        this.car.setData('engineThrustGrassMult',
          clamp(1, 4,
            this.car.getData('engineThrustGrassMult') + 0.3))
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

    this.matter.add.sprite(400, 573, 'hud_overlay')
    this.hudName = this.add.text(700, 560, this.currentPlayer.name.toUpperCase(), {
      font: '17px sans-serif',
      fill: 'black'
    })

    this.hudLaps = this.add.text(600, 560, `${this.car.getData('lapcount')} / 4`, {
      font: '17px sans-serif',
      fill: 'black'
    })

    this.laptimesText = this.add.text(450, 560, 'time', {
      font: '17px sans-serif',
      fill: 'black'
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
