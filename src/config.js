import Phaser from 'phaser'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'

export default {
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 600,
  localStorageName: 'phaseres6webpack',
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      fps: 60,
      gravity: {
        x: 0,
        y: 0
      }
    }
  },
  plugins: {
    scene: [{
      plugin: PhaserMatterCollisionPlugin,
      key: 'matterCollision',
      mapping: 'matterCollision'
    }]
  }
}
