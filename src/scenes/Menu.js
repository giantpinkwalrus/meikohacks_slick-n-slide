import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
  }

  preload () {}

  buttonAction () {
    console.log('logitus')
  }

  startGame () {
    this.scene.start('GameScene', { car: this.selection.texture.key })
  }

  create () {
    // this.scene.start('MenuScene')
    const theme = window.game.sound.add('theme')
    theme.play()
    theme.loop = true

    this.add.tileSprite(400, 300, 800, 600, 'menu')

    const button = this.add.text(300, 400, 'Start the game', {
      font: '32px Bangers',
      fill: '#fff'
    })
    button.setInteractive()
    button.on('pointerup', () => { this.startGame() })
    button.on('pointerover', () => {
      button.tint = 0xffff00
      this.game.canvas.style.cursor = 'pointer'
    })
    button.on('pointerout', () => {
      button.tint = 0xffffff
      this.game.canvas.style.cursor = 'default'
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
    cars.forEach(car => {
      car.setInteractive()
      car.on('pointerup', () => {
        this.selection.angle = 0
        this.selection = car
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
