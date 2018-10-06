import Phaser from 'phaser'
import stages from '../stages'

export default class extends Phaser.GameObjects.Sprite {
  constructor ({ scene, x, y, asset }) {
    super(scene, x, y, asset)
    this.trackdata = stages[asset]
  }
}
