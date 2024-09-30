import { GAME_DEFAULT_SPEED, GAME_DEFAULT_ZOOM, KEYS } from '../data/constants'
import Planet from '../src/planet'
import PlanetManager from '../src/planet-manager'
import Spaceship from '../src/spaceship'

class Space extends Phaser.Scene {
  #keys = {}

  /**
   * Planet manager
   * @type {PlanetManager}
   */
  #planetManager

  /**
   * Main camera
   * @type {Phaser.Cameras.Scene2D.Camera}
   */
  #camera

  /**
   * Spacefhip
   * @type {Spaceship}
   */
  #spaceship

  /**
   * Game speed
   * @type {Number}
   */
  #gameSpeed = GAME_DEFAULT_SPEED

  preload() {
    this.#planetManager = new PlanetManager()
  }

  create() {
    this.createPlanets()
    this.createSpaceship()
    this.createCamera()
    this.createMouseInputs()
    this.createKeyboardInputs()
  }

  /**
   * Create Camera
   */
  createCamera() {
    this.#camera = this.cameras.main
    this.#camera.setZoom(GAME_DEFAULT_ZOOM)
    //this.#camera.startFollow(this.#spaceship, false, 0.5, 0.5)
  }

  /**
   * Initiate keyboard
   */
  createKeyboardInputs() {
    Object.keys(KEYS).forEach((key) => {
      const keyNames = KEYS[key]

      keyNames.forEach((keyName) => {
        this.#keys[key] = this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes[keyName]
        )
      })
    })
  }

  /**
   * Initiate Mouse
   */
  createMouseInputs() {
    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      this.onPointerDown.bind(this)
    )
    this.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      this.onPointerMove.bind(this)
    )
    this.input.on(
      Phaser.Input.Events.POINTER_WHEEL,
      this.onPointerWheel.bind(this)
    )
  }

  /**
   * Create spaceship
   */
  createSpaceship() {
    this.#spaceship = new Spaceship({
      scene: this,
      maxspeed: 10
    })
  }

  /**
   * Handle keyboard keys
   * @param {Number} delta Delta time
   */
  handleKeys(delta) {
    if (this.#keys.GAME_SPEED_UP.isDown) {
      this.#gameSpeed += 1
    }

    if (this.#keys.GAME_SPEED_DOWN.isDown) {
      this.#gameSpeed -= 1
    }
    if (this.#keys.UP.isDown) {
      this.#spaceship.thrust(true)
    }
    if (this.#keys.DOWN.isDown) {
      this.#spaceship.thrust(false)
    }
    if (this.#keys.LEFT.isDown) {
      this.#spaceship.steer(true)
    }
    if (this.#keys.RIGHT.isDown) {
      this.#spaceship.steer(false)
    }
    if (!this.#keys.RIGHT.isDown && !this.#keys.LEFT.isDown) {
      this.#spaceship.stopSteer()
    }
  }

  /**
   * Mouse click event handler
   * @param {Phaser.Input.Pointer} pointer
   */
  onPointerDown(pointer) {}

  /**
   * Mouse move event handler
   * @param {Phaser.Input.Pointer} pointer
   */
  onPointerMove(pointer) {
    if (!pointer.isDown) {
      return
    }

    const { x, y } = pointer.velocity

    this.#camera.scrollX -= (x * 0.1) / this.#camera.zoom
    this.#camera.scrollY -= (y * 0.1) / this.#camera.zoom
  }

  /**
   * Mouse move event handler
   * @param {Phaser.Input.Pointer} pointer
   */
  onPointerWheel(pointer, gameObjects, deltaX, deltaY, deltaZ) {
    const worldPoint = this.#camera.getWorldPoint(pointer.x, pointer.y)
    const newZoom = this.#camera.zoom - this.#camera.zoom * 0.011 * deltaY
    this.#camera.zoom = Phaser.Math.Clamp(newZoom, 0.1, 20)

    this.#camera.preRender()
    const newWorldPoint = this.#camera.getWorldPoint(pointer.x, pointer.y)
    this.#camera.scrollX -= newWorldPoint.x - worldPoint.x
    this.#camera.scrollY -= newWorldPoint.y - worldPoint.y
  }

  /**
   * Create some planets
   */
  createPlanets() {
    const sun = new Planet({
      name: 'sun',
      description: 'Sun',
      scene: this,
      x: 300,
      y: 200,
      radius: 150,
      color: 0xfacc00
    })

    const earth = new Planet({
      name: 'earth',
      description: 'Earth',
      scene: this,
      x: 300,
      y: 500,
      radius: 20,
      color: 0x969fff,
      parent: sun,
      parentDistance: 1000,
      speed: 0.00001
    })

    const moon = new Planet({
      name: 'moon',
      description: 'Moon',
      scene: this,
      x: 300,
      y: 550,
      radius: 5,
      color: 0xd9d9d9,
      parent: earth,
      parentDistance: 50,
      speed: 0.0001
    })

    this.#planetManager.addPlanets([sun, earth, moon])
  }

  update(time, delta) {
    this.handleKeys(delta)
    this.#planetManager.update(time, delta * this.#gameSpeed)

    // TOFIX: pourquoi startfollow ca marche pas ??
    this.#camera.scrollX =
      this.#spaceship.getPosition().x - window.innerWidth / 2
    this.#camera.scrollY =
      this.#spaceship.getPosition().y - window.innerHeight / 2
  }
}

export default Space
