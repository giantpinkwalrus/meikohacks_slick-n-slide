import Phaser from 'phaser'
import WebFont from 'webfontloader'
import io from 'socket.io-client'
import { events } from '../utils'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })

    this.players = []
  }

  init () {
    this.socket = io.connect('http://localhost:80')
    this.addPlayer = this.addPlayer.bind(this)
    this.socket.on('currentPlayers', (data) => {
      window.game.playerId = this.socket.id
      Object.keys(data).forEach(key => {
        if (data[key].playerId !== this.socket.id) {
          this.addPlayer(data[key])
        }
      })
    })
    this.socket.on('newPlayer', (data) => {
      this.addPlayer(data)
      events.emit('newPlayer')
    })
    this.socket.on('disconnect', (id) => {
      const player = this.players.filter(item => item.playerId === id)[0]
      if (player) {
        console.log(player.name + ' has been disconnected!')
        events.emit('player-disconnect', player.name)
        const index = this.players.map(p => p.playerId).indexOf(id)
        this.players.splice(index, index + 1)
        console.log(this.players)
      }
    })
    this.socket.on('position-change', data => {
      events.emit('position-change', data)
    })
    this.socket.on('starting-in', (time) => {
      events.emit('starting-in', time)
    })
    this.socket.on('game-start', () => {
      events.emit('game-start')
    })

    // internal events to socket
    events.on('position', (data) => {
      this.socket.emit('position', data)
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
      this.scene.start('SplashScene')
    }
  }

  addPlayer (player) {
    this.players.push(player)
    window.game.players = this.players
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
