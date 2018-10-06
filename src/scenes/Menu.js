import Phaser from 'phaser'
import { event } from 'events'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
  }
  
  preload () {}
  
  buttonAction () {
    console.log('logitus');
  }
  
  startGame () {
    this.scene.start('GameScene', true, false)
  }
  
  create () {
    this.add.text(200, 200, 'Menju', {
      font: '24px sans-serif',
      fill: '#ff0000'
    })

    // this.scene.start('MenuScene')
    this.add.tileSprite(400, 300, 800, 600, 'menu')
    const button = this.add.sprite(400, 400, 'button')
    button.inputEnabled = true
    // button.input = addEventListener('click', () => {
    //   this.startGame()
    // })
  
    const car = this.add.sprite(200,200, 'vehicle_car')
    const drag = this.add.sprite(230,200, 'vehicle_dragcar')
    const williams = this.add.sprite(260,200, 'williams')
    const toyota = this.add.sprite(290,200, 'toyota')
    const ferrari = this.add.sprite(320,200, 'ferrari')
    const bike = this.add.sprite(350,200, 'motor_bike')
    const ufo = this.add.sprite(380,200, 'vehicle_ufo')
    console.log(car);
    
    car.inputEnabled = true
    console.log(car.input)
  }
  
  update () {
  
  }
}
