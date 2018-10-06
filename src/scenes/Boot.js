import Phaser from 'phaser'
import WebFont from 'webfontloader'
import io from 'socket.io-client'
import uuid from 'uuid/v1'
import { events } from '../utils'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })

    this.players = []
  }

  init () {
    this.socket = io.connect('http://localhost:80')
    const playerUuid = uuid()
    window.playerUuid = playerUuid
    this.socket.emit('game-join', { uuid: playerUuid })
    this.socket.on('game-joined', ({ data }) => {
      this.players = data.session.players
      events.emit('game-joined')
    })
    this.socket.on('game-start', data => {
      console.log('game-start')
      window.session = data.session
      this.scene.start('SplashScene')
    })
    events.on('position', (data) => {
      // if (window.session) {
      // console.log(window.session)
      // io.to(window.session.id).emit('position', data)
      this.socket.emit('position', data)
      // }
    })
  }

  preload () {
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)

    this.text = this.add.text(200, 250, 'Waiting players to join in...')

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

    events.on('game-joined', () => {
      this.text.setText(`We have ${this.players.length} / 4 players. Waiting for more \r\n
      ${this.players.map(player => player.name)} \r\n
      `)
    })

    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })
  }

  update () {
    if (this.fontsReady) {
      // this.scene.start('SplashScene')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
