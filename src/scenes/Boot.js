import Phaser from 'phaser'
import WebFont from 'webfontloader'
import io from 'socket.io-client'
import uuid from 'uuid/v1'
import { events } from '../utils'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  init () {
    this.socket = io.connect('http://localhost:3000')
    const playerUuid = uuid()
    window.playerUuid = playerUuid
    this.socket.emit('game-join', { uuid: playerUuid })
    this.socket.on('game-start', data => {
      console.log('game-start')
      // window.session = data.session
      // this.socket.join(data.session.id)
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
    this.add.text(100, 100, 'loading fonts...')

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

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
