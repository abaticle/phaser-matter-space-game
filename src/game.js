import Space from '../scenes/space'
import { MATTER_DEBUG } from '../data/constants'

class Game {
  start() {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#000000',
      parent: 'phaser-example',
      physics: {
        default: 'matter',
        matter: {
          gravity: {
            y: 0
          },
          enableSleep: true,
          debug: MATTER_DEBUG
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
