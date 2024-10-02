import Space from '../scenes/space'
import Phaser from 'phaser'
import { MATTER_DEBUG } from '../data/constants'

class Game {
  start() {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#14213d',
      parent: 'phaser-example',
      physics: {
        default: 'matter',
        matter: {
          gravity: {
            y: 0
          },
          enableSleep: true,
          debug: {
            showVelocity: true,
            showAngleIndicator: true
          },
          plugins: {
            attractors: true
          }
        }
      },
      scene: Space,
      inputSmoothFactor: 0.5
    }

    const game = new Phaser.Game(config)
  }

  createPlanets() {}
}

export default Game
