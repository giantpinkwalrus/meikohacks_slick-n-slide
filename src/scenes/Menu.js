import Phaser from 'phaser'
import { events } from '../utils'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
    this.startGame = this.startGame.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
  }

  preload () {}

  buttonAction () {
    console.log('logitus')
  }

  startGame () {
    this.scene.start('GameScene', { car: this.selection.texture.key })
  }

  toggleFullscreen () {
    // scale canvas to full screen
    let ratio = 1
    if (!this.fullscreen) {
      ratio = Math.min(window.innerWidth / 800, window.innerHeight / 600)
    }
    this.game.canvas.style.width = 800 * ratio + 'px'
    this.game.canvas.style.height = 600 * ratio + 'px'
    this.fullscreen = !this.fullscreen
  }

  create () {
    // this.scene.start('MenuScene')
    const theme = window.game.sound.add('theme')
    theme.play()
    theme.loop = true

    this.fullscreen = false
    this.add.tileSprite(398, 298, 800, 600, 'menu')

    const button = this.add.text(300, 400, 'Start the game', {
      font: '32px Bangers',
      fill: '#fff'
    })
    button.setInteractive()
    button.on('pointerup', this.startGame)

    const fullscreenToggle = this.add.text(325, 470, 'Toggle fullscreen', {
      font: '18px Bangers',
      fill: '#fff'
    })
    fullscreenToggle.setInteractive()
    fullscreenToggle.on('pointerup', this.toggleFullscreen)

    const pointerTargets = [button, fullscreenToggle]
    pointerTargets.forEach((el) => {
      el.on('pointerover', () => {
        el.tint = 0xffff00
        this.game.canvas.style.cursor = 'pointer'
      })
      el.on('pointerout', () => {
        el.tint = 0xffffff
        this.game.canvas.style.cursor = 'default'
      })
    })

    const cars = [
      this.add.sprite(290, 300, 'vehicle_car'),
      this.add.sprite(325, 300, 'vehicle_dragcar'),
      this.add.sprite(360, 300, 'williams'),
      this.add.sprite(395, 300, 'toyota'),
      this.add.sprite(430, 300, 'ferrari'),
      this.add.sprite(465, 300, 'motor_bike'),
      this.add.sprite(500, 300, 'vehicle_ufo')
    ]

    this.selection = cars[0]
    events.emit('car-selected', this.selection.texture.key)

    cars.forEach(car => {
      car.setInteractive()
      car.on('pointerup', () => {
        this.selection.angle = 0
        this.selection = car
        events.emit('car-selected', car.texture.key)
      })
      car.on('pointerover', () => {
        this.game.canvas.style.cursor = 'pointer'
      })
      car.on('pointerout', () => {
        this.game.canvas.style.cursor = 'default'
      })
    })
  }

  update () {
    this.selection.angle += 1
  }
}
